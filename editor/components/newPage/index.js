import utilities from "../../../js/utilities.js"
import store from '../../../js/store.js'
import Page from '../../../js/classes/Page.js'

import { GoogleGenerativeAI } from "@google/generative-ai";

var notify = new AWN();
export default {
    template: await utilities.getPage('/editor/components/newPage/index.html'),
    data() {
        return {
            store,
            utilities,
            spinner: false,

        }
    },
    methods: {

        async geminiRun(key, prompt) {
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
        },
        restoreArticle() {
            document.getElementsByClassName('ql-editor').item(0).innerHTML = this.store.nextPage.article
        },
        refreshArticle(){
            this.store.nextPage.article = document.getElementById('editor-output').innerHTML
            console.log(this.store.nextPage.article);
        },
        async publishPage() {

            try {

                const validation = utilities.isValidPayload(this.store.nextPage, ['title', 'badge', 'folder', 'keywords', 'description', 'media'])
                if (validation.status) {
                    if (this.store.nextPage.article.trim() != '' && this.store.nextPage.article.trim().replaceAll(' ','') != '<p><br></p>' && this.store.nextPage.article.trim().replaceAll(' ','') != '<p></p>' ) {
                        if (confirm('M2akad bedak ta3mol publish ?')) {
                            this.spinner = true
                            this.store.nextPage.article = document.getElementById('editor-output').innerHTML
                            // this.store.nextPage.url = this.generatePageUrl

                            // saving record
                            var payload = {
                                username: this.store.username,
                                password: this.store.password,
                                createPage: this.store.nextPage
                            }
                            // payload[this.selectPageType] = this.store.nextPage
                            // payload = utilities.removeEmptyProperties(payload)
                            console.log('payload:');
                            console.log(payload);

                            fetch(this.store.api + `?createPage`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "text/plain"
                                },
                                body: JSON.stringify(payload)
                            }).then(res => res.json()).then(res => {
                                console.log(res);
                                if (res.status) {
                                    this.store.nextPage = new Page()
                                    this.spinner = false
                                    if (this.store.nextPage.folder == 'blogs') {
                                        this.store.blogs.push(res.data)
                                    } else {
                                        this.store.services.push(res.data)
                                    }
                                    notify.success(res.message,{labels:{success:'MESHE L7AL'}})
                                } else {
                                    this.spinner = false
                                    notify.warning(res.message,{labels:{warning:'MA MESHE L7AL'}})
                                }
                            }).catch(err => {
                                this.spinner = false
                                notify.alert('Weak network please try again later',{labels:{success:'DONT WORRY'}})
                            })
                        }
                    } else notify.warning('Article is missing')
                } else notify.warning(validation.message)

            } catch (err) {
                console.log(err);

                notify.warning(err)
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
            this.store.nextPage.media = files64
        },
        resetPage(){
            
            this.store.nextPage = new Page()
        }
    },
    mounted() {
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

        // quill.keyboard.addBinding({
        //     key: 'q',
        //     ctrlKey: true
        // }, function (range, context) {
        //     quill.formatText(range, 'blockquote', true);
        // });

        quill.on('text-change', function (delta, oldDelta, source) {
            // !!!!!!!!! the THIS operator of vue js is not scoped in here !!!!!!!!!!!!!!
            // Handle text change event

            document.getElementById('editor-output').innerHTML = quill.root.innerHTML
            store.nextPage.article = quill.root.innerHTML
        });

        this.restoreArticle()
        // if(this.store.nextPage.article == '') {
        //     document.getElementsByClassName('ql-editor').item(0).innerText = 'Write something...'
        // }
    },

    beforeRouteLeave(to, from, next) {
        this.store.nextPage.article = document.getElementById('editor-output').innerHTML
        // console.log(this.store.nextPage.article);
        next()

    },
}

