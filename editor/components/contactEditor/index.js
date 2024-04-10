import utilities from "../../../js/utilities.js"
import store from '../../../js/store.js'

var notify = new AWN();

export default {
    template: await utilities.getPage('/editor/components/contactEditor/index.html'),
    data() {
        return {
            store,
            utilities,
            spinner: false
        }
    },
    computed: {
        getNewContact() {
            return utilities.diffProperties(store.nextContact, store.contact)
        }
    },
    methods: {
        updateContact() {

            const onConfirm = () => {
                if (utilities.areDifferent(this.store.nextContact, this.store.contact)) {
                    if (confirm('Proceed to update your contact information?')) {
                        this.spinner = true
                        var payload = {
                            username: this.store.username,
                            password: this.store.password,
                            // updatePage: { ...this.getUpdatedPayload(), id: this.updatedPage.id, folder: this.updatedPage.folder }
                            setContact: this.getNewContact
                        }

                        fetch(this.store.api + '?setContact', {
                            "method": "POST",
                            headers: {
                                "Content-Type": "text/plain"
                            },
                            body: JSON.stringify(payload)
                        }).then(res => res.json()).then(res => {
                            console.log(res);
                            if (res.status) {
                                this.spinner = false

                                this.store.contact = { ...this.store.nextContact }

                                notify.success(res.message, { labels: { success: 'MESHE L7AL' } })
                            } else {
                                this.spinner = false

                                notify.warning(res.message, { labels: { warning: 'MA MESHE L7AL' } })
                            }
                        }).catch(err => {
                            this.spinner = false
                            console.error(err);
                            notify.alert('Weak network please try again later')
                        })
                    }
                }

            }

            const onCancel = () => {

            }

            notify.confirm('Are you sure ?', onConfirm, onCancel)
        }
    }

}