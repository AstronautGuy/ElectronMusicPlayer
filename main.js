const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { execFile } = require("child_process");
const os = require("os");
const fs = require("fs");

const { getLibraryPlaylists } = require("./ytmusic"); // only imported once!

// 🧠 Fetch playlists from YT Music
ipcMain.handle("get-playlists", async () => {
    try {
        const data = await getLibraryPlaylists();
        return data;
    } catch (err) {
        console.error("YT Music error:", err);
        return { error: true, message: err.message };
    }
});

// 🎧 Stream audio using yt-dlp
ipcMain.handle("stream-audio", async (event, videoURL) => {
    return new Promise((resolve, reject) => {
        const outputPath = path.join(os.tmpdir(), "track.webm");

        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);

        execFile("yt-dlp", [
            "-f", "bestaudio",
            "-o", outputPath,
            videoURL
        ], (error, stdout, stderr) => {
            if (error) {
                console.error("yt-dlp error:", stderr);
                return reject(error);
            }
            resolve(outputPath);
        });
    });
});

// 🪟 Create the window
function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false
        },
    });

    win.loadFile("index.html");
}

// 🚀 Start the app
app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});
