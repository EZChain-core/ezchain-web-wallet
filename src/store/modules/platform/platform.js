import { __awaiter, __generator } from "tslib";
import { BN } from 'ezchainjs2';
import { pChain } from '@/AVA';
import { ONEAVAX } from 'ezchainjs2/dist/utils';
var MINUTE_MS = 60000;
var HOUR_MS = MINUTE_MS * 60;
var DAY_MS = HOUR_MS * 24;
var platform_module = {
    namespaced: true,
    state: {
        validators: [],
        validatorsPending: [],
        // delegators: [],
        delegatorsPending: [],
        minStake: new BN(0),
        minStakeDelegation: new BN(0),
        currentSupply: new BN(1),
    },
    mutations: {
        setValidators: function (state, validators) {
            state.validators = validators;
        },
    },
    actions: {
        updateCurrentSupply: function (_a) {
            var state = _a.state;
            return __awaiter(this, void 0, void 0, function () {
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _b = state;
                            return [4 /*yield*/, pChain.getCurrentSupply()];
                        case 1:
                            _b.currentSupply = _c.sent();
                            return [2 /*return*/];
                    }
                });
            });
        },
        updateMinStakeAmount: function (_a) {
            var state = _a.state;
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, pChain.getMinStake(true)];
                        case 1:
                            res = _b.sent();
                            state.minStake = res.minValidatorStake;
                            state.minStakeDelegation = res.minDelegatorStake;
                            return [2 /*return*/];
                    }
                });
            });
        },
        update: function (_a) {
            var dispatch = _a.dispatch;
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_b) {
                    dispatch('updateValidators');
                    dispatch('updateValidatorsPending');
                    dispatch('updateCurrentSupply');
                    return [2 /*return*/];
                });
            });
        },
        updateValidators: function (_a) {
            var state = _a.state, commit = _a.commit;
            return __awaiter(this, void 0, void 0, function () {
                var res, validators;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, pChain.getCurrentValidators()];
                        case 1:
                            res = (_b.sent());
                            validators = res.validators;
                            commit('setValidators', validators);
                            return [2 /*return*/];
                    }
                });
            });
        },
        updateValidatorsPending: function (_a) {
            var state = _a.state, commit = _a.commit;
            return __awaiter(this, void 0, void 0, function () {
                var res, validators, delegators;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, pChain.getPendingValidators()];
                        case 1:
                            res = (_b.sent());
                            validators = res.validators;
                            delegators = res.delegators;
                            //@ts-ignore
                            state.validatorsPending = validators;
                            state.delegatorsPending = delegators;
                            return [2 /*return*/];
                    }
                });
            });
        },
    },
    getters: {
        validatorListEarn: function (state, getters) {
            // Filter validators we do not need
            var now = Date.now();
            var validators = state.validators;
            validators = validators.filter(function (v) {
                var endTime = parseInt(v.endTime) * 1000;
                var dif = endTime - now;
                // If End time is less than 2 weeks + 1 hour, remove from list they are no use
                var threshold = DAY_MS * 14 + 10 * MINUTE_MS;
                if (dif <= threshold) {
                    return false;
                }
                return true;
            });
            var delegatorMap = getters.nodeDelegatorMap;
            var delegatorPendingMap = getters.nodeDelegatorPendingMap;
            var res = [];
            for (var i = 0; i < validators.length; i++) {
                var v = validators[i];
                var nodeID = v.nodeID;
                var delegators = delegatorMap[nodeID] || [];
                var delegatorsPending = delegatorPendingMap[nodeID] || [];
                var delegatedAmt = new BN(0);
                var delegatedPendingAmt = new BN(0);
                if (delegators) {
                    delegatedAmt = delegators.reduce(function (acc, val) {
                        return acc.add(new BN(val.stakeAmount));
                    }, new BN(0));
                }
                if (delegatorsPending) {
                    delegatedPendingAmt = delegatorsPending.reduce(function (acc, val) {
                        return acc.add(new BN(val.stakeAmount));
                    }, new BN(0));
                }
                var startTime = new Date(parseInt(v.startTime) * 1000);
                var endTime = new Date(parseInt(v.endTime) * 1000);
                var delegatedStake = delegatedAmt.add(delegatedPendingAmt);
                var validatorStake = new BN(v.stakeAmount);
                // Calculate remaining stake
                var absMaxStake = ONEAVAX.mul(new BN(3000000));
                var relativeMaxStake = validatorStake.mul(new BN(5));
                var stakeLimit = BN.min(absMaxStake, relativeMaxStake);
                var remainingStake = stakeLimit.sub(validatorStake).sub(delegatedStake);
                var listItem = {
                    nodeID: v.nodeID,
                    validatorStake: validatorStake,
                    delegatedStake: delegatedStake,
                    remainingStake: remainingStake,
                    numDelegators: delegators.length + delegatorsPending.length,
                    startTime: startTime,
                    endTime: endTime,
                    uptime: parseFloat(v.uptime),
                    fee: parseFloat(v.delegationFee),
                };
                res.push(listItem);
            }
            res = res.filter(function (v) {
                // Remove if remaining space is less than minimum
                var min = state.minStakeDelegation;
                if (v.remainingStake.lt(min))
                    return false;
                return true;
            });
            return res;
        },
        // Maps delegators to a node id
        nodeDelegatorMap: function (state) {
            var res = {};
            var validators = state.validators;
            for (var i = 0; i < validators.length; i++) {
                var validator = validators[i];
                var nodeID = validator.nodeID;
                res[nodeID] = validator.delegators || [];
            }
            return res;
        },
        nodeDelegatorPendingMap: function (state) {
            var res = {};
            var delegators = state.delegatorsPending;
            for (var i = 0; i < delegators.length; i++) {
                var delegator = delegators[i];
                var nodeID = delegator.nodeID;
                var target = res[nodeID];
                if (target) {
                    res[nodeID].push(delegator);
                }
                else {
                    res[nodeID] = [delegator];
                }
            }
            return res;
        },
        // Given a validator list item, calculate the max stake of this item
        validatorMaxStake: function (state, getters) { return function (validator) {
            var stakeAmt = validator.validatorStake;
            // 5 times the validator's stake
            var relativeMaxStake = stakeAmt.mul(new BN(5));
            // absolute max stake
            var mult = new BN(10).pow(new BN(6 + 9));
            var absMaxStake = new BN(3).mul(mult);
            if (relativeMaxStake.lt(absMaxStake)) {
                return relativeMaxStake;
            }
            else {
                return absMaxStake;
            }
        }; },
    },
};
export default platform_module;
//# sourceMappingURL=platform.js.map