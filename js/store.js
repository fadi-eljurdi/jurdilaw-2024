import Page from './classes/Page.js'
export default {
    version: '1.1',
    showReels: false,
    showMeetingModal: false,
    showSubscribtionModal: false,
    logoSrc: '/assets/logo-3.jpg',
    OAuthUser: false,
    username: '',
    password: '',
    isLogedIn: true,
    githubToken: '',
    geminiToken: '',
    api: 'https://script.google.com/macros/s/AKfycbzayZLP651XR7YC-jlk8Dg-yxg5ncH0SeM86ZhKDpKPMIRzyE37wwid06aIaXLeGQ-F/exec',
    reels: [],
    services: [],
    blogs: [],
    links: [],
    contact: {},
    nextPage: new Page(),
    nextPageTemplate: null,
    navbarBg:'bg-transparent'


}