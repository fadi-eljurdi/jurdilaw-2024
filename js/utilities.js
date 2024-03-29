
function getPage(path) {

    var origin = new URL(location.href).origin
    // if (path.includes('http')) origin = ""
    return new Promise((resolve, reject) => {
        // console.log(origin);
        fetch(path.includes('http') ? path : `${origin}/${path}`).then(res => res.text()).then(res => {
            resolve(res)
        })
            .catch(err => {
                // console.log(err);
                reject(err)
            })
    })
}


function getYouTubeId(url) {
    const regex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/\?v=)|youtu\.be\/)([^\s&]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
}


function openFiles() {
    return new Promise((res, rej) => {
        try {
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/png, image/jpeg, image/jpg');
            input.setAttribute('multiple', true);
            // document.appendChild(input)
            // console.log(input);
            input.click();
            input.addEventListener('change', e => {
                // console.log(e.target.files);
                res(e.target.files)
            })
        } catch (err) {
            // console.log(err);
            rej(500)
        }
    })
}


function optimizeImageQuality(imageDataURI, quality) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            // const quality = 0.7; 
            const optimizedImageDataURI = canvas.toDataURL('image/jpeg', quality);
            resolve(optimizedImageDataURI);
        };
        img.onerror = (err) => {
            reject(err);
        };
        img.src = imageDataURI;
    });
}



function file64(path) {
    return new Promise((yes, no) => {
        try {
            const reader = new FileReader()
            reader.readAsDataURL(path)
            reader.onload = () => {
                yes(reader.result)
            }
        } catch (err) {
            no(err)
        }
    })
}



function timo(date) {
    dayjs.extend(window.dayjs_plugin_relativeTime);
    dayjs();
    const futureDate = dayjs(date);
    // console.log(futureDate.fromNow());
    return futureDate.fromNow()
}


function shareBy(title, url) {
    if (navigator.share) {
        navigator.share({
            title: title,
            url: url
        })
            .then(() => console.log('Shared successfully'))
            .catch((error) => console.error('Error sharing:', error));
    } else {
        console.log('Web Share API not supported');
    }
}
function getYouTubeThumbnail(youtubeUrl) {
    // Regular expression to match YouTube video ID
    const regex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=|live\/\S+\/))(?:(\w+)|(?:(\S*?)(?:\?si=\S+)?))/;

    // Extract video ID from the URL using the regular expression
    const match = youtubeUrl.match(regex);

    if (match && (match[1] || match[2])) {
        const videoId = match[1] || match[2];

        // Construct the thumbnail URL using the video ID
        const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

        return thumbnailUrl;
    } else {
        // Invalid YouTube URL
        console.error('Invalid YouTube URL');
        return null;
    }
}

// function getYoutubeId(youtubeUrl) {
//     // Regular expression to match YouTube video ID
//     const regex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=|live\/\S+\/))(?:(\w+)|(?:(\S*?)(?:\?si=\S+)?))/;

//     // Extract video ID from the URL using the regular expression
//     const match = youtubeUrl.match(regex);

//     if (match && (match[1] || match[2])) {
//         const videoId = match[1] || match[2];


//         return videoId;
//     } else {
//         // Invalid YouTube URL
//         console.error('Invalid YouTube URL');
//         return null;
//     }
// }

function getCurrentDate() {
    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const year = currentDate.getFullYear().toString();
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


function encodeTitle(title) {
    return removeSpecialCharsExceptKeys(title.trim(), [' ', '-']).replaceAll(' ', '-').replace(/-+/g, '-').replaceAll('٪', '').replaceAll('؛', '').replaceAll('،', '').replaceAll('؟', '').toLowerCase()
}

function removeSpecialCharsExceptKeys(str, keys) {
    // Escape special characters in keys array to use in a regular expression
    const escapedKeys = keys.map(key => key.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));

    // Regular expression to match all non-alphanumeric characters except keys, Arabic characters, and Arabic punctuation marks
    const regex = new RegExp(`[^a-zA-Z0-9${escapedKeys.join('')}\\u0600-\\u06FF\\u0750-\\u077F\\u08A0-\\u08FF\\uFB50-\\uFDFF\\uFE70-\\uFEFF\\u060C\\u061B\\u061F\\u0640]`, 'g');

    return str.replace(regex, '');
}

function deQuote(text) {

    return text.replaceAll('"', '&quot;').replaceAll("'", "&#39;").replaceAll("`", "&#96;")
}

function removeLiveServerCode(htmlString) {
    const pattern = /<!-- Code injected by live-server -->[\s\S]*?<\/script>/g;
    return htmlString.replace(pattern, '');
}

async function githubPush(payload) {

    var data = JSON.stringify({
        "message": "html file",
        "content": `${payload.content}`
    });

    var headers = {
        'Authorization': `Bearer ${payload.token}`,
        'Content-Type': 'application/json'
    };

    var url = `https://api.github.com/repos/mashoun/profile/contents/${payload.filename}`;

    var config = {
        method: 'PUT',
        headers: headers,
        body: data
    };

    var res = await fetch(url, config);
    return res
}

function text64(htmlString) {
    const encoder = new TextEncoder();
    const binaryData = encoder.encode(htmlString);
    const base64Data = btoa(String.fromCharCode(...new Uint8Array(binaryData.buffer)));
    return base64Data;
}

function focus(id) {
    document.getElementById(id).focus()
}


function isValidPayload(payload, keys = []) {
    for (let i = 0; i < keys.length; i++) {
        if (!payload[keys[i]] || payload[keys[i]] == "") return {
            status: false,
            message: keys[i] + ' is missing!'
        }
    }
    return {
        status: true,
        message: 'Valid payload'
    }
}

function removeEmptyProperties(obj) {
    return Object.fromEntries(
        Object.entries(obj).filter(([key, value]) => value !== null && value !== '')
    );
}
function extractArticle(htmlString) {
    const soup = new DOMParser().parseFromString(htmlString, "text/html");
    const article = soup.querySelector("article");

    if (article) {
        const firstDiv = article.querySelector("div");
        return firstDiv ? firstDiv.innerHTML : null;
    }

    return null;
}


function fixClosingTags(htmlString) {
    const regex = /<\/\s*(\w+)\s*>/g;
    return htmlString.replace(regex, "</$1>");
}



export default {
    fixClosingTags,
    extractArticle,
    removeEmptyProperties,
    isValidPayload,
    githubPush,
    focus,
    deQuote,
    text64,
    removeLiveServerCode,
    encodeTitle,
    getCurrentDate,
    getPage,
    getYouTubeThumbnail,
    getYouTubeId,
    openFiles,
    file64,
    optimizeImageQuality,
    timo,
    shareBy
}