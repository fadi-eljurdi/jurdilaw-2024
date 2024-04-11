import utilities from "../../utilities.js"
import store from '../../store.js'
export default {
    template: await utilities.getPage('/js/components/blog-footer/index.html'),
    data() {
        return {
            store,
            utilities,
            spinner: '',
            translationOutput: null,
            translated: false
        }
    },
    methods: {

        toggleTranslation() {


            const dir = () => {
                if (document.querySelector('html').lang == 'ar') return 'rtl'
                else return 'ltr'
            }

            const setTransStyles = () => {
                if (document.querySelector('html').lang == 'ar') {
                    //the page is already in arabic

                    var output = document.getElementById('translationOutput')
                    output.setAttribute('dir', 'ltr')
                    output.classList.add('font-title')
                } else {
                    // the page is in english

                    var output = document.getElementById('translationOutput')
                    output.setAttribute('dir', 'rtl')
                    output.classList.add('font-arabic')
                }
            }

            var article = document.querySelector('.article-aside')

            var source = () => {
                if (dir() == 'rtl') return 'ar'
                return 'en'
            }
            var target = () => {
                if (dir() == 'rtl') return 'en'
                return 'ar'
            }

            // check if already translated
            if (this.translationOutput == null) {

                this.spinner = true
                fetch(this.store.api + '?translatePage', {
                    method: "POST",
                    headers: {
                        "Content-Type": "text/plain"
                    },
                    body: JSON.stringify({
                        translatePage: {
                            text: article.innerHTML,
                            source: source(),
                            target: target()

                        }
                    })
                }).then(res => res.json()).then(res => {
                    console.log(res);
                    if (res.status) {
                        article.classList.toggle('d-none')
                        setTransStyles()
                        this.translationOutput = (utilities.fixClosingTags(res.data)).replaceAll(' & nbsp؛ ', ' ')
                        this.translated = true
                    } else {
                        alert('The translation for this blog is unavailable for now, contact us if you have questions related to this blog.')
                    }

                    this.spinner = false
                }).catch(err => {
                    console.log(err);
                    this.spinner = false
                    alert('Weak network, please try to translate this page later or contact us if you have any questions about this blog.')
                })


            } else {
                // show original
                document.getElementById('translationOutput').classList.toggle('d-none')
                article.classList.toggle('d-none')
                this.translated = !this.translated
            }


        },

        sharePage() {
            var title = document.querySelector('.article-h1').textContent
            var url = location.href
            utilities.shareBy(title, url)
        },

        copyPageUrl() {
            navigator.clipboard.writeText(location.href)
            alert('URL Copied!')
        }
    }
}