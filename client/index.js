'use strict';

const electron = require('electron');
const {app, BrowserWindow, Menu, ipcMain, ipcRenderer} = electron;
var path = require('path');
var url = require('url');

//change the value to false when package,true to develope 
let isDevelopment = true;
//comment out the if steament to package"


if (isDevelopment) {
    require('electron-reload')(__dirname, {
        ignored: /node_modules|[\/\\]\./
    });
}

global.sharedObject = {
  token: 'empty'
}

var mainWnd = null;

function openMainWnd(uri) {
    mainWnd = new BrowserWindow({
        minHeight: 675,
        minWidth: 400,
        width: 1295,
        height: 675,
        titleBarStyle: 'hidden'
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