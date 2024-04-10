import utilities from "../../../js/utilities.js"
import store from '../../../js/store.js'
var notify = new AWN();

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
                    ...this.store.blogs.filter(e => e.title.trim().toLowerCase().includes(this.searchInput.trim().toLowerCase())),
                    ...this.store.services.filter(e => e.title.trim().toLowerCase().includes(this.searchInput.trim().toLowerCase()))
                ]
            }

            switch (this.$route.query.tab) {
                case 'all': {
                    // return [...this.store.blogs.slice(0, 2), ...this.store.services.slice(0, 2)]
                    return [...this.store.blogs, ...this.store.services]
                }
                case 'blogs': {
                    return [
                        ...this.store.blogs
                    ]
                }
                case 'services': {
                    return [
                        ...this.store.services
                    ]
                }

                default: {
                    // return [...this.store.blogs.slice(0, 3), ...this.store.services.slice(0, 3)]
                    
                    return [...this.store.blogs, ...this.store.services]
                }

            }
        }
    },
    methods: {
        copyUrl(url) {
            navigator.clipboard.writeText(url)
            notify.info(url, { labels: { 'info': 'Copied!' } })
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
                    confirm: 'CONFIRMATION REQUIRED'
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

                            notify.success(res.message, { labels: { success: 'Meshe l7al' } })
                        } else {
                            notify.warning(res.message, { labels: { warning: 'Ma Meshe l7al' } })
                        }
                    }).catch(err => {
                        this.spinner = false
                        console.log(err);
                        notify.alert(err)
                    })

                }
            }

            var onCancel = () => {
                // notify.tip('DONE')
            }
            notify.confirm('Are you sure you want to delete this page??', onConfirm, onCancel, label)
        }
    }
}