import utilities from "../../../js/utilities.js"
import store from '../../../js/store.js'
import Page from '../../../js/classes/Page.js'
import Blog from '../../../js/classes/Blog.js'
import Service from '../../../js/classes/Service.js'

import { GoogleGenerativeAI } from "@google/generative-ai";
var notify = new AWN({
    labels: {
        alert: "Basita 😉",
        success: "MESHE L7AL 😎",
        warning: "MA MESHE L7AL 😟"
    }
});
export default {
    template: await utilities.getPage('/editor/components/newPage/index.html'),
    data() {
        return {
            store,
            utilities,
            spinner: false,

        }
    },
    computed: {

        filteredLinks() {
            return this.store.nextPage.links.split(',').filter(e => e != '').map(e => e.trim()).filter(link => {
                return link.includes('https://docs.google.com/spreadsheets/d/') || link.includes('https://docs.google.com/presentation/d/') || link.includes('https://docs.google.com/document/d/') || link.includes('https://drive.google.com/file/d/') || link.includes('https://docs.google.com/forms/d/') || link.includes('https://www.canva.com/design/') || link.includes('youtu')
            })
        }

    },
    methods: {

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
                console.log(response);
                const text = response.text();
                // console.log(text);
                this.store.nextPage[key] = text.replaceAll('*', '').replaceAll('-', ',')
                this.spinner = false
                return text
            } catch (err) {
                this.spinner = false
                console.log(err);
                notify.alert('Please let Mahmoud know about this Error = ' + err)
            }
        },
        restoreArticle() {
            try {
                document.getElementsByClassName('ql-editor').item(0).innerHTML = this.store.nextPage.article
            } catch (err) {
                notify.alert('Please let Mahmoud know about this error = ' + err)
            }
        },
        refreshArticle() {
            try {

                // this.store.nextPage.article = document.getElementById('editor-output').innerHTML.replaceAll('amp;','')
                this.store.nextPage.article = document.getElementsByClassName('ql-editor').item(0).innerHTML
                console.log(this.store.nextPage.article);
            } catch (err) {
                notify.alert('Please let Mahmoud know about this error = ' + err)
            }
        },
        async publishPage() {

            try {
                const validation = utilities.isValidPayload(this.store.nextPage, ['title', 'badge', 'folder', 'keywords', 'description', 'media'])
                if (validation.status) {
                    if (this.store.nextPage.article.trim() != '' && this.store.nextPage.article.trim().replaceAll(' ', '') != '<p><br></p>' && this.store.nextPage.article.trim().replaceAll(' ', '') != '<p></p>') {
                        if (confirm('M2akad bedak ta3mol publish ?')) {
                            this.spinner = true
                            // this.store.nextPage.article = document.getElementById('editor-output').innerHTML.replaceAll('amp;','')
                            // this.store.nextPage.article = document.getElementsByClassName('ql-editor').item(0).innerHTML.replaceAll('amp;','')
                            this.store.nextPage.article = document.getElementsByClassName('ql-editor').item(0).innerHTML
                            console.log('end res');
                            console.log(this.store.nextPage.article);

                            // saving record
                            var payload = {
                                username: this.store.username,
                                password: this.store.password,
                                createPage: this.store.nextPage
                            }

                            var res = await fetch(this.store.api + `?createPage`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "text/plain"
                                },
                                body: JSON.stringify(payload)
                            })

                            res = await res.json()

                            console.log(res);
                            if (res.status) {
                                this.store.nextPage.article = ''
                                res.data.media = res.data.media.toString()
                                document.getElementsByClassName('ql-editor').item(0).innerHTML = ""
                                // console.log(res.data.media);
                                console.log(new Blog(res.data));
                                
                                this.spinner = false
                                if (this.store.nextPage.folder == 'blogs') {
                                    this.store.blogs.push(new Blog(res.data))
                                    console.log(this.store.blogs);

                                } else {
                                    this.store.services.push(new Service(res.data))
                                }
                                notify.success(res.message)
                                
                                this.store.nextPage = new Page()
                            } else {
                                this.spinner = false
                                throw res.message
                            }
                        }
                    } else throw 'Article is missing'
                } else throw validation.message

            } catch (err) {
                console.log(err);
                notify.warning(err)
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
                this.store.nextPage.media = files64
            } catch (err) {
                console.log(err);
                notify.alert('Please let Mahmoud know about this error = ' + err)
            }
        },
        resetPage() {
            this.store.nextPage = new Page()
        }
    },
    mounted() {
        try {
            var quill = new Quill('#editor-container', {
                theme: 'snow',
                modules: {
                    toolbar: [
                        [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike', 'clean', 'link', { 'direction': 'rtl' }],
                    ],
                    // keyboard: {
                    //     bindings: {
                    //         'ctrl+q': function (range, context) {
                    //             if (!context.selection.isCollapsed()) {
                    //                 quill.blockquote.toggle();
                    //             }
                    //         }
                    //     }
                    // }
                },

            });

            quill.on('text-change', function (delta, oldDelta, source) {
                // !!!!!!!!! the THIS operator of vue js is not scoped in here !!!!!!!!!!!!!!
                // Handle text change event
                // console.log(quill.root.innerHTML);
                document.getElementById('editor-output').innerHTML = quill.root.innerHTML.replaceAll('amp;','')
                store.nextPage.article = quill.root.innerHTML.replaceAll('amp;','')
            });

            this.restoreArticle()

        } catch (err) {
            
            console.log(err);
            notify.alert('Please let Mahmoud know about this error = ' + err)
        }
    },

    beforeRouteLeave(to, from, next) {
        // this.store.nextPage.article = document.getElementById('editor-output').innerHTML
        this.store.nextPage.article = document.getElementsByClassName('ql-editor').item(0).innerHTML
        // console.log(this.store.nextPage.article);
        next()

    },
}

