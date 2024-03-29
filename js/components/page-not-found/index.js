import utilities from "../../utilities.js"
import store from '../../store.js'
export default {
    template: await utilities.getPage('/js/components/page-not-found/index.html'),
    data() {
        return {
            store,
            utilities
        }
    }
}