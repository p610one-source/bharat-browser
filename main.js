
const { app, BrowserWindow, session } = require("electron");

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: "#10141c",
    title: "Bharat Browser",
    webPreferences: {
      preload: require("path").join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webviewTag: true
    }
  });

  win.loadFile("index.html");

  win.webContents.setWindowOpenHandler(({ url }) => {
    win.webContents.send("new-tab", url);
    return { action: "deny" };
  });
}

app.whenReady().then(() => {
  createWindow();

  session.defaultSession.on("will-download", (_event, item) => {
    const filename = item.getFilename();
    item.once("done", (_event, state) => {
      if (state === "completed") {
        BrowserWindow.getAllWindows()[0]?.webContents.send(
          "download-complete",
          filename
        );
      }
    });
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
