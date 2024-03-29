export default class Blogs {
    constructor(payload = null) {
        var keys = ['id', 'date', 'thumbnails', 'youtube', 'googleDrive', 'title', 'badge', 'keywords', 'description', 'url', 'folder']
        for (let prop of keys) {
            this[prop] = payload ? payload[prop] : ''
        }
    }
}