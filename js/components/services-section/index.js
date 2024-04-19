import utilities from "../../utilities.js"
import store from '../../store.js'
export default {
    template: await utilities.getPage('/js/components/services-section/index.html'),
    data() {
        return {
            store,
            utilities,
            breakpoints: {
                768: {
                    slidesPerView: 1,
                    spaceBetween: 10,
                },
                1024: {
                    slidesPerView: 4,
                    spaceBetween: 10,
                },
            },
        }
    },
    computed: {
        filteredServices() {
            return this.store.spinner ? ['','','','','','','','','',''] : this.store.services.filter(node => node.badge.trim().toUpperCase() != 'DEMO')
            // return this.store.services.filter(s => s.badge != 'DEMO')
            // return this.store.services
        }
    }
}