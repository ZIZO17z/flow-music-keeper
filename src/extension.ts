import * as vscode from 'vscode';
import { CustomSidebarViewProvider } from './customSidebarViewProvider';
import { fork, ChildProcess } from 'child_process';
import * as path from 'path';

let serverProcess: ChildProcess;

export function activate(context: vscode.ExtensionContext) {
  console.log('Flow Keeper Music Player is now active');

  const musicDir = vscode.workspace
    .getConfiguration('myMusicPlayer')
    .get('musicDirectory');

  if (!musicDir) {
    vscode.window.showWarningMessage(
      'Flow Keeper: Please set your music directory in the settings.'
    );
    return; 
  }

  const serverPath = path.join(context.extensionPath, "server", "server.js");
  serverProcess = fork(serverPath, [musicDir as string]);

  serverProcess.stdout?.on('data', (data) => {
    console.log(`[Server]: ${data.toString()}`);
  });
  serverProcess.stderr?.on('data', (data) => {
    console.error(`[Server ERROR]: ${data.toString()}`);
  });

  const provider = new CustomSidebarViewProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      CustomSidebarViewProvider.viewType,
      provider
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("vscodeSidebar.menu.view", () => {
      vscode.window.showInformationMessage(
        'To change your music folder, please update the "My Local Music Player: Music Directory" setting in VS Code preferences.'
      );
    })
  );
}
export function deactivate() {
  if (serverProcess) {
    console.log('Shutting down music server...');
    serverProcess.kill();
  }
}