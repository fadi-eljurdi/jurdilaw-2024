import utilities from "../../../js/utilities.js"
import store from '../../../js/store.js'
export default {
    template: await utilities.getPage('/editor/components/pageNotFound/index.html'),
    data() {
        return {
            store,
            utilities
        }
    }
}