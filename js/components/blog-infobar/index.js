import utilities from "../../utilities.js"
import store from '../../store.js'
export default {
    template: await utilities.getPage('/js/components/blog-infobar/index.html'),
    data() {
        return {
            store,
            utilities
        }
    },
    props:['badge','date']
}