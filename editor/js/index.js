import store from '../../js/store.js'
import utilities from '../../js/utilities.js'

import Blog from '../../js/classes/Blog.js'
import Service from '../../js/classes/Service.js'


import '../../js/packages/day.min.js'
import '../../js/packages/relativetime.min.js'
import '../../js/packages/swiper.min.js'


var notify = new AWN({
    labels:{
        alert:"Basita 😉",
        success:"MESHE L7AL 😎",
        warning:"MA MESHE L7AL 😟"
    }
});


var app = Vue.createApp({
    data() {
        return {
            store,
            utilities,
            spinner: false,
        }
    },
    methods: {

        async login() {

            try {
                this.spinner = true
                var res = await fetch(this.store.api, {
                    method: "POST",
                    headers: {
                        "Content-Type": "text/plain"
                    },
                    body: JSON.stringify({
                        username: this.store.username,
                        password: this.store.password
                    })
                })
                res = await res.json()
                console.log(res);

                if (res.status) {
                    this.spinner = false
                    this.store.geminiToken = res.data.geminiToken
                    this.store.isLogedIn = true
                } else {
                    this.spinner = false
                    throw res.message
                }

            } catch (err) {
                console.log(err);

                this.spinner = false
                notify.alert(`${err}`)
            }


        },

        async getProfile() {
            try {

                this.spinner = true
                var res = await fetch(this.store.api + '?getProfile')
                res = await res.json()

                if (res.status) {
                    this.store.blogs = res.data.blogs.map(node => new Blog(node))
                    this.store.services = res.data.services.map(node => new Service(node))
                    this.store.contact = { ...res.data.contact }
                    this.store.nextContact = res.data.contact
                    this.spinner = false

                } else {
                    this.spinner = false
                    throw res.message
                }

            } catch (err) {

                this.spinner = false
                console.log(err);
                notify.alert(err)
            }
        }
    },
    async mounted() {
        this.getProfile()
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

import mediaPreview from '../../editor/components/mediaPreview/index.js'
app.component('media-preview', mediaPreview)

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