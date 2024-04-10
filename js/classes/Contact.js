export default class Contact {
    constructor(payload = null) {
        var keys = ['address', 'bHeading', 'bTagline', 'bio', 'email','heading','linkedIn','logo','number','sHeading','sTagline','video','whatsapp']
        for (let prop of keys) {
            this[prop] = payload ? payload[prop] : ''
        }
    }
}

// export default class Contact {
//     constructor(payload = null) {
//         var keys = ['address', 'bHeading', 'bTagline', 'bio', 'email','heading','linkedIn','logo','number','sHeading','sTagline','video','whatsapp']
//         for (let prop of keys) {
//             this[prop] = payload ? payload[prop] : ''
//         }
//     }
// }