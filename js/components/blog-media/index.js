import utilities from "../../utilities.js"
import store from '../../store.js'
import Blog from '../../classes/Blog.js'
import Service from '../../classes/Service.js'
export default {
    template: await utilities.getPage('/js/components/blog-media/index.html'),
    data() {
        return {
            store,
            utilities,
            // selectedPage: null
        }
    },
    props: ['media'],
    computed: {
        thumbnails() {
            // return this.media.split(',')
            return this.selectedPage.media.split(',')
        },
        selectedPage() {
            var path = location.pathname
            var folder = utilities.getFolderFromUrl(path)
            if (folder === 'blogs') {
                return new Blog(this.store.blogs.filter(node => node.url.includes(path))[0])

            } else {
                if (folder === 'services') {
                    return new Service(this.store.services.filter(node => node.url.includes(path))[0])
                }
            }
        },
        youtubeLinks() {
            var links = this.selectedPage.links.split(',').filter(e => e.includes('youtu'))
            console.log(links);
            // var links = [
            //     'https://www.youtube.com/shorts/Z6l5uGAtFms?si=wBxHHo7qFUQiIugp',
            //     'youtube.com/shorts/Z6l5uGAtFms',
            //     'https://www.youtube.com/live/bNyUyrR0PHo',
            //     'https://youtube.com/live/bNyUyrR0PHo',
            //     'https://youtu.be/5i0Z0E5yaYI?si=wBxHHo7qFUQiIugp',
            //     'https://youtu.be/5i0Z0E5yaYI',
            //     'https://www.youtube.com/watch?v=bNyUyrR0PHo',
            //     'https://youtube.com/watch?v=bNyUyrR0PHo',
            //     'https://youtu.be/bNyUyrR0PHo'
            // ]

            return links.map(node => {
                if (utilities.getYoutubeId(node)) return utilities.getYoutubeId(node)
                if (utilities.getYoutubeLiveId(node)) return utilities.getYoutubeLiveId(node)
                if (utilities.getYoutubeIdShortenUrl(node)) return utilities.getYoutubeIdShortenUrl(node)
                if (utilities.getYoutubeShortsId(node)) return utilities.getYoutubeShortsId(node)
            })
        }
    },
    methods: {

    }
}