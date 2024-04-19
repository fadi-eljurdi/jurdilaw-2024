import Page from './classes/Page.js'
export default {
    version: '1.3',
    devmode:false,
    OAuthUser: false,
    username: '',
    password: '',
    isLogedIn: false,
    geminiToken: '',
    api: 'https://script.google.com/macros/s/AKfycbyGJq2iVwVJ4wV_sp_eirRD0fJGUs_7bJ_lTWJRRnxBiq0ge7OmHhKKbuKohQfQa3p-/exec',

    spinner: false,
    services: [],
    blogs: [],
    contact: {},
    nextContact: {},
    nextPage: new Page(),
    navbarBg: 'bg-transparent',
    nextUpdatedPage: new Page()

}