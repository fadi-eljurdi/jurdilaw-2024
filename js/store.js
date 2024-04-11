import Page from './classes/Page.js'
export default {
    version: '1.2',
    devmode:true,
    OAuthUser: false,
    username: '',
    password: '',
    isLogedIn: false,
    geminiToken: '',
    api: 'https://script.google.com/macros/s/AKfycbwFA7WaesTWB7A-HZsh2v4hcYilIPx3oFPZhXdLgB5wRbFsjck9zDpKGF8R6ZaBhCCe/exec',

    spinner: false,
    services: [],
    blogs: [],
    contact: {},
    nextContact: {},
    nextPage: new Page(),
    navbarBg: 'bg-transparent',
    nextUpdatedPage: new Page()


}