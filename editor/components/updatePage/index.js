import utilities from "../../../js/utilities.js"
import store from '../../../js/store.js'
import Page from '../../../js/classes/Page.js'
import { GoogleGenerativeAI } from "@google/generative-ai";

var notify = new AWN();
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
            if (this.$route.params.pageFolder != '' && this.$route.params.pageFolder && this.$route.params.pageId != '' && this.$route.params.pageId) return true
            return false
        },
    },
    methods: {

        getUpdatedPayload() {
            this.updatedPage.article = document.getElementsByClassName('ql-editor').item(0).innerHTML
            // console.log(utilities.diffProperties(this.updatedPage, this.initialPage));
            return utilities.diffProperties(this.updatedPage, this.initialPage)
        },

        initPage() {

            // select page record
            this.updatedPage.folder = this.$route.params.pageFolder
            for (let page of this.store[this.$route.params.pageFolder]) {
                if (page.id == this.$route.params.pageId) {
                    this.updatedPage = new Page(page)
                    this.initialPage = new Page(page)

                }
            }
            // console.log('updated page');
            // console.log(this.updatedPage.article);
            // extracting the article from the host
            var payload = {
                username: this.store.username,
                password: this.store.password,
                pageId: this.$route.params.pageId
            }
            this.spinner = true
            // console.log(payload);
            fetch(this.store.api + `?getPageArticle`, {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain"
                },
                body: JSON.stringify(payload)
            }).then(res => res.json()).then(res => {
                // console.log(res);
                if (res.status) {

                    this.updatedPage.article = res.data
                    this.initialPage.article = res.data
                    document.getElementsByClassName('ql-editor').item(0).innerHTML = res.data
                    this.spinner = false
                } else notify.warning(res.message, { labels: { warning: 'Failed to get the article, please inform the developer.' } })
            })

        },

        async geminiRun(key, prompt) {
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
        },

        restoreArticle() {
            document.getElementsByClassName('ql-editor').item(0).innerHTML = this.updatedPage.article
        },

        resetThumbnails() {
            if (confirm('Reset all thumbnails?')) {
                this.updatedPage.media = null
            }
        },

        async selectImages() {
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
        },

        updatePage() {
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
                    fetch(this.store.api + `?updatePage`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "text/plain"
                        },
                        body: JSON.stringify(payload)
                    }).then(res => res.json()).then(res => {
                        console.log(res);
                        if (res.status) {
                            this.spinner = false

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

                            notify.success(res.message, { labels: { success: 'MESHE L7AL' } })
                        } else {
                            this.spinner = false

                            notify.warning(res.message, { labels: { warning: 'MA MESHE L7AL' } })
                        }
                    }).catch(err => {
                        this.spinner = false

                        notify.alert('Weak network please try again later')
                    })
                }

            } else alert('Nothing to update!')
        }
    },
    mounted() {
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
            document.getElementById('editor-output').innerHTML = quill.root.innerHTML
        });

        this.restoreArticle()
    },

    beforeRouteLeave(to, from, next) {
        this.updatedPage.article = document.getElementById('editor-output').innerHTML
        // console.log(this.store.nextPage.article);
        next()

    },
}

export default app
