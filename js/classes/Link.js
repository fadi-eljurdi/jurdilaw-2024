export default class Link {
    constructor(payload = null) {
        var keys = ['id', 'timestamp', 'group', 'title', 'url']
        for (let prop of keys) {
            this[prop] = payload ? payload[prop] : ''
        }
    }
}