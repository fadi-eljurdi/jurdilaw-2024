import utilities from "../../../js/utilities.js"
import store from '../../../js/store.js'
import Link from '../../../js/classes/Link.js'
export default {
    template: await utilities.getPage('/editor/components/linksEditor/index.html'),
    data() {
        return {
            store,
            utilities,
            spinner: false,
            updatedLink: new Link(),
            addedLink: new Link(),
            removedLink: new Link()
        }
    },
    computed: {
        loadingLinks() {
            return this.store.links.length == 0
        }
    },
    methods: {
        createNewLink() {
            if (utilities.isValidPayload(this.addedLink, ['group', 'title', 'url']).status) {
                if (confirm('Are you sure?')) {
                    this.spinner = true
                    fetch(this.store.api + '?createNewLink', {
                        method: "POST",
                        headers: {
                            "Content-Type": "text/plain"
                        },
                        body: JSON.stringify({
                            username: this.store.username,
                            password: this.store.password,
                            createNewLink: this.addedLink
                        })
                    }).then(res => res.json()).then(res => {

                        console.log(res);
                        if (res.status) {
                            try {
                                this.addedLink.id = res.data.id
                                this.addedLink.timestamp = new Date().toUTCString()
                                this.store.links.push(this.addedLink)
                                alert(res.message)
                            } catch (err) {
                                alert(err)
                                console.log(err);
                            }


                        } else alert(res.message)
                        this.spinner = false
                    }).catch(err => {
                        console.error(err);
                        this.spinner = false
                    })
                }
            }
        },

        updateLink() {
            if (confirm('Are you sure?')) {
                this.spinner = true
                fetch(this.store.api + '?updateLink', {
                    method: "POST",
                    headers: {
                        "Content-Type": "text/plain"
                    },
                    body: JSON.stringify({
                        username: this.store.username,
                        password: this.store.password,
                        updateLink: this.updatedLink
                    })
                }).then(res => res.json()).then(res => {

                    console.log(res);
                    if (res.status) {
                        try {
                            for (let node of this.store.links) {
                                if (node.id == this.updatedLink.id) {
                                    node = this.updatedLink
                                }
                            }
                            alert(res.message)
                        } catch (err) {
                            alert(err)
                            console.log(err);
                        }


                    } else alert(res.message)
                    this.spinner = false
                }).catch(err => {
                    console.error(err);
                    this.spinner = false
                })
            }
        },

        removeLink() {
            if (confirm('Are you sure?')) {
                this.spinner = true
                fetch(this.store.api + '?removeLink', {
                    method: "POST",
                    headers: {
                        "Content-Type": "text/plain"
                    },
                    body: JSON.stringify({
                        username: this.store.username,
                        password: this.store.password,
                        removeLink: this.removedLink
                    })
                }).then(res => res.json()).then(res => {

                    console.log(res);
                    if (res.status) {
                        try {
                            this.store.links = this.store.links.filter(e => e.id != this.removedLink.id)
                            alert(res.message)
                        } catch (err) {
                            alert(err)
                            console.log(err);
                        }


                    } else alert(res.message)
                    this.spinner = false
                }).catch(err => {
                    console.error(err);
                    this.spinner = false
                })
            }
        }
    }
}