// Doesn't really matter what we set, it will change
import axios from 'axios'
var wallet_api = axios.create({
    baseURL: '/api',
    withCredentials: false,
    headers: {
        'Content-Type': 'application/json',
    },
})
export { wallet_api }
//# sourceMappingURL=wallet_api.js.map
