import MnemonicPhrase from '@/js/wallets/MnemonicPhrase';
import * as bip39 from 'bip39';
describe('MnemonicPhrase', function () {
    it('can encrypt and decrypt', function () {
        var NUM_ITERATION = 10000;
        for (var i = 0; i < NUM_ITERATION; i++) {
            var phraseRaw = bip39.generateMnemonic(256);
            var phrase = new MnemonicPhrase(phraseRaw);
            expect(phrase.getValue()).toEqual(phraseRaw);
        }
    });
});
//# sourceMappingURL=MnemonicPhrase.test.js.map