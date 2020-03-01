const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

/*UNCOMMENT TO SET ENV TO PRODUCTION 
process.env.NODE_ENV = 'production';
*/

let mainWin;
let addWindow;

// Listen for app to be ready
app.on('ready', () => {
    mainWin = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWin.loadFile('index.html');
    /*
    mainWin.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));
    */

    // Quit app when main closes
    mainWin.on('closed', () => {
        app.quit();
    });

    const mainMenu = Menu.buildFromTemplate(mainTemplate);
    //win.webContents.openDevTools();
    Menu.setApplicationMenu(mainMenu);
});

// Handle add window 
function createAddWindow(){
    // Create new window
    addWindow = new BrowserWindow({
        width: 300,
        height: 300,
        title: 'Add item',
        webPreferences: {
            nodeIntegration: true
        }
    });
    
    addWindow.loadFile('addWindow.html');
    /*
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    */

    // Handle Garbage Collection
    addWindow.on('close', () => {
        addWindow = null;
    });
}

// Catch item: add
ipcMain.on('item:add', (e, item) => {
    mainWin.webContents.send('item:add', item);
    addWindow.close();
});

const mainTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Add Item',
                click() {
                    createAddWindow();
                }
            },
            {
                label: 'Clear Items',
                click() {
                    mainWin.webContents.send('item:clear', item);
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 
                'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    }
];
// if mac empty object to menu
if(process.platform == "darwin"){
    mainTemplate.unshift();
}

// Add dev tool if not in production
if(process.env.NODE_ENV !== 'production') {
    mainTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    });
}
   