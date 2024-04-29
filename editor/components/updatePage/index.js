import utilities from "../../../js/utilities.js"
import store from '../../../js/store.js'
import Page from '../../../js/classes/Page.js'
import { GoogleGenerativeAI } from "@google/generative-ai";

var notify = new AWN({
    labels: {
        alert: "Basita 😉",
        success: "MESHE L7AL 😎",
        warning: "MA MESHE L7AL 😟"
    }
});

var app = {
    template: await utilities.getPage('/editor/components/updatePage/index.html'),
    data() {
        return {
            store,
            utilities,
            spinner: false,
            initialPage: new Page(),
            updatedPage: new Page()

        }
    },
    computed: {

        isValidRoute() {
            try {
                if (this.$route.params.pageFolder != '' && this.$route.params.pageFolder && this.$route.params.pageId != '' && this.$route.params.pageId) return true
                return false
            } catch (err) {
                console.log(err);
                notify.alert(`Invalid Route please inform Mahmoud if this error is repeated, Error = ${err}`)
            }
        },

        filteredLinks() {
            try {
                return this.updatedPage.links.split(',').filter(e => e != '').map(e => e.trim()).filter(link => {
                    return link.includes('https://my.visme.co/view/') || link.includes('https://docs.google.com/spreadsheets/d/') || link.includes('https://docs.google.com/presentation/d/') || link.includes('https://docs.google.com/document/d/') || link.includes('https://drive.google.com/file/d/') || link.includes('https://docs.google.com/forms/d/') || link.includes('https://www.canva.com/design/') || link.includes('youtu')
                })
            } catch (err) {
                console.log(err);
                notify.alert(`Please inform Mahmoud about this error = ${err}`)
            }
        }
    },
    methods: {

        getUpdatedPayload() {
            try {
                this.updatedPage.article = document.getElementsByClassName('ql-editor').item(0).innerHTML
                return utilities.diffProperties(this.updatedPage, this.initialPage)
            } catch (err) {

                console.log(err);
                notify.alert(`Please inform Mahmoud about this error = ${err}`)
            }
        },

        async initPage() {

            try {
                // select page record
                this.updatedPage.folder = this.$route.params.pageFolder
                console.log(this.updatedPage);
                console.log(this.store[this.$route.params.pageFolder]);
                for (let page of this.store[this.$route.params.pageFolder]) {
                    console.log(page);
                    if (page.id == this.$route.params.pageId) {
                        this.updatedPage = new Page(page)
                        this.initialPage = new Page(page)

                    }
                }

                console.log(this.initialPage);

                var payload = {
                    username: this.store.username,
                    password: this.store.password,
                    pageId: this.$route.params.pageId
                }
                this.spinner = true
                var res = await fetch(this.store.api + `?getPageArticle`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "text/plain"
                    },
                    body: JSON.stringify(payload)
                })
                res = await res.json()
                console.log(res);
                if (res.status) {
                    this.updatedPage.article = res.data
                    this.initialPage.article = res.data
                    document.getElementsByClassName('ql-editor').item(0).innerHTML = res.data
                    this.spinner = false
                } else throw res.message

            } catch (err) {
                this.spinner = false
                console.log(err);
                notify.alert(err)
            }

        },

        async geminiRun(key, prompt) {
            try {
                this.spinner = true
                // Fetch your API_KEY
                const API_KEY = this.store.geminiToken
                // Access your API key (see "Set up your API key" above)
                const genAI = new GoogleGenerativeAI(API_KEY);
                const model = genAI.getGenerativeModel({ model: "gemini-pro" });
                const result = await model.generateContent(prompt);
                const response = await result.response;
                // console.log(response);
                const text = response.text();
                // console.log(text);
                this.updatedPage[key] = text.replaceAll('*', '').replaceAll('-', ',')
                this.spinner = false
                return text
            } catch (err) {

                console.log(err);
                notify.alert(`Please inform Mahmoud about this error = ${err}`)
            }
        },

        restoreArticle() {
            try {
                document.getElementsByClassName('ql-editor').item(0).innerHTML = this.updatedPage.article

            } catch (err) {

                console.log(err);
                notify.alert(`Please inform Mahmoud about this error = ${err}`)
            }
        },

        resetThumbnails() {
            try {
                if (confirm('Reset all thumbnails?')) {
                    this.updatedPage.media = null
                }
            } catch (err) {

                console.log(err);
                notify.alert(`Please inform Mahmoud about this error = ${err}`)
            }
        },

        async selectImages() {
            try {
                var files = await utilities.openFiles()
                var files64 = [];
                for (let i = 0; i < files.length; i++) {
                    files64.push({
                        alt: `BLOG ${i} ${utilities.getCurrentDate()}`,
                        // src64: await utilities.file64(files[i])
                        src64: await utilities.optimizeImageQuality(await utilities.file64(files[i]), 0.7)
                    })
                }
                this.updatedPage.media = files64
            } catch (err) {

                console.log(err);
                notify.alert(`Please inform Mahmoud about this error = ${err}`)
            }
        },

        async updatePage() {
            try {
                this.getUpdatedPayload()
                if (utilities.areDifferent(this.updatedPage, this.initialPage)) {
                    if (confirm('Are you sure you want to update?')) {
                        this.spinner = true
                        var updatePagePayload = this.getUpdatedPayload()
                        updatePagePayload.id = this.updatedPage.id
                        updatePagePayload.folder = this.updatedPage.folder

                        var payload = {
                            username: this.store.username,
                            password: this.store.password,
                            // updatePage: { ...this.getUpdatedPayload(), id: this.updatedPage.id, folder: this.updatedPage.folder }
                            updatePage: updatePagePayload
                        }
                        console.log(payload);
                        var res = await fetch(this.store.api + `?updatePage`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "text/plain"
                            },
                            body: JSON.stringify(payload)
                        })

                        res = await res.json()

                        console.log(res);
                        if (res.status) {
                            this.spinner = false
                            if (res.data.media) {
                                res.data.media = res.data.media.toString()
                            }
                            if (this.updatedPage.folder == 'blogs') {
                                for (let s of this.store.blogs) {
                                    if (s.id == res.data.id) {
                                        for (let prop of Object.keys(res.data)) {
                                            s[prop] = res.data[prop]
                                        }
                                    }
                                }
                            } else {
                                for (let s of this.store.services) {
                                    if (s.id == res.data.id) {
                                        for (let prop of Object.keys(res.data)) {
                                            s[prop] = res.data[prop]
                                        }
                                    }
                                }
                            }

                            notify.success(res.message)
                        } else throw res.message
                    }
                }
            } catch (err) {

                console.log(err);
                notify.alert(`Please inform Mahmoud about this error = ${err}`)
            }
        }
    },
    mounted() {
        try {
            this.initPage()
            var quill = new Quill('#editor-container', {
                theme: 'snow',
                modules: {
                    toolbar: [
                        // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                        ['bold', 'italic', 'underline', 'strike', 'clean', 'link', { 'direction': 'rtl' }, 'code-block', 'blockquote'],
                    ],
                },

            });

            quill.on('text-change', function (delta, oldDelta, source) {
                // !!!!!!!!! the THIS operator of vue js is not scoped in here !!!!!!!!!!!!!!
                // Handle text change event
                document.getElementById('editor-output').innerHTML = quill.root.innerHTML.replaceAll('amp;','')
            });

            this.restoreArticle()
        } catch (err) {

        }
    },

    beforeRouteLeave(to, from, next) {
        try {
            // this.updatedPage.article = document.getElementById('editor-output').innerHTML
            this.updatedPage.article = document.getElementsByClassName('ql-editor').item(0).innerHTML
            // console.log(this.store.nextPage.article);
            next()
        } catch (err) {

            console.log(err);
            notify.alert(`Please inform Mahmoud about this error = ${err}`)
        }

    },
}

export default app
