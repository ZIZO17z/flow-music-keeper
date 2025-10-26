"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomSidebarViewProvider = void 0;
const vscode = require("vscode");
class CustomSidebarViewProvider {
    constructor(_extensionUri) {
        this._extensionUri = _extensionUri;
    }
    resolveWebviewView(webviewView, context, token) {
        this._view = webviewView;
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.joinPath(this._extensionUri, "out")],
        };
        webviewView.webview.html = this.getHtmlContent(webviewView.webview);
    }
    getHtmlContent(webview) {
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "out", "assets", "app.js"));
        const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "out", "assets", "main.css"));
        const nonce = getNonce();
        const serverUrl = "http://127.0.0.1:3000";
        return `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="Content-Security-Policy" content="
          default-src 'none'; 
          style-src ${webview.cspSource}; 
          script-src 'nonce-${nonce}'; 
          connect-src ${serverUrl}; 
          media-src ${serverUrl};
          img-src ${webview.cspSource} data:;
        ">
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>My Local Music Player</title>
        <link href="${styleUri}" rel="stylesheet">
      </head>

      <body>
        <svg width="0" height="0" style="position:absolute">
          <defs>
            <symbol id="icon-play" viewBox="0 0 16 16"><path d="M 3 2 L 3 14 L 13 8 Z"></path></symbol>
            <symbol id="icon-pause" viewBox="0 0 16 16"><path d="M 3 2 L 6 2 L 6 14 L 3 14 Z M 10 2 L 13 2 L 13 14 L 10 14 Z"></path></symbol>
            <symbol id="icon-prev" viewBox="0 0 16 16"><path d="M 3 2 L 3 14 L 5 14 L 5 2 Z M 6 8 L 14 14 L 14 2 Z"></path></symbol>
            <symbol id="icon-next" viewBox="0 0 16 16"><path d="M 13 2 L 13 14 L 11 14 L 11 2 Z M 10 8 L 2 14 L 2 2 Z"></path></symbol>
            <symbol id="icon-shuffle" viewBox="0 0 16 16"><path d="M 1 4 L 4 1 L 4 3 L 5 3 C 7 3 9 5 9 7 C 9 9 7 11 5 11 L 4 11 L 4 13 L 1 10 L 1 4 Z M 11 5 L 12 5 C 14 5 16 7 16 9 C 16 11 14 13 12 13 L 11 13 L 11 15 L 15 12 L 15 8 L 11 5 Z M 4 5 L 5 5 C 6.1 5 7 5.9 7 7 C 7 8.1 6.1 9 5 9 L 4 9 L 4 5 Z"></path></symbol>
            <symbol id="icon-repeat" viewBox="0 0 16 16"><path d="M 1 6 L 1 2 L 3 2 L 3 5 C 5 3 8 3 10 5 L 11 3 L 14 6 L 11 9 L 10 7 C 8 5 5 5 3 7 L 3 10 L 1 10 L 1 6 Z M 15 10 L 15 14 L 13 14 L 13 11 C 11 13 8 13 6 11 L 5 13 L 2 10 L 5 7 L 6 9 C 8 11 11 11 13 9 L 13 6 L 15 6 L 15 10 Z"></path></symbol>
            <symbol id="icon-volume" viewBox="0 0 16 16"><path d="M 1 6 L 1 10 L 4 10 L 8 14 L 8 2 L 4 6 Z M 10 4 C 11.1 5.1 11.1 6.9 10 8 M 11 2 C 13.2 4.2 13.2 7.8 11 10"></path></symbol>
          </defs>
        </svg>
      
        <h1>🎶 My Local Music Player</h1>

        <div id="tracks" class="track-list">
          <p class="loader">Loading music...</p>
        </div>

        <div class="player-bar">
          <div class="player-info">
            <img id="player-album-art" src="" alt="Album Art">
            <div class="player-info-text">
              <span id="player-track-name" class="player-info-name">Select a song</span>
              <span id="player-track-artist" class="player-info-artist"></span>
            </div>
          </div>

          <div class="player-controls">
            <button id="shuffle-btn" class="control-btn" title="Shuffle"><svg><use href="#icon-shuffle"></use></svg></button>
            <button id="prev-btn" class="control-btn" title="Previous"><svg><use href="#icon-prev"></use></svg></button>
            <button id="play-pause-btn" class="control-btn" title="Play/Pause"><svg><use href="#icon-play"></use></svg></button>
            <button id="next-btn" class="control-btn" title="Next"><svg><use href="#icon-next"></use></svg></button>
            <button id="repeat-btn" class="control-btn" title="Repeat"><svg><use href="#icon-repeat"></use></svg></button>
          </div>

          <div class="progress-bar-container">
            <span id="current-time">0:00</span>
            <input type="range" id="progress-bar" value="0" min="0" max="100" step="0.1">
            <span id="total-duration">0:00</span>
          </div>
          
          <div class="volume-container">
            <svg><use href="#icon-volume"></use></svg>
            <input type="range" id="volume-slider" value="100" min="0" max="100">
          </div>
        </div>

        <script nonce="${nonce}" src="${scriptUri}"></script>
      </body>
      </html>`;
    }
}
exports.CustomSidebarViewProvider = CustomSidebarViewProvider;
CustomSidebarViewProvider.viewType = "vscodeSidebar.openview";
function getNonce() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length: 32 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}
//# sourceMappingURL=customSidebarViewProvider.js.map