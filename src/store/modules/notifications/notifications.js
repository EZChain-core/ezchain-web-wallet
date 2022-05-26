var COLOR_SUCCESS = '#6BC688'
var COLOR_WARNING = '#c39043'
var COLOR_ERROR = '#E84970'
var notif_id = 0
var notifications_module = {
    namespaced: true,
    state: {
        items: [],
    },
    mutations: {},
    actions: {
        add: function (store, data) {
            var id = notif_id++
            // let color = data.color || NOTIF_COLOR;
            var type = data.type || 'success'
            var duration = data.duration || 5000
            var color = COLOR_SUCCESS
            switch (type) {
                case 'success':
                    color = COLOR_SUCCESS
                    break
                case 'error':
                    color = COLOR_ERROR
                    break
                case 'warning':
                    color = COLOR_WARNING
                    break
            }
            var item = {
                id: id,
                title: data.title,
                message: data.message,
                color: color,
                duration: 5000,
            }
            setTimeout(function () {
                for (var i = 0; i < store.state.items.length; i++) {
                    var item_1 = store.state.items[i]
                    if (item_1.id === id) {
                        store.state.items.splice(i, 1)
                    }
                }
            }, duration)
            store.state.items.push(item)
        },
    },
    getters: {},
}
export default notifications_module
//# sourceMappingURL=notifications.js.map
