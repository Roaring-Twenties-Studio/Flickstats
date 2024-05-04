import { app, BrowserWindow, nativeTheme, shell } from "electron";
import path from "path";

nativeTheme.themeSource = "dark";
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

if (process.env.NODE_ENV === "development") {
  app?.dock?.setIcon(path.join(process.cwd(), "icon", "icon.png"));
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app?.quit();
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    backgroundColor: "#202124",
    icon: path.join(process.cwd(), "icon", "icon.icns"),
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY).then(() => {
    splash.close();
    mainWindow.center();
    mainWindow.show();
  });

  // allow to open external link from the app
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  // display splash screen
  const splash = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: "#202124",
    transparent: true,
    alwaysOnTop: true,
  });
  splash.loadFile("./src/splash-screen/index.html");
  splash.center();

  // Open the DevTools.
  if (process.env.NODE_ENV === "development") {
    mainWindow.webContents.openDevTools();
  }
};

app?.on("ready", createWindow);

app?.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app?.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
