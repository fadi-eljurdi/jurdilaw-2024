export default class Page {
    constructor(payload = null) {
        var keys = ['id', 'timestamp', 'media', 'title', 'badge', 'keywords', 'description', 'url', 'folder','article','links']
        for (let prop of keys) {
            this[prop] = payload ? payload[prop] : ''
        }
    }
}