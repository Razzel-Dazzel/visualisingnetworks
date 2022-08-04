const { app, BrowserWindow} = require('electron');
const path = require('path');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 900,
        height: 900,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    })

    win.loadFile("index.html")
};

app.whenReady().then(() => {
    createWindow()
});

app.on('window-all-closed', () => {
    if (mainWindow.platform !== 'darwin') app.quit();
});