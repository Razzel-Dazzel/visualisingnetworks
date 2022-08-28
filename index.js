const { app, BrowserWindow} = require('electron');
const path = require('path');

let mainWindow;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 900,
        height: 900,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    })

    mainWindow.loadFile("index.html")
};

app.on('window-all-closed', () => {
    if (mainWindow.platform !== 'darwin') app.quit();
});

app.whenReady().then(() => {
    createWindow()
});

app.on('window-all-closed', () => {
    if (mainWindow.platform !== 'darwin') app.quit();
});