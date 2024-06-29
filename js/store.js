import Page from './classes/Page.js'
export default {
    version: '1.5',
    devmode:false,
    OAuthUser: false,
    username: '',
    password: '',
    isLogedIn: false,
    geminiToken: '',
    api: 'https://script.google.com/macros/s/AKfycbxKQD9Y5RTA9J52wAVcIeTMv3W36sQypUqhCpEuvpHKlh8jj14rxRGlCyecZjiyqME/exec',

    spinner: false,
    services: [],
    blogs: [],
    contact: {},
    nextContact: {},
    nextPage: new Page(),
    navbarBg: 'bg-transparent',
    nextUpdatedPage: new Page()

}