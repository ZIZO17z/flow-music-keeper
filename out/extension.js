"use strict";
// src/extension.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const customSidebarViewProvider_1 = require("./customSidebarViewProvider");
const child_process_1 = require("child_process"); // ✅ Import child_process
const path = require("path"); // ✅ Import path
let serverProcess; // ✅ Store the server process
function activate(context) {
    console.log('Congratulations, "My Local Music Player" is active!');
    // ✅ --- Start the Server Process ---
    // 1. Get the music directory from settings
    const musicDir = vscode.workspace
        .getConfiguration('myMusicPlayer')
        .get('musicDirectory');
    // 2. Check if the setting is empty
    if (!musicDir) {
        vscode.window.showWarningMessage('My Local Music Player: Please set your music directory in the settings.');
        // You could choose to not start the server here
    }
    // 3. Get the path to our server.js file
    const serverPath = path.join(context.extensionPath, "server", "server.js");
    // 4. Fork the process, passing the musicDir as an argument
    serverProcess = (0, child_process_1.fork)(serverPath, [musicDir]);
    // 5. Log server output to the VS Code "Output" panel for debugging
    serverProcess.stdout?.on('data', (data) => {
        console.log(`[Server]: ${data.toString()}`);
    });
    serverProcess.stderr?.on('data', (data) => {
        console.error(`[Server ERROR]: ${data.toString()}`);
    });
    // ✅ --- End of Server Process Logic ---
    // Register the Sidebar Provider
    const provider = new customSidebarViewProvider_1.CustomSidebarViewProvider(context.extensionUri);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(customSidebarViewProvider_1.CustomSidebarViewProvider.viewType, provider));
    // Register the "How-to-Use" command
    context.subscriptions.push(vscode.commands.registerCommand("vscodeSidebar.menu.view", () => {
        vscode.window.showInformationMessage('To change your music folder, please update the "My Local Music Player: Music Directory" setting in VS Code preferences.');
    }));
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() {
    // ✅ Kill the server process when the extension is closed
    if (serverProcess) {
        console.log('Shutting down music server...');
        serverProcess.kill();
    }
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map