export default class Page {
    constructor(payload = null) {
        var keys = ['id', 'timestamp', 'thumbnails', 'youtube', 'googleDrive', 'title', 'badge', 'keywords', 'description', 'url', 'flag', 'client', 'folder','article']
        for (let prop of keys) {
            this[prop] = payload ? payload[prop] : ''
        }
    }
}