'use strict';

const electron = require('electron');
const {app, BrowserWindow, Menu, ipcMain, ipcRenderer,protocol} = electron;
var path = require('path');
var url = require('url');


let isDevelopment = true;

if (isDevelopment) {
    require('electron-reload')(__dirname, {
        ignored: /node_modules|[\/\\]\./
    });
}


var mainWnd = null;

function openMainWnd(uri) {
    mainWnd = new BrowserWindow({
        width: 800,
        height: 600,

    });

    if (isDevelopment) {
        mainWnd.webContents.openDevTools();
    }

    mainWnd.loadURL(`file://${__dirname}/index.html`);

    mainWnd.on('closed', () => {
       mainWnd = null;
    });
}


app.on('ready', openMainWnd);

app.on('window-all-closed', () => {
    app.quit();
});