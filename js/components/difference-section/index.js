import utilities from "../../utilities.js"
import store from '../../store.js'
export default {
    template: await utilities.getPage('/js/components/difference-section/index.html'),
    data() {
        return {
            store,
            utilities
        }
    }
}