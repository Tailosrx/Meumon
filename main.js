const { app, BrowserWindow, screen } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater'); // Importar autoUpdater

let mainWindow;

function createWindow() {
    const displays = screen.getAllDisplays();
    const externalDisplay = displays.find(display => display.bounds.x !== 0 || display.bounds.y !== 0);

    let windowOptions = {
        width: 800,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    };

    if (externalDisplay) {
        windowOptions.x = externalDisplay.bounds.x + 50;
        windowOptions.y = externalDisplay.bounds.y + 50;
    }

    mainWindow = new BrowserWindow(windowOptions);

    // Cargar tu archivo index.html (debe estar en el directorio adecuado)
    mainWindow.loadFile(path.join(__dirname, 'src/index.html'));

    autoUpdater.checkForUpdatesAndNotify(); // Verifica si hay una nueva versión

    // Abre las herramientas de desarrollo (opcional)
    mainWindow.webContents.openDevTools();

    // Cerrar la ventana cuando se cierre
    mainWindow.on('closed', () => {
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