'use strict';

const electron = require('electron');
const {app, BrowserWindow, Menu, ipcMain, ipcRenderer} = electron;
var path = require('path');
var url = require('url');
var iconPath = __dirname + '/view/img/Logo.ico';
//change the value to false when package,true to develope 
let isDevelopment = true;


if (isDevelopment) {
    require('electron-reload')(__dirname, {
        ignored: /node_modules|[\/\\]\./
    });

}

global.sharedObject = {
  token: 'empty'
}

global.mainWnd = null;



function openMainWnd(uri) {
    global.mainWnd = new BrowserWindow({
        minHeight: 477,
        minWidth: 276,
        width: 276,
        height: 477,
        frame: false,
        thickFrame: true,
        titleBarStyle: 'hidden',
        backgroundColor: '#0e1519',
        icon: iconPath,
        show: false
    });

    if (isDevelopment) {
        mainWnd.webContents.openDevTools();
        mainWnd.setContentSize(600, 477);
    }
    
    mainWnd.center();
    mainWnd.loadURL(`file://${__dirname}/index.html`);

    mainWnd.on('closed', () => {
       mainWnd = null;
    });

     mainWnd.once('ready-to-show', () => {
     mainWnd.show();
 })

}


app.on('ready', openMainWnd);

app.on('window-all-closed', () => {
    app.quit();
});