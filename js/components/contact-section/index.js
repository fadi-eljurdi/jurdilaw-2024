import utilities from "../../utilities.js"
import store from '../../store.js'
export default {
    template: await utilities.getPage('/js/components/contact-section/index.html'),
    data() {
        return {
            store,
            utilities,
            inputName:'',
            inputSubject:'',
            inputMessage:'',
        }
    },
    computed:{
        sendMessage(){
            return `mailto:${this.store.contact.email}?subject=${encodeURIComponent(this.inputSubject)}&body=${encodeURIComponent('Name: '+this.inputName+' - \n\n'+this.inputMessage)}`
        }
    }
}