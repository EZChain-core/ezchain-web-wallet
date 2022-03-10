import { __awaiter, __generator, __values } from "tslib";
import isEqual from 'lodash.isequal';
import differenceBy from 'lodash.differenceby';
import { readKeyFile } from '@/js/Keystore';
var checkAccountsExist = function () {
    return localStorage.getItem('accounts') !== null;
};
export function getAccountByIndex(index) {
    return getLocalStorageAccounts()[index] || null;
}
export var checkIfSavedLocally = function (allWallets) {
    var e_1, _a;
    var exists = checkAccountsExist();
    if (!exists)
        return false;
    var ethAddressArray = allWallets.map(function (x) { return x.ethAddress; });
    var savedAccounts = getLocalStorageJSONItem('accounts');
    try {
        for (var savedAccounts_1 = __values(savedAccounts), savedAccounts_1_1 = savedAccounts_1.next(); !savedAccounts_1_1.done; savedAccounts_1_1 = savedAccounts_1.next()) {
            var each = savedAccounts_1_1.value;
            if (isEqual(each.baseAddresses, ethAddressArray)) {
                return true;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (savedAccounts_1_1 && !savedAccounts_1_1.done && (_a = savedAccounts_1.return)) _a.call(savedAccounts_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return false;
};
export var removeAccountByIndex = function (index) {
    var accounts = getLocalStorageAccounts();
    accounts.splice(index, 1);
    saveLocalStorageJSONItem('accounts', accounts);
};
export var getLocalStorageJSONItem = function (key) {
    var item = localStorage.getItem(key);
    if (item !== null) {
        return JSON.parse(item);
    }
};
export function getLocalStorageAccounts() {
    return getLocalStorageJSONItem('accounts') || [];
}
export var saveLocalStorageJSONItem = function (key, data) {
    var formatted = JSON.stringify(data);
    localStorage.setItem(key, formatted);
};
export var getIndexByWallets = function (wallets) {
    var ethAddressArray = wallets.map(function (x) { return x.getEvmAddress(); });
    var savedAccounts = getLocalStorageAccounts();
    var index = 0;
    for (var i = 0; i < savedAccounts.length; i++) {
        var acct = savedAccounts[i];
        if (isEqual(acct.baseAddresses, ethAddressArray)) {
            return index;
        }
    }
    return null;
};
export var getNonVolatileWallets = function (allWallets, volatileWallets) {
    var diff = differenceBy(allWallets, volatileWallets, 'ethAddress');
    diff === undefined ? [] : diff;
    return diff;
};
export function addAccountToStorage(account) {
    var accounts = getLocalStorageAccounts();
    accounts.push(account);
    saveLocalStorageJSONItem('accounts', accounts);
}
// Given a password and an account, will verify if its the correct password
export function verifyAccountPassword(account, password) {
    return __awaiter(this, void 0, void 0, function () {
        var res, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, readKeyFile(account.wallet, password)];
                case 1:
                    res = _a.sent();
                    return [2 /*return*/, true];
                case 2:
                    err_1 = _a.sent();
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
export function overwriteAccountAtIndex(newAccount, index) {
    var accts = getLocalStorageAccounts();
    accts.splice(index, 1, newAccount);
    saveLocalStorageJSONItem('accounts', accts);
}
export default {
    removeAccountByIndex: removeAccountByIndex,
    checkIfSavedLocally: checkIfSavedLocally,
    getNonVolatileWallets: getNonVolatileWallets,
};
//# sourceMappingURL=account_helper.js.map