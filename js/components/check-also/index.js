import utilities from "../../utilities.js"
import store from '../../store.js'
import Blog from '../../classes/Blog.js'
import Service from '../../classes/Service.js'
import '../../packages/visme.min.js'

export default {
    template: await utilities.getPage('/js/components/check-also/index.html'),
    data() {
        return {
            store,
            utilities
        }
    },
    computed: {

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

            var links = this.selectedPage.links.replaceAll('\n','').split(',')
            var workspaceLinks = links.filter(e => e.includes('https://docs.google.com/spreadsheets/d/') || e.includes('https://docs.google.com/presentation/d/') || e.includes('https://docs.google.com/document/d/'))
            // console.log(workspaceLinks);
            var googleDriveFilesLinks = links.filter(e => e.includes('https://drive.google.com/file/d/'))
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

        googleFormsLinks() {

            var links = this.selectedPage.links.replaceAll('\n','').split(',')
            var workspaceLinks = links.filter(e => e.includes('https://docs.google.com/forms/d/'))
            // console.log(workspaceLinks);

            return [
                ...workspaceLinks.map(node => {
                    if (utilities.getWorkspaceId(node)) return utilities.getWorkspaceId(node)
                })
            ]
        },

        canvaLinks() {

            // var links = [
            //     'https://www.canva.com/design/DAFiU9g0Kmg/BQqvCCfoiKTtz1b2WOH1JQ/edit',
            //     'https://www.canva.com/design/DAFiU9g0Kmg/BQqvCCfoiKTtz1b2WOH1JQ/edit?utm_content=DAFiU9g0Kmg&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton',
            //     'https://www.canva.com/design/DAFiU9g0Kmg/view',
            // ]

            var links = this.selectedPage.links.replaceAll('\n','').split(',')
            var canvaLinks = links.filter(e => e.includes('https://www.canva.com/design/'))
            return [
                ...canvaLinks.map(node => {
                    if (utilities.getCanvaId(node)) return utilities.getCanvaId(node)
                })
            ]
        },
        
        vismeLinks() {

            // var links = [
            //     'https://my.visme.co/view/8r6ev7kp-untitled-project',
            // ]

            var links = this.selectedPage.links.replaceAll('\n','').split(',')
            var vismeLinks = links.filter(e => e.includes('https://my.visme.co/view/'))
            return [
                ...vismeLinks.map(node => {
                    if (utilities.getVismeId(node)) return utilities.getVismeId(node)
                })
            ]
        }

    }

}
