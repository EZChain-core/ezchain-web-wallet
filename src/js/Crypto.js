import { __awaiter, __generator } from 'tslib'
import { Buffer } from 'buffer/'
import createHash from 'create-hash'
/**
 * @ignore
 */
/**
 * Helper utility for encryption and password hashing, browser-safe.
 * Encryption is using AES-GCM with a random public nonce.
 */
var CryptoHelpers = /** @class */ (function () {
    function CryptoHelpers() {
        this.ivSize = 12
        this.saltSize = 16
        this.tagLength = 128
        this.aesLength = 256
        this.keygenIterations = 200000 //3.0, 2.0 uses 100000
    }
    /**
     * Internal-intended function for cleaning passwords.
     *
     * @param password
     * @param salt
     */
    CryptoHelpers.prototype._pwcleaner = function (password, slt) {
        var pw = Buffer.from(password, 'utf8')
        return this.sha256(Buffer.concat([pw, slt]))
    }
    /**
     * Internal-intended function for producing an intermediate key.
     *
     * @param pwkey
     */
    CryptoHelpers.prototype._keyMaterial = function (pwkey) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [
                    2 /*return*/,
                    window.crypto.subtle.importKey(
                        'raw',
                        new Uint8Array(pwkey),
                        { name: 'PBKDF2' },
                        false,
                        ['deriveKey']
                    ),
                ]
            })
        })
    }
    /**
     * Internal-intended function for turning an intermediate key into a salted key.
     *
     * @param keyMaterial
     * @param salt
     */
    CryptoHelpers.prototype._deriveKey = function (keyMaterial, salt) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [
                    2 /*return*/,
                    window.crypto.subtle.deriveKey(
                        {
                            name: 'PBKDF2',
                            salt: salt,
                            iterations: this.keygenIterations,
                            hash: 'SHA-256',
                        },
                        keyMaterial,
                        { name: 'AES-GCM', length: this.aesLength },
                        false,
                        ['encrypt', 'decrypt']
                    ),
                ]
            })
        })
    }
    /**
     * A SHA256 helper function.
     *
     * @param message The message to hash
     *
     * @returns A {@link https://github.com/feross/buffer|Buffer} containing the SHA256 hash of the message
     */
    CryptoHelpers.prototype.sha256 = function (message) {
        var buff
        if (typeof message === 'string') {
            buff = Buffer.from(message, 'utf8')
        } else {
            buff = Buffer.from(message)
        }
        return Buffer.from(createHash('sha256').update(buff).digest()) // ensures correct Buffer class is used
    }
    /**
     * Generates a randomized {@link https://github.com/feross/buffer|Buffer} to be used as a salt
     */
    CryptoHelpers.prototype.makeSalt = function () {
        var salt = Buffer.alloc(this.saltSize)
        window.crypto.getRandomValues(salt)
        return salt
    }
    /**
     * Produces a password-safe hash.
     *
     * @param password A string for the password
     * @param salt An optional {@link https://github.com/feross/buffer|Buffer} containing a salt used in the password hash
     *
     * @returns An object containing the "salt" and the "hash" produced by this function, both as {@link https://github.com/feross/buffer|Buffer}.
     */
    CryptoHelpers.prototype.pwhash = function (password, salt) {
        return __awaiter(this, void 0, void 0, function () {
            var slt, hash
            return __generator(this, function (_a) {
                if (salt instanceof Buffer) {
                    slt = salt
                    // @ts-ignore
                } else if (salt instanceof Uint8Array && process.env.NODE_ENV === 'test') {
                    slt = salt
                } else {
                    slt = this.makeSalt()
                }
                hash = this._pwcleaner(password, this._pwcleaner(password, slt))
                return [2 /*return*/, { salt: slt, hash: hash }]
            })
        })
    }
    /**
     * Encrypts plaintext with the provided password using AES-GCM.
     *
     * @param password A string for the password
     * @param plaintext The plaintext to encrypt
     * @param salt An optional {@link https://github.com/feross/buffer|Buffer} for the salt to use in the encryption process
     *
     * @returns An object containing the "salt", "iv", and "ciphertext", all as {@link https://github.com/feross/buffer|Buffer}.
     */
    CryptoHelpers.prototype.encrypt = function (password, plaintext, salt) {
        if (salt === void 0) {
            salt = undefined
        }
        return __awaiter(this, void 0, void 0, function () {
            var slt, pt, pwkey, keyMaterial, pkey, iv, ciphertext, _a, _b
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (typeof salt !== 'undefined' && salt instanceof Buffer) {
                            slt = salt
                        } else {
                            slt = this.makeSalt()
                        }
                        if (typeof plaintext !== 'undefined' && plaintext instanceof Buffer) {
                            pt = plaintext
                        } else {
                            pt = Buffer.from(plaintext, 'utf8')
                        }
                        pwkey = this._pwcleaner(password, slt)
                        return [4 /*yield*/, this._keyMaterial(pwkey)]
                    case 1:
                        keyMaterial = _c.sent()
                        return [4 /*yield*/, this._deriveKey(keyMaterial, slt)]
                    case 2:
                        pkey = _c.sent()
                        iv = Buffer.from(window.crypto.getRandomValues(new Uint8Array(this.ivSize)))
                        _b = (_a = Buffer).from
                        return [
                            4 /*yield*/,
                            window.crypto.subtle.encrypt(
                                {
                                    name: 'AES-GCM',
                                    iv: iv,
                                    additionalData: slt,
                                    tagLength: this.tagLength,
                                },
                                pkey,
                                pt
                            ),
                        ]
                    case 3:
                        ciphertext = _b.apply(_a, [_c.sent()])
                        return [
                            2 /*return*/,
                            {
                                salt: slt,
                                iv: iv,
                                ciphertext: ciphertext,
                            },
                        ]
                }
            })
        })
    }
    /**
     * Decrypts ciphertext with the provided password, iv, and salt.
     *
     * @param password A string for the password
     * @param ciphertext A {@link https://github.com/feross/buffer|Buffer} for the ciphertext
     * @param salt A {@link https://github.com/feross/buffer|Buffer} for the salt
     * @param iv A {@link https://github.com/feross/buffer|Buffer} for the iv
     */
    CryptoHelpers.prototype.decrypt = function (password, ciphertext, salt, iv) {
        return __awaiter(this, void 0, void 0, function () {
            var pwkey, keyMaterial, pkey, pt, _a, _b
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        pwkey = this._pwcleaner(password, salt)
                        return [4 /*yield*/, this._keyMaterial(pwkey)]
                    case 1:
                        keyMaterial = _c.sent()
                        return [4 /*yield*/, this._deriveKey(keyMaterial, salt)]
                    case 2:
                        pkey = _c.sent()
                        _b = (_a = Buffer).from
                        return [
                            4 /*yield*/,
                            window.crypto.subtle.decrypt(
                                {
                                    name: 'AES-GCM',
                                    iv: iv,
                                    additionalData: salt,
                                    tagLength: 128,
                                },
                                pkey, // from generateKey or importKey above
                                ciphertext // ArrayBuffer of the data
                            ),
                        ]
                    case 3:
                        pt = _b.apply(_a, [_c.sent()])
                        return [2 /*return*/, pt]
                }
            })
        })
    }
    return CryptoHelpers
})()
export default CryptoHelpers
//# sourceMappingURL=Crypto.js.map
