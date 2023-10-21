const path = require('path');
const { app, BrowserWindow, Menu } = require('electron');

// the below one is used to check if the app is in production or development
const isMac = process.platform === 'darwin';
const isDev = process.env.NODE_ENV !== 'production';

// the below one is used to create a window
function createMainWindow() {
    const mainWindow = new BrowserWindow({
        title: 'SnapScale',
        width: isDev ? 1000 : 500,
        height: 600,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js'),
        }
    })

    // Open devtools if in dev environment0
    if (isDev) {
        mainWindow.webContents.openDevTools();
    }

    // The below one can be used to load a file it can also load a url if we use loadurl() e.x :- twitter.com
    mainWindow.loadFile(path.join(__dirname, 'renderer/index.html'));
}

function createAboutWindow() {
    const aboutWindow = new BrowserWindow({
        title: 'About SnapScale',
        width: 300,
        height: 300,
    })

    aboutWindow.loadFile(path.join(__dirname, 'renderer/about.html'));
}

const menu = [
    ...(isMac ? [{ 
        label: app.name,
        submenu: [
            {
                label: 'About',
                click: createAboutWindow
            }
        ]
     }] : []),
    {
        label: 'fileName'
    },
    ...(!isMac ? [
        {
            label: 'Help',
            submenu: [
                {
                    label: 'About',
                    click: createAboutWindow
                }
            ]
        }
    ] : [
    ])
]


// the below one is used to create a window when the app is ready
// app.on('ready', createMainWindow);

// or you can use the below one to create a window when the app is ready it returns a promise
app.whenReady().then(() => {
    createMainWindow();

    const mainMenu = Menu.buildFromTemplate(menu);

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        }
    });

});

// the below one is used to quit the app when all the windows are closed except on mac as mac works differently
app.on('window-all-closed', () => {
    if (!isMac) {
        app.quit();
    }
});