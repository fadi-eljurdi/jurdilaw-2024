export default class Service {
    constructor(payload = null) {
        var keys = ['id', 'timestamp', 'media','badge', 'title', 'keywords','description', 'url','index','folder','links']
        for (let prop of keys) {
            this[prop] = payload ? payload[prop] : ''
        }
    }
}