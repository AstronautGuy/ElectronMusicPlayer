// ytmusic.js
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { headers } = require("./authHeaders");

async function getLibraryPlaylists() {
    const res = await fetch("https://music.youtube.com/youtubei/v1/browse?alt=json&prettyPrint=false", {
        method: "POST",
        headers: {
            ...headers,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            context: {
                client: {
                    clientName: "WEB_REMIX",
                    clientVersion: "1.20210912.07.00"
                }
            },
            browseId: "FEmusic_liked_playlists"
        })
    });

    const data = await res.json();

    // Navigate and extract playlists
    const contents = data.contents?.singleColumnBrowseResultsRenderer?.tabs?.[0]?.tabRenderer?.content
        ?.sectionListRenderer?.contents?.[0]?.musicShelfRenderer?.contents;

    if (!contents) {
        return { error: true, message: "No playlists found" };
    }

    const playlists = contents.map(item => {
        const playlist = item.musicResponsiveListItemRenderer;
        const title = playlist?.flexColumns?.[0]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs?.[0]?.text;
        const playlistId = playlist?.navigationEndpoint?.browseEndpoint?.browseId;
        return { title, playlistId };
    });

    return playlists;
}

module.exports = {
    getLibraryPlaylists
};
