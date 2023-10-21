const path = require('path');
const { app, BrowserWindow } = require('electron');

// the below one is used to check if the app is in production or development
const isMac = process.platform === 'darwin';

// the below one is used to create a window
function createMainWindow() {
    const mainWindow = new BrowserWindow({
        title: 'SnapScale',
        width: 500,
        height: 600,
    })

    // The below one can be used to load a file it can also load a url if we use loadurl() e.x :- twitter.com
    mainWindow.loadFile(path.join(__dirname, 'renderer/index.html'));
}

// the below one is used to create a window when the app is ready
// app.on('ready', createMainWindow);

// or you can use the below one to create a window when the app is ready it returns a promise
app.whenReady().then(() => {
    createMainWindow();
});

// the below one is used to quit the app when all the windows are closed except on mac as mac works differently
app.on('window-all-closed', () => {
    if (!isMac) {
        app.quit();
    }
});