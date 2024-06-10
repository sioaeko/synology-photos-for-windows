# Synology Photos Electron

This project creates a simple Electron-based application to run Synology Photos as a Windows program. The app includes features for auto-login and saving window size and position.

## Features

- **Auto-login**: Automatically log in to Synology Photos.
- **Window Size & Position Saving**: Saves and restores the window size and position between sessions.

## Prerequisites

- [Node.js](https://nodejs.org/) (which includes npm)

## Getting Started

1. **Clone the repository**:

    ```bash
    git clone https://github.com/your-username/synology-photos-electron.git
    cd synology-photos-electron
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Set your Synology Photos login details**:
   
   Open `main.js` and set your Synology Photos URL, username, and password:

    ```javascript
    const loginURL = 'http://<YOUR_SYNOLOGY_PHOTOS_URL>/#login';
    const username = 'your_username';
    const password = 'your_password';
    ```

4. **Run the app**:

    ```bash
    npm start
    ```

## Project Structure

- `main.js`: Main process script that initializes the Electron app.
- `preload.js`: Preload script to expose APIs for saving window settings.
- `index.html`: Blank HTML file as the Electron entry point.

## main.js

```javascript
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

    const loginURL = 'http://<YOUR_SYNOLOGY_PHOTOS_URL>/#login';
    const username = 'your_username';
    const password = 'your_password';

    mainWindow.loadURL(`${loginURL}?username=${username}&password=${password}`);

    // Save window size and position
    mainWindow.on('resize', saveWindowSettings);
    mainWindow.on('move', saveWindowSettings);

    // Handle window close
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
```

## preload.js
```
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    getWindowSettings: () => {
        return JSON.parse(localStorage.getItem('windowSettings'));
    },
    saveWindowSettings: (settings) => {
        localStorage.setItem('windowSettings', JSON.stringify(settings));
    }
});
```
## Contributing

Feel free to submit issues and pull requests. Contributions are always welcome!

## License

This project is licensed under the MIT License - see the LICENSE file for details.
