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

    // Quit app when main closes
    mainWin.on('closed', () => {
        app.quit();
    });

    const mainMenu = Menu.buildFromTemplate(mainTemplate);

    Menu.setApplicationMenu(mainMenu);
});

const mainTemplate = [
    {
        label: 'File',
        submenu: [
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
   