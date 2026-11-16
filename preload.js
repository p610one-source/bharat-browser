
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("bharat", {
  getVersion: () => "1.0.0",

  onNewTab: (callback) => {
    ipcRenderer.on("new-tab", (_event, url) => callback(url));
  },

  onDownload: (callback) => {
    ipcRenderer.on("download-complete", (_event, filename) => {
      callback(filename);
    });
  }
});
