import { __awaiter, __generator } from "tslib";
import { avm, bintools } from '@/AVA';
import Crypto from '@/js/Crypto';
import { keyToKeypair } from '@/helpers/helper';
import * as bip39 from 'bip39';
import { Buffer as AjsBuffer } from 'ezchainjs2';
var cryptoHelpers = new Crypto();
var KEYSTORE_VERSION = '6.0';
var ITERATIONS_V2 = 100000;
var ITERATIONS_V3 = 200000; // and any version above
var SUPPORTED_VERSION = ['2.0', '3.0', '4.0', '5.0', '6.0'];
function readV2(data, pass) {
    return __awaiter(this, void 0, void 0, function () {
        var version, salt, pass_hash, checkHashString, checkHash, keys, keysDecrypt, i, key_data, key, nonce, key_decrypt, key_string;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    version = data.version;
                    cryptoHelpers.keygenIterations = ITERATIONS_V2;
                    salt = bintools.cb58Decode(data.salt);
                    pass_hash = data.pass_hash;
                    return [4 /*yield*/, cryptoHelpers._pwcleaner(pass, salt)];
                case 1:
                    checkHash = _a.sent();
                    checkHashString = bintools.cb58Encode(AjsBuffer.from(checkHash));
                    if (checkHashString !== pass_hash) {
                        throw 'INVALID_PASS';
                    }
                    keys = data.keys;
                    keysDecrypt = [];
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < keys.length)) return [3 /*break*/, 5];
                    key_data = keys[i];
                    key = bintools.cb58Decode(key_data.key);
                    nonce = bintools.cb58Decode(key_data.iv);
                    return [4 /*yield*/, cryptoHelpers.decrypt(pass, key, salt, nonce)];
                case 3:
                    key_decrypt = _a.sent();
                    key_string = bintools.cb58Encode(AjsBuffer.from(key_decrypt));
                    keysDecrypt.push({
                        key: key_string,
                    });
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/, {
                        version: version,
                        activeIndex: 0,
                        keys: keysDecrypt,
                    }];
            }
        });
    });
}
function readV3(data, pass) {
    return __awaiter(this, void 0, void 0, function () {
        var version, salt, pass_hash, checkHashString, checkHash, keys, keysDecrypt, i, key_data, key, nonce, key_decrypt, key_string;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    version = data.version;
                    cryptoHelpers.keygenIterations = ITERATIONS_V3;
                    salt = bintools.cb58Decode(data.salt);
                    pass_hash = data.pass_hash;
                    return [4 /*yield*/, cryptoHelpers.pwhash(pass, salt)];
                case 1:
                    checkHash = _a.sent();
                    checkHashString = bintools.cb58Encode(AjsBuffer.from(checkHash.hash));
                    if (checkHashString !== pass_hash) {
                        throw 'INVALID_PASS';
                    }
                    keys = data.keys;
                    keysDecrypt = [];
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < keys.length)) return [3 /*break*/, 5];
                    key_data = keys[i];
                    key = bintools.cb58Decode(key_data.key);
                    nonce = bintools.cb58Decode(key_data.iv);
                    return [4 /*yield*/, cryptoHelpers.decrypt(pass, key, salt, nonce)];
                case 3:
                    key_decrypt = _a.sent();
                    key_string = bintools.cb58Encode(AjsBuffer.from(key_decrypt));
                    keysDecrypt.push({
                        key: key_string,
                    });
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/, {
                        version: version,
                        activeIndex: 0,
                        keys: keysDecrypt,
                    }];
            }
        });
    });
}
function readV4(data, pass) {
    return __awaiter(this, void 0, void 0, function () {
        var version, salt, pass_hash, checkHashString, checkHash, keys, keysDecrypt, i, key_data, key, nonce, key_decrypt, key_string;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    version = data.version;
                    cryptoHelpers.keygenIterations = ITERATIONS_V3;
                    salt = bintools.cb58Decode(data.salt);
                    pass_hash = data.pass_hash;
                    return [4 /*yield*/, cryptoHelpers.pwhash(pass, salt)];
                case 1:
                    checkHash = _a.sent();
                    checkHashString = bintools.cb58Encode(AjsBuffer.from(checkHash.hash));
                    if (checkHashString !== pass_hash) {
                        throw 'INVALID_PASS';
                    }
                    keys = data.keys;
                    keysDecrypt = [];
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < keys.length)) return [3 /*break*/, 5];
                    key_data = keys[i];
                    key = bintools.cb58Decode(key_data.key);
                    nonce = bintools.cb58Decode(key_data.iv);
                    return [4 /*yield*/, cryptoHelpers.decrypt(pass, key, salt, nonce)];
                case 3:
                    key_decrypt = _a.sent();
                    key_string = bintools.cb58Encode(AjsBuffer.from(key_decrypt));
                    keysDecrypt.push({
                        key: key_string,
                    });
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/, {
                        version: version,
                        activeIndex: 0,
                        keys: keysDecrypt,
                    }];
            }
        });
    });
}
function readV5(data, pass) {
    return __awaiter(this, void 0, void 0, function () {
        var version, salt, pass_hash, checkHashString, checkHash, keys, keysDecrypt, i, key_data, key, nonce, key_decrypt, key_string;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    version = data.version;
                    cryptoHelpers.keygenIterations = ITERATIONS_V3;
                    salt = bintools.cb58Decode(data.salt);
                    pass_hash = data.pass_hash;
                    return [4 /*yield*/, cryptoHelpers.pwhash(pass, salt)];
                case 1:
                    checkHash = _a.sent();
                    checkHashString = bintools.cb58Encode(AjsBuffer.from(checkHash.hash));
                    if (checkHashString !== pass_hash) {
                        throw 'INVALID_PASS';
                    }
                    keys = data.keys;
                    keysDecrypt = [];
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < keys.length)) return [3 /*break*/, 5];
                    key_data = keys[i];
                    key = bintools.cb58Decode(key_data.key);
                    nonce = bintools.cb58Decode(key_data.iv);
                    return [4 /*yield*/, cryptoHelpers.decrypt(pass, key, salt, nonce)];
                case 3:
                    key_decrypt = _a.sent();
                    key_string = key_decrypt.toString();
                    keysDecrypt.push({
                        key: key_string,
                    });
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/, {
                        version: version,
                        activeIndex: 0,
                        keys: keysDecrypt,
                    }];
            }
        });
    });
}
function readV6(data, pass) {
    return __awaiter(this, void 0, void 0, function () {
        var version, activeIndex, salt, keys, keysDecrypt, i, key_data, key, type, nonce, key_decrypt, e_1, key_string;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    version = data.version;
                    activeIndex = data.activeIndex;
                    cryptoHelpers.keygenIterations = ITERATIONS_V3;
                    salt = bintools.cb58Decode(data.salt);
                    keys = data.keys;
                    keysDecrypt = [];
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < keys.length)) return [3 /*break*/, 7];
                    key_data = keys[i];
                    key = bintools.cb58Decode(key_data.key);
                    type = key_data.type;
                    nonce = bintools.cb58Decode(key_data.iv);
                    key_decrypt = void 0;
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, cryptoHelpers.decrypt(pass, key, salt, nonce)];
                case 3:
                    key_decrypt = _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _a.sent();
                    throw 'INVALID_PASS';
                case 5:
                    key_string = key_decrypt.toString();
                    keysDecrypt.push({
                        key: key_string,
                        type: type,
                    });
                    _a.label = 6;
                case 6:
                    i++;
                    return [3 /*break*/, 1];
                case 7: return [2 /*return*/, {
                        version: version,
                        activeIndex: activeIndex || 0,
                        keys: keysDecrypt,
                    }];
            }
        });
    });
}
function readKeyFile(data, pass) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = data.version;
                    switch (_a) {
                        case '6.0': return [3 /*break*/, 1];
                        case '5.0': return [3 /*break*/, 3];
                        case '4.0': return [3 /*break*/, 5];
                        case '3.0': return [3 /*break*/, 7];
                        case '2.0': return [3 /*break*/, 9];
                    }
                    return [3 /*break*/, 11];
                case 1: return [4 /*yield*/, readV6(data, pass)];
                case 2: return [2 /*return*/, _b.sent()];
                case 3: return [4 /*yield*/, readV5(data, pass)];
                case 4: return [2 /*return*/, _b.sent()];
                case 5: return [4 /*yield*/, readV4(data, pass)];
                case 6: return [2 /*return*/, _b.sent()];
                case 7: return [4 /*yield*/, readV3(data, pass)];
                case 8: return [2 /*return*/, _b.sent()];
                case 9: return [4 /*yield*/, readV2(data, pass)];
                case 10: return [2 /*return*/, _b.sent()];
                case 11: throw 'INVALID_VERSION';
            }
        });
    });
}
function extractKeysV2(file) {
    var chainID = avm.getBlockchainAlias();
    var keys = file.keys;
    return keys.map(function (key) {
        // Private keys from the keystore file do not have the PrivateKey- prefix
        var pk = 'PrivateKey-' + key.key;
        var keypair = keyToKeypair(pk, chainID);
        var keyBuf = keypair.getPrivateKey();
        var keyHex = keyBuf.toString('hex');
        var paddedKeyHex = keyHex.padStart(64, '0');
        var mnemonic = bip39.entropyToMnemonic(paddedKeyHex);
        return {
            key: mnemonic,
            type: 'mnemonic',
        };
    });
}
function extractKeysV5(file) {
    return file.keys.map(function (key) { return ({
        key: key.key,
        type: 'mnemonic',
    }); });
}
function extractKeysV6(file) {
    return file.keys.map(function (key) { return ({
        type: key.type,
        key: key.key,
    }); });
}
function extractKeysFromDecryptedFile(file) {
    switch (file.version) {
        case '6.0':
            return extractKeysV6(file);
        case '5.0':
            return extractKeysV5(file);
        case '4.0':
            return extractKeysV2(file);
        case '3.0':
            return extractKeysV2(file);
        case '2.0':
            return extractKeysV2(file);
        default:
            throw 'INVALID_VERSION';
    }
}
// Given an array of wallets and a password, return an encrypted JSON object that is the keystore file
function makeKeyfile(wallets, pass, activeIndex) {
    return __awaiter(this, void 0, void 0, function () {
        var salt, keys, i, wallet, key, type, pk_crypt, key_data, file_data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // 3.0 and above uses 200,000
                    cryptoHelpers.keygenIterations = ITERATIONS_V3;
                    return [4 /*yield*/, cryptoHelpers.makeSalt()];
                case 1:
                    salt = _a.sent();
                    keys = [];
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < wallets.length)) return [3 /*break*/, 5];
                    wallet = wallets[i];
                    key = void 0;
                    type = void 0;
                    if (wallet.type === 'singleton') {
                        key = wallet.key;
                        type = 'singleton';
                    }
                    else {
                        key = wallet.getMnemonic();
                        type = 'mnemonic';
                    }
                    return [4 /*yield*/, cryptoHelpers.encrypt(pass, key, salt)];
                case 3:
                    pk_crypt = _a.sent();
                    key_data = {
                        key: bintools.cb58Encode(AjsBuffer.from(pk_crypt.ciphertext)),
                        iv: bintools.cb58Encode(AjsBuffer.from(pk_crypt.iv)),
                        type: type,
                    };
                    keys.push(key_data);
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5:
                    file_data = {
                        version: KEYSTORE_VERSION,
                        salt: bintools.cb58Encode(AjsBuffer.from(salt)),
                        activeIndex: activeIndex,
                        keys: keys,
                    };
                    return [2 /*return*/, file_data];
            }
        });
    });
}
export { readKeyFile, makeKeyfile, KEYSTORE_VERSION, extractKeysFromDecryptedFile };
//# sourceMappingURL=Keystore.js.map