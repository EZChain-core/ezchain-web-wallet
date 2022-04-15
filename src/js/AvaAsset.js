// Manages BigNumber and Ava conversion and arithmetic
import { BN } from 'ezchainjs2';
import Big from 'big.js';
var AvaAsset = /** @class */ (function () {
    function AvaAsset(id, name, symbol, denomination) {
        this.id = id;
        this.name = name;
        this.symbol = symbol;
        this.denomination = denomination;
        this.amount = new BN(0, 10);
        this.amountLocked = new BN(0, 10);
        this.amountExtra = new BN(0, 10);
        this.pow = Big(10).pow(denomination);
    }
    AvaAsset.prototype.addBalance = function (val) {
        this.amount = this.amount.add(val);
    };
    AvaAsset.prototype.addBalanceLocked = function (val) {
        this.amountLocked = this.amountLocked.add(val);
    };
    AvaAsset.prototype.addExtra = function (val) {
        this.amountExtra = this.amountExtra.add(val);
    };
    AvaAsset.prototype.resetBalance = function () {
        this.amount = new BN(0, 10);
        this.amountLocked = new BN(0, 10);
        this.amountExtra = new BN(0, 10);
    };
    AvaAsset.prototype.getAmount = function (locked) {
        if (locked === void 0) { locked = false; }
        if (!locked) {
            return Big(this.amount.toString(10)).div(this.pow);
        }
        else {
            return Big(this.amountLocked.toString(10)).div(this.pow);
        }
    };
    AvaAsset.prototype.getAmountBN = function (locked) {
        if (locked === void 0) { locked = false; }
        if (!locked) {
            return this.amount;
        }
        else {
            return this.amountLocked;
        }
    };
    AvaAsset.prototype.getTotalAmount = function () {
        return this.amount.add(this.amountLocked).add(this.amountExtra);
    };
    AvaAsset.prototype.toStringTotal = function () {
        var big = Big(this.getTotalAmount().toString(10)).div(this.pow);
        return big.toLocaleString(this.denomination);
    };
    AvaAsset.prototype.toString = function () {
        var big = Big(this.amount.toString(10)).div(this.pow);
        return big.toLocaleString(this.denomination);
        // if(big.lt(Big('0.001'))){
        //     return big.toLocaleString(this.denomination);
        // }else{
        //     let min = Math.min(this.denomination, 2);
        //     return big.toLocaleString(min);
        // }
    };
    return AvaAsset;
}());
export default AvaAsset;
//# sourceMappingURL=AvaAsset.js.map