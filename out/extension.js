"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const customSidebarViewProvider_1 = require("./customSidebarViewProvider");
const child_process_1 = require("child_process");
const path = require("path");
let serverProcess;
function activate(context) {
    console.log('Flow Keeper Music Player is now active');
    const musicDir = vscode.workspace
        .getConfiguration('myMusicPlayer')
        .get('musicDirectory');
    if (!musicDir) {
        vscode.window.showWarningMessage('Flow Keeper: Please set your music directory in the settings.');
        return;
    }
    const serverPath = path.join(context.extensionPath, "out", "server", "server.js"); // Corrected path to point to 'out' directory
    serverProcess = (0, child_process_1.fork)(serverPath, [musicDir]);
    serverProcess.stdout?.on('data', (data) => {
        console.log(`[Server]: ${data.toString()}`);
    });
    serverProcess.stderr?.on('data', (data) => {
        console.error(`[Server ERROR]: ${data.toString()}`);
    });
    const provider = new customSidebarViewProvider_1.CustomSidebarViewProvider(context.extensionUri);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(customSidebarViewProvider_1.CustomSidebarViewProvider.viewType, provider, {
        webviewOptions: { retainContextWhenHidden: true }
    }));
    context.subscriptions.push(vscode.commands.registerCommand("vscodeSidebar.menu.view", () => {
        vscode.window.showInformationMessage('To change your music folder, please update the "My Local Music Player: Music Directory" setting in VS Code preferences.');
    }));
}
exports.activate = activate;
function deactivate() {
    if (serverProcess) {
        console.log('Shutting down music server...');
        serverProcess.kill();
    }
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map