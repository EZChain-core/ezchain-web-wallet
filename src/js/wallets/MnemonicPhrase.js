import CryptoJS from 'crypto-js/core'
import AES from 'crypto-js/aes'
var randomstring = require('randomstring')
import * as bip39 from 'bip39'
// The purpose of this class is for obfuscation only rather than secure encryption
var MnemonicPhrase = /** @class */ (function () {
    function MnemonicPhrase(mnemonic) {
        if (!bip39.validateMnemonic(mnemonic)) throw new Error('Invalid mnemonic phrase.')
        this.pass = randomstring.generate(32)
        this.encrypted = AES.encrypt(mnemonic, this.pass).toString()
    }
    MnemonicPhrase.prototype.getValue = function () {
        var decrypted = AES.decrypt(this.encrypted, this.pass).toString(CryptoJS.enc.Utf8)
        if (!bip39.validateMnemonic(decrypted)) throw new Error('Decrypted mnemonic is not valid.')
        return decrypted
    }
    return MnemonicPhrase
})()
export default MnemonicPhrase
//# sourceMappingURL=MnemonicPhrase.js.map
