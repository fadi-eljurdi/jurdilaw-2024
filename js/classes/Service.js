export default class Service {
    constructor(payload = null) {
        var keys = ['id', 'date', 'thumbnail', 'title', 'description', 'url','index']
        for (let prop of keys) {
            this[prop] = payload ? payload[prop] : ''
        }
    }
}