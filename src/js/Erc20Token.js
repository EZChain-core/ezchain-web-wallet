import { __awaiter, __generator } from "tslib";
import { web3 } from '@/evm';
import { BN } from 'ezchainjs2';
import { bnToBig } from '@/helpers/helper';
import Big from 'big.js';
import ERC20Abi from '@openzeppelin/contracts/build/contracts/ERC20.json';
var Erc20Token = /** @class */ (function () {
    function Erc20Token(tokenData) {
        this.data = tokenData;
        this.balanceRaw = '0';
        this.balanceBN = new BN('0');
        this.balanceBig = Big(0);
        //@ts-ignore
        var tokenInst = new web3.eth.Contract(ERC20Abi.abi, tokenData.address);
        this.contract = tokenInst;
    }
    // Returns a new instance of the token, given only the erc20 address
    Erc20Token.fromAddress = function (address) {
        //@ts-ignore
        var tokenInst = new web3.eth.Contract(ERC20Abi.abi, address);
        console.log(tokenInst);
    };
    Erc20Token.prototype.createTransferTx = function (to, amount) {
        return this.contract.methods.transfer(to, amount.toString());
    };
    Erc20Token.prototype.updateBalance = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var bal;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contract.methods.balanceOf('0x' + address).call()];
                    case 1:
                        bal = _a.sent();
                        this.balanceRaw = bal;
                        this.balanceBN = new BN(bal);
                        this.balanceBig = bnToBig(this.balanceBN, parseInt(this.data.decimals));
                        return [2 /*return*/];
                }
            });
        });
    };
    return Erc20Token;
}());
export default Erc20Token;
//# sourceMappingURL=Erc20Token.js.map