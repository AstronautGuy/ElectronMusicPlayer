const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("ytAPI", {
    getPlaylists: () => ipcRenderer.invoke("get-playlists"),
});
