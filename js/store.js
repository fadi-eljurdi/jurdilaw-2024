import Page from './classes/Page.js'
export default {
    version: '1.7',
    devmode:false,
    OAuthUser: false,
    username: '',
    password: '',
    isLogedIn: false,
    geminiToken: '',
    api: 'https://script.google.com/macros/s/AKfycbxeFDH2WxafY7VvfPaR9kEm6ZK8b00sFKektX8v0I7poBs3OgaMPR37oju0wkCZC6JG/exec',

    spinner: false,
    services: [],
    blogs: [],
    contact: {},
    nextContact: {},
    nextPage: new Page(),
    navbarBg: 'bg-transparent',
    nextUpdatedPage: new Page(),
    showSettings: false,
    logo:'/assets/logo-2025-1.png'

}