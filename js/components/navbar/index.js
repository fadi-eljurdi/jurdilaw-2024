import utilities from "../../utilities.js"
import store from '../../store.js'
export default {
    template: await utilities.getPage('/js/components/navbar/index.html'),
    data() {
        return {
            store,
            utilities
        }
    },
    methods:{
        getActiveClass(name) {
            
            if (location.pathname == name) {
                // console.log(location.pathname);
                return "navbar-link-active"
            }

            return 'navbar-link'
        }
    },
    mounted() {
        
        window.addEventListener("scroll", function () {
            // Your function to handle the scrolling of the entire page
            // console.log("The page is scrolled!" + window.scrollY);

            // You can add additional logic here based on scroll position
            const scrolledPosition = window.scrollY; // or document.documentElement.scrollTop for compatibility

            // Example: Change background color based on scroll depth
            if (scrolledPosition >= 5) {
                this.document.getElementById('navbar').classList.add('bg-glass')
            } else {
                this.document.getElementById('navbar').classList.remove('bg-glass')
            }
        });

    }
}