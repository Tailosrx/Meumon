const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 800,
        webPreferences: {
            nodeIntegration: true,  // Habilitar la integración con Node.js
            contextIsolation: false,  // Deshabilitar aislamiento para permitir el acceso
        },
    });

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

autoUpdater.on('update-available', () => {
    mainWindow.webContents.send('update-available');
});

autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('update-downloaded');
});

// Iniciar la ventana cuando Electron esté listo
app.whenReady().then(createWindow);

// Cerrar la aplicación cuando todas las ventanas se cierren
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Crear una ventana nueva si se activa la aplicación en macOS
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
