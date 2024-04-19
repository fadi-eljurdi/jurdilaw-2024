import utilities from "../../utilities.js"
import store from '../../store.js'
export default {
    template: await utilities.getPage('/js/components/blogs-section/index.html'),
    data() {
        return {
            store,
            utilities,
            path: new URL(location.href).pathname
        }
    },
    computed: {
        filteredBlogs() {
            if (this.store.spinner) {
                return ['', '', '', '', '', '', '', '', '', '']
            }

            if (this.path == '/blogs/') return this.store.blogs.filter(node => node.badge.trim().toUpperCase() != 'DEMO')
            return this.store.blogs.filter(node => node.badge.trim().toUpperCase() != 'DEMO').slice(-8).reverse()
        }
    }
}