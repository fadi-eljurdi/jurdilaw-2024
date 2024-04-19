import utilities from "../../../js/utilities.js"
import store from '../../../js/store.js'
var notify = new AWN({
    labels:{
        alert:"Basita 😉",
        success:"MESHE L7AL 😎",
        warning:"MA MESHE L7AL 😟"
    }
});

export default {
    template: await utilities.getPage('/editor/components/pageEditor/index.html'),
    data() {
        return {
            store,
            utilities,
            spinner: false,
            searchInput: ''
        }
    },
    computed: {
        filteredPages() {
            if (this.searchInput.trim().toLowerCase() != '') {
                return [
                    ...this.store.blogs.reverse().filter(e => e.title.trim().toLowerCase().includes(this.searchInput.trim().toLowerCase())),
                    ...this.store.services.reverse().filter(e => e.title.trim().toLowerCase().includes(this.searchInput.trim().toLowerCase()))
                ]
            }

            switch (this.$route.query.tab) {
                case 'all': {
                    // return [...this.store.blogs.slice(0, 2), ...this.store.services.slice(0, 2)]
                    return [...this.store.blogs.reverse(), ...this.store.services.reverse()]
                }
                case 'blogs': {
                    return [
                        ...this.store.blogs.reverse()
                    ]
                }
                case 'services': {
                    return [
                        ...this.store.services.reverse()
                    ]
                }

                default: {
                    // return [...this.store.blogs.slice(0, 3), ...this.store.services.slice(0, 3)]
                    
                    return [...this.store.blogs.reverse(), ...this.store.services.reverse()]
                }

            }
        }
    },
    methods: {
        copyUrl(url) {
            navigator.clipboard.writeText(url)
            notify.info(url, { labels: { 'info': 'Copied! ✅' } })
        },
        changeTab(query) {
            this.$router.push({
                path: this.$router.currentRoute.value.path,
                query: {
                    tab: query
                }
            })
        },

        deletePage(folder, id) {

            const label = {
                labels: {
                    confirm: 'CONFIRMATION REQUIRED 🧐'
                }
            }

            var onConfirm = () => {
                if (confirm('Proceed ya m3allem ?')) {
                    this.spinner = true
                    var payload = {
                        username: this.store.username,
                        password: this.store.password,
                        // updatePage: { ...this.getUpdatedPayload(), id: this.updatedPage.id, folder: this.updatedPage.folder }
                        deletePage: {
                            id: id,
                            folder: folder
                        }
                    }

                    fetch(this.store.api + `?deletePage`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "text/plain"
                        },
                        body: JSON.stringify(payload)
                    }).then(res => res.json()).then(res => {
                        console.log(res);

                        this.spinner = false
                        if (res.status) {

                            if (folder == 'blogs') {
                                this.store.blogs = this.store.blogs.filter(b => b.id != id)
                            } else {
                                this.store.services = this.store.services.filter(b => b.id != id)
                            }

                            notify.success(res.message)
                        } else {
                            notify.warning(res.message)
                        }
                    }).catch(err => {
                        this.spinner = false
                        console.log(err);
                        notify.alert(err)
                    })

                }
            }

            notify.confirm('Are you sure you want to delete this page??', onConfirm, true,label)
        }
    }
}