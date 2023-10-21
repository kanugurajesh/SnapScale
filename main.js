const path = require('path');
const os = require('os');
const fs = require('fs');
const { app, BrowserWindow, Menu, ipcMain, shell } = require('electron');
const ResizeImg = require('resize-img');

// the below one is used to check if the app is in production or development
const isMac = process.platform === 'darwin';
const isDev = process.env.NODE_ENV !== 'production';

// the below one is used to check if the app is in production or development
let mainWindow;

// the below one is used to create a window
function createMainWindow() {
    mainWindow = new BrowserWindow({
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

// the below one is used to create a about window
function createAboutWindow() {
    const aboutWindow = new BrowserWindow({
        title: 'About SnapScale',
        width: 300,
        height: 300,
    })

    aboutWindow.loadFile(path.join(__dirname, 'renderer/about.html'));
}

// the below one is used to create a menu
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

    Menu.setApplicationMenu(mainMenu);

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        }
    });

    // Remove mainwindow from memory when closed
    if (BrowserWindow.getAllWindows().length === 0) {
        mainWindow = null;
    }

});

//  Respond to ipcRenderer resize
ipcMain.on('image:resize', (e, options) => {
    options.dest = path.join(os.homedir(), 'SnapScaleImages');
    console.log(options)
    resizeImage(options);
});

// the below one is used to resize the image
async function resizeImage({ imgPath, width, height, dest }) {
    try {
        const newPath = await ResizeImg(fs.readFileSync(imgPath), {
            width: parseInt(width),
            height: parseInt(height),
        });

        // Creating filename
        const filename = path.basename(imgPath);

        // Creating destination folder if it does not exists
        if(!fs.existsSync(dest)) {
            fs.mkdirSync(dest);
        }

        // witing file to destination folder
        fs.writeFileSync(path.join(dest, filename), newPath);

        // Sending success message to renderer
        mainWindow.webContents.send('image:done', 'Image resized successfully');

        // Open dest folder
        shell.openPath(dest);

    } catch (error) {
        console.log(error)
    }
}

// the below one is used to quit the app when all the windows are closed except on mac as mac works differently
app.on('window-all-closed', () => {
    if (!isMac) {
        app.quit();
    }
});