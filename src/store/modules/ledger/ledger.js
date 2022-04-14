var ledger_module = {
    namespaced: true,
    state: {
        isBlock: false,
        isPrompt: false,
        isUpgradeRequired: false,
        isWalletLoading: false,
        messages: [],
        title: 'title',
        info: "info'",
    },
    mutations: {
        openModal: function (state, input) {
            state.title = input.title
            state.info = input.info
            state.messages = input.messages
            state.isPrompt = input.isPrompt
            state.isBlock = true
        },
        closeModal: function (state) {
            state.messages = []
            state.isBlock = false
        },
        setIsUpgradeRequired: function (state, val) {
            state.isUpgradeRequired = val
        },
        setIsWalletLoading: function (state, val) {
            state.isWalletLoading = val
        },
    },
    actions: {},
}
export default ledger_module
//# sourceMappingURL=ledger.js.map
