import utilities from "../../../js/utilities.js"
import store from '../../../js/store.js'
import Reel from '../../../js/classes/Reel.js'
export default {
    template: await utilities.getPage('/editor/components/reelsEditor/index.html'),
    data() {
        return {
            store,
            utilities,
            spinner: false,
            addedReel: new Reel(),
            removedReel: new Reel()
        }
    },
    computed: {
        loadingReels() {
            return this.store.reels.length == 0
        }
    },
    methods: {
        
        async selectImages() {
            var files = await utilities.openFiles()
            var files64 = [];
            for (let i = 0; i < 1; i++) {
                files64.push({
                    alt: `Reels ${i} ${utilities.getCurrentDate()}`,
                    // src64: await utilities.file64(files[i])
                    src64: await utilities.optimizeImageQuality(await utilities.file64(files[i]), 0.7)
                })
            }
            this.addedReel.thumbnails = files64
        },

        createNewReel() {
            if (utilities.isValidPayload(this.addedReel, ['title', 'thumbnails']).status) {
                if (confirm('Are you sure?')) {
                    this.spinner = true
                    fetch(this.store.api + '?createNewReel', {
                        method: "POST",
                        headers: {
                            "Content-Type": "text/plain"
                        },
                        body: JSON.stringify({
                            username: this.store.username,
                            password: this.store.password,
                            createNewReel: this.addedReel
                        })
                    }).then(res => res.json()).then(res => {

                        console.log(res);
                        if (res.status) {
                            try {
                                this.addedReel.id = res.data.id
                                this.addedReel.timestamp = new Date().toUTCString()
                                res.data.record.thumbnails = res.data.record.thumbnails.toString()
                                this.store.reels.push(res.data.record)
                                alert(res.message)
                            } catch (err) {
                                alert(err)
                                console.log(err);
                            }


                        } else alert(res.message)
                        this.spinner = false
                    }).catch(err => {
                        console.error(err);
                        this.spinner = false
                    })
                }
            }
        },

        removeReel() {
            if (confirm('Are you sure?')) {
                this.spinner = true
                fetch(this.store.api + '?removeReel', {
                    method: "POST",
                    headers: {
                        "Content-Type": "text/plain"
                    },
                    body: JSON.stringify({
                        username: this.store.username,
                        password: this.store.password,
                        removeReel: this.removedReel
                    })
                }).then(res => res.json()).then(res => {

                    console.log(res);
                    if (res.status) {
                        try {
                            this.store.reels = this.store.reels.filter(e => e.id != this.removedReel.id)
                            alert(res.message)
                        } catch (err) {
                            alert(err)
                            console.log(err);
                        }


                    } else alert(res.message)
                    this.spinner = false
                }).catch(err => {
                    console.error(err);
                    this.spinner = false
                })
            }
        }
    }
}