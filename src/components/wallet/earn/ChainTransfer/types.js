export var TxState
;(function (TxState) {
    TxState[(TxState['failed'] = -1)] = 'failed'
    TxState[(TxState['waiting'] = 0)] = 'waiting'
    TxState[(TxState['started'] = 1)] = 'started'
    TxState[(TxState['success'] = 2)] = 'success'
})(TxState || (TxState = {}))
//# sourceMappingURL=types.js.map
