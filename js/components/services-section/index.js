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
            for (let node of this.store.services) {
                node.icon = this.getIcon(node.id)
            }
            return this.store.spinner ? [{}, {}, {}, {}, {}, {}, {}, {}] : this.store.services.filter(node => node.badge.trim().toUpperCase() != 'DEMO')
        }

    },

    methods: {
        getIcon(id) {
            // get services icons
            let icons = [
                {
                    src: './assets/services/corporate and commercial.png',
                    id: '1kCrmOrGgGxLqkl0GVOhyqGNr1UuMDjwJ'
                },
                {
                    src: './assets/services/employment law.png',
                    id: '1I52N3eBwTYt9bXwo6m7hfBVXBqDv-QAF'
                },
                {
                    src: './assets/services/gaming and esports.png',
                    id: '1hu2wGASkwhFsS9hfrf7DanG5qur2e2bM'
                },
                {
                    src: './assets/services/intellectual property.png',
                    id: '1giumkzAkieksLY2-dTsHCiTG0ro95gSt'
                },
                {
                    src: './assets/services/litigation & arbitration.png',
                    id: '1HFLyXn6yEW_LexgkBHSD1xsrFkrjEggD'
                },
                {
                    src: './assets/services/media & film production.png',
                    id: '1K2hIltotG5n0QifnyAo0uZw-pTX1_5nX'
                },
                {
                    src: './assets/services/music law.png',
                    id: '1aRHBnOmta5RnM0W-AAHNJzVnIqDjXYMV'
                },
                {
                    src: './assets/services/regulatory affairs.png',
                    id: '1MWc5k_nznNXEmvNffreA-w82guYtptiV'
                },
                {
                    src: './assets/services/technology law.png',
                    id: '1DsSoCs4DcL4BnKvZ3YqjVRmpq-zvVcog'
                },
            ]

            return icons.filter(node => node.id == id).length === 0 ? 'https://placehold.co/100?text=IMG' : icons.filter(node => node.id == id)[0].src
        },
        alternateByGroup() {
            function sortByGroup(array) {
                const result = [];
                let groupSize = 5; // Start with group size of 4
                let index = 0;
            
                while (index < array.length) {
                    // Slice the array to create groups of the current size
                    const group = array.slice(index, index + groupSize);
                    result.push(group);
            
                    // Move the index forward by the group size
                    index += groupSize;
            
                    // Alternate the group size between 4 and 3
                    groupSize = groupSize === 5 ? 4 : 5;
                }
            
                return result;
            }

            return sortByGroup(this.filteredServices)
        },
        slideNext() {
            const swiperEl = document.querySelector('#s-swiper');
            // console.log(swiperEl.swiper);
            swiperEl.swiper.slideNext();
        },
        slideBack() {
            const swiperEl = document.querySelector('#s-swiper');
            // console.log(swiperEl.swiper);
            swiperEl.swiper.slidePrev();
        },
    }
}