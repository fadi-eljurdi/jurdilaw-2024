import utilities from "../../../js/utilities.js"
import store from '../../../js/store.js'

var notify = new AWN({
    labels: {
        alert: "Basita 😉",
        success: "MESHE L7AL 😎",
        warning: "MA MESHE L7AL 😟"
    }
});

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
            try {
                const onConfirm = async () => {
                    if (utilities.areDifferent(this.store.nextContact, this.store.contact)) {
                        if (confirm('Proceed to update your contact information?')) {
                            this.spinner = true
                            var payload = {
                                username: this.store.username,
                                password: this.store.password,
                                // updatePage: { ...this.getUpdatedPayload(), id: this.updatedPage.id, folder: this.updatedPage.folder }
                                setContact: this.getNewContact
                            }

                            var res = await fetch(this.store.api + '?setContact', {
                                "method": "POST",
                                headers: {
                                    "Content-Type": "text/plain"
                                },
                                body: JSON.stringify(payload)
                            })

                            res = await res.json()
                            console.log(res);
                            if (res.status) {
                                this.spinner = false
                                this.store.contact = { ...this.store.nextContact }
                                notify.success(res.message)
                            } else {
                                this.spinner = false
                                throw res.message
                            }
                        }
                    }

                }
                
                notify.confirm('Are you sure ?', onConfirm, true)

            } catch (err) {
                this.spinner = false
                notify.warning(err)
            }
        }
    }

}