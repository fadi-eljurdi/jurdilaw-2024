import Page from './classes/Page.js'
export default {
    version: '1.1',
    OAuthUser: false,
    username: '',
    password: '',
    isLogedIn: false,
    geminiToken: '',
    api: 'https://script.google.com/macros/s/AKfycbx1w87noC2uRzUKV3Bj80e4UaQxtVZ6ZtSwyiciQ58VLiQW6I-G86KdxKgr6ZVQgnRf/exec',
    
    services: [],
    blogs: [],
    contact: {},
    nextContact:{},
    nextPage: new Page(),
    navbarBg:'bg-transparent',
    nextUpdatedPage: new Page()


}