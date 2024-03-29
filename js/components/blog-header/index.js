import utilities from "../../utilities.js"
import store from '../../store.js'
export default {
    template: await utilities.getPage('/js/components/blog-header/index.html'),
    data() {
        return {
            store,
            utilities
        }
    }
}