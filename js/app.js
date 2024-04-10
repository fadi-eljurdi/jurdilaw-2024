import './packages/day.min.js'
import './packages/relativetime.min.js'
import './packages/bootstrap.min.js'
import './packages/swiper.min.js'
import store from './store.js'
import utilities from './utilities.js'

import Blog from './classes/Blog.js'
import Service from './classes/Service.js'
import Contact from './classes/Contact.js'
const app = Vue.createApp({
    data() {
        return {
            store,
            utilities,
            spinner: false,
            translated: false
        }
    },
    methods: {

        font() {
            if (document.querySelector('html').lang == 'ar') {
                //the page is already in arabic

                var translated = document.querySelector('#translated')
                translated.setAttribute('dir', 'ltr')
                translated.classList.add('font-title')
            } else {
                // the page is in english

                var translated = document.querySelector('#translated')
                translated.setAttribute('dir', 'rtl')
                translated.classList.add('font-arabic')
            }
        },
        dir() {
            if (document.querySelector('html').lang == 'ar') return 'rtl'
            else return 'ltr'

        },
        async getProfile() {
            try {
                this.spinner = true
                fetch(this.store.api + '?getProfile').then(res => res.json()).then(res => {
                    console.log(res);
                    
                    // this.store.links = res.links.map(node => new Link(node))
                    this.store.blogs = res.data.blogs.map(node => new Blog(node))
                    this.store.services = res.data.services.map(node => new Service(node))

                    this.store.contact = new Contact(res.data.contact)     
                    console.log(this.store.services);               
                    this.spinner = false
                })

            } catch (err) {
                console.log(err);
                this.spinner = false
            }

        },
        async translate() {

            this.spinner = true
            const original = document.querySelector('#original');
            // console.log(original.innerHTML);
            var source = () => {
                if (this.dir() == 'rtl') return 'ar'
                return 'en'
            }
            var target = () => {
                if (this.dir() == 'rtl') return 'en'
                return 'ar'
            }
            var api = this.store.api
            api += `?translate=1`
            var res = await fetch(api, {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain"
                },
                body: JSON.stringify({
                    text: original.innerHTML,
                    source: source(),
                    target: target()

                })
            })

            res = await res.json()
            console.log(res);
            this.font()
            translated.innerHTML = (utilities.fixClosingTags(res)).replaceAll(' & nbsp؛ ', ' ')
            this.translated = true

            this.spinner = false


        },
    },
    mounted() {
        AOS.init()
        this.getProfile()

        if (document.querySelector('html').lang == 'ar') {
            if (document.getElementById('original')) {
                document.getElementById('original').dir = 'rtl'
                document.getElementById('original').classList.add('font-arabic')
            }
        } else {
            if (document.getElementById('original')) {

                document.getElementById('original').dir = 'ltr'
                document.getElementById('original').classList.add('font-title')
            }
        }
        
    }
})


import navbar from './components/navbar/index.js'
app.component('navbar', navbar)

import heroSection from './components/hero-section/index.js'
app.component('hero-section', heroSection)

import servicesSection from './components/services-section/index.js'
app.component('services-section', servicesSection)

import differenceSection from './components/difference-section/index.js'
app.component('difference-section', differenceSection)

import blogsSection from './components/blogs-section/index.js'
app.component('blogs-section', blogsSection)

import bannerSection from './components/banner-section/index.js'
app.component('banner-section', bannerSection)

import contactSection from './components/contact-section/index.js'
app.component('contact-section', contactSection)

import footerSection from './components/footer-section/index.js'
app.component('footer-section', footerSection)

// BLOGS Components
import spinner from './components/spinner/index.js'
app.component('spinner', spinner)

import pagination from './components/pagination/index.js'
app.component('pagination', pagination)

import blogMedia from './components/blog-media/index.js'
app.component('blog-media', blogMedia)

import blogHeader from './components/blog-header/index.js'
app.component('blog-header', blogHeader)

import checkAlso from './components/check-also/index.js'
app.component('check-also', checkAlso)


app.mount('#app')