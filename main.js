const { app, BrowserWindow, session } = require('electron');
const path = require('path');

let mainWindow;

function createWindow () {
    let windowSettings = getWindowSettings();

    mainWindow = new BrowserWindow({
        width: windowSettings.width || 800,
        height: windowSettings.height || 600,
        x: windowSettings.x,
        y: windowSettings.y,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    const loginURL = 'http://<YOUR_SYNOLOGY_PHOTOS_URL>/#login'; // Synology Photos 로그인 URL
    const username = 'your_username'; // Synology 사용자 이름
    const password = 'your_password'; // Synology 비밀번호

    mainWindow.loadURL(`${loginURL}?username=${username}&password=${password}`);

    // 창 크기 및 위치 저장
    mainWindow.on('resize', saveWindowSettings);
    mainWindow.on('move', saveWindowSettings);

    // 창 닫기 이벤트
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

function saveWindowSettings() {
    if (!mainWindow) return;

    let windowBounds = mainWindow.getBounds();
    let windowSettings = {
        width: windowBounds.width,
        height: windowBounds.height,
        x: windowBounds.x,
        y: windowBounds.y
    };

    mainWindow.webContents.executeJavaScript(`electron.saveWindowSettings(${JSON.stringify(windowSettings)});`);
}

function getWindowSettings() {
    return mainWindow.webContents.executeJavaScript('electron.getWindowSettings();');
}
