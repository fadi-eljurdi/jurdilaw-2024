import utilities from "../../../js/utilities.js"
import store from '../../../js/store.js'
export default {
    template: await utilities.getPage('/editor/components/mediaPreview/index.html'),
    data() {
        return {
            store,
            utilities
        }
    },
    props: ['links', 'thumbnails'],
    computed: {
        allLinks() {
            return [...this.canvaLinks, ...this.googleFormsLinks, ...this.googleFiles, ...this.youtubeLinks, ...this.getThumbnailsLinks]
            // return [...this.canvaLinks,...this.googleFormsLinks,...this.googleFiles,...this.youtubeLinks,...this.store.nextPage.media]
        },

        getThumbnailsLinks() {
            if (typeof (this.thumbnails) === 'string') {
                return this.thumbnails.split(',').filter(e => e != '')
            }
            return this.thumbnails

        },

        canvaLinks() {

            // var links = [
            //     'https://www.canva.com/design/DAFiU9g0Kmg/BQqvCCfoiKTtz1b2WOH1JQ/edit',
            //     'https://www.canva.com/design/DAFiU9g0Kmg/BQqvCCfoiKTtz1b2WOH1JQ/edit?utm_content=DAFiU9g0Kmg&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton',
            //     'https://www.canva.com/design/DAFiU9g0Kmg/view',
            // ]

            var canvaLinks = this.links.filter(e => e.includes('https://www.canva.com/design/'))
            return [
                ...canvaLinks.map(node => {
                    if (utilities.getCanvaId(node)) return utilities.getCanvaId(node)
                })
            ]
        },

        googleFormsLinks() {

            var workspaceLinks = this.links.filter(e => e.includes('https://docs.google.com/forms/d/'))
            // console.log(workspaceLinks);

            return [
                ...workspaceLinks.map(node => {
                    if (utilities.getWorkspaceId(node)) return utilities.getWorkspaceId(node)
                })
            ]
        },
        

        vismeLinks() {

            // var links = [
            //     'https://my.visme.co/view/8r6ev7kp-untitled-project',
            // ]

            // var links = this.selectedPage.links.replaceAll('\n','').split(',')
            var vismeLinks = this.links.filter(e => e.includes('https://my.visme.co/view/'))
            return [
                ...vismeLinks.map(node => {
                    if (utilities.getVismeId(node)) return utilities.getVismeId(node)
                })
            ]
        },

        googleFiles() {

            // var links = [
            // 'https://docs.google.com/presentation/d/1-VXMto26IlVnvHaxxIZL10xC_vVU-ciPCJuYF4Z8iTY/edit?usp=sharing',
            // 'https://docs.google.com/spreadsheets/d/1iui-rcOQMxT0AO17miztbBbdI7MNwi_XK2IWG_T8KUA/edit?usp=sharing',
            // 'https://drive.google.com/file/d/1cmu9_ol2bYxCmvPN4qamu54hphqB1q3X/view?usp=sharing',
            // 'https://docs.google.com/forms/d/e/1FAIpQLScZus61C6F8lwZjt_cvuRx4XQYt7Z5aonchGbmogVpFD31E6Q/viewform?usp=sharing',
            // 'https://docs.google.com/document/d/1dizuNfpXLsSlLsBNlnEBb1271VjzYAxUEWUR0ResuXQ/edit?usp=sharing',
            // 'https://drive.google.com/file/d/1wYb_GroAi_vLuBBWPqXFPXMFsGiIOL0f/view?usp=sharing',
            // 'https://drive.google.com/file/d/1Bh0U3h5xZUi9FBTXFTDSEXPzgO_xVN1u/view?usp=sharing',
            // ]

            // var links = this.selectedPage.links.split(',')
            var workspaceLinks = this.links.filter(e => e.includes('https://docs.google.com/spreadsheets/d/') || e.includes('https://docs.google.com/presentation/d/') || e.includes('https://docs.google.com/document/d/'))
            // console.log(workspaceLinks);
            var googleDriveFilesLinks = this.links.filter(e => e.includes('https://drive.google.com/file/d/'))
            // console.log(googleDriveFilesLinks);

            return [

                ...googleDriveFilesLinks.map(node => {
                    if (utilities.getDriveFileId(node)) return utilities.getDriveFileId(node)
                }),
                ...workspaceLinks.map(node => {
                    if (utilities.getWorkspaceId(node)) return utilities.getWorkspaceId(node)
                })
            ]

        },
        youtubeLinks() {
            var links = this.links.filter(e => e.includes('youtu'))
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
        slideNext() {
            const swiperEl = document.querySelector('swiper-container');
            // console.log(swiperEl.swiper);
            swiperEl.swiper.slideNext();
        },
        slideBack() {
            const swiperEl = document.querySelector('swiper-container');
            // console.log(swiperEl.swiper);
            swiperEl.swiper.slidePrev();
        },
    }
}