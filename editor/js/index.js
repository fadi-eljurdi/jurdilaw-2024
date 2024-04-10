import store from '../../js/store.js'
import utilities from '../../js/utilities.js'

import Blog from '../../js/classes/Blog.js'
import Service from '../../js/classes/Service.js'

import Contact from '../../js/classes/Contact.js'
import '../../js/packages/day.min.js'
import '../../js/packages/relativetime.min.js'


var app = Vue.createApp({
    data() {
        return {
            store,
            utilities,
            spinner: false,
        }
    },
    methods: {

        login() {
            this.spinner = true
            fetch(this.store.api, {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain"
                },
                body: JSON.stringify({
                    username: this.store.username,
                    password: this.store.password
                })
            }).then(res => res.json()).then(res => {
                console.log(res);
                if (res.status) {
                    this.spinner = false
                    this.store.geminiToken = res.data.geminiToken
                    this.store.isLogedIn = true
                    // this.getProfile()
                }
            }).catch(err => {
                console.log(err);
                this.spinner = false
            })
        },

        getProfile() {
            this.spinner = true
            fetch(this.store.api + '?getProfile').then(res => res.json()).then(res => {
                console.log(res);
                if (res.status) {

                    this.store.blogs = res.data.blogs.map(node => new Blog(node))
                    this.store.services = res.data.services.map(node => new Service(node))
                    this.store.contact = {...res.data.contact}
                    this.store.nextContact = res.data.contact
                    // this.store.contact = new Contact(res.data.contact)

                    console.log(this.store.blogs);
                    console.log(this.store.services);
                }

                this.spinner = false

            }).catch(err => {
                console.log(err);
                this.spinner = false
            })
        }
    },
    async mounted() {
        this.getProfile()
        // var notify = new AWN(globalOptions);
        // // fetching the template
        // this.store.nextPageTemplate = await utilities.getPage('/_template/index.html')
    }
})


import pageNotFound from '../../editor/components/pageNotFound/index.js'
app.component('page-not-found', pageNotFound)

import newPage from '../../editor/components/newPage/index.js'
app.component('new-page', newPage)

import pageEditor from '../../editor/components/pageEditor/index.js'
app.component('page-editor', pageEditor)

import updatePage from '../../editor/components/updatePage/index.js'
app.component('update-page', updatePage)

import contactEditor from '../../editor/components/contactEditor/index.js'
app.component('contact-editor', contactEditor)

// import linksEditor from '../../editor/components/linksEditor/index.js'
// app.component('links-editor', linksEditor)

// import reelsEditor from '../editor/components/reelsEditor/index.js'
// app.component('links-editor', reelsEditor)


const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: pageEditor,
            name: 'home',
        },
        { path: '/contactEditor', component: contactEditor, name: 'contactEditor' },
        // { path: '/links', component: linksEditor, name: 'links' },
        // { path: '/reels', component: reelsEditor, name: 'reels' },
        { path: '/new-page', component: newPage, name: 'newPage' },
        { path: '/update-page/:pageFolder/:pageId', component: updatePage, name: 'updatePage' },
        { path: '/:pathMatch(.*)*', component: pageNotFound, name: 'pageNotFound' },
    ]
})

app.use(router)
app.mount('#root')