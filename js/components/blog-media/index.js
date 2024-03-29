import utilities from "../../utilities.js"
import store from '../../store.js'
export default {
    template: await utilities.getPage('/js/components/blog-media/index.html'),
    data() {
        return {
            store,
            utilities
        }
    },
    props:['media'],
    computed:{
        thumbnails(){
            return this.media.split(',')
        }
    }
}