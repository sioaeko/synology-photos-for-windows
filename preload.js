const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    getWindowSettings: () => {
        return JSON.parse(localStorage.getItem('windowSettings'));
    },
    saveWindowSettings: (settings) => {
        localStorage.setItem('windowSettings', JSON.stringify(settings));
    }
});
