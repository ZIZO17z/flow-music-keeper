import * as vscode from 'vscode';

export class CustomSidebarViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'vscodeSidebar.sidebarView';

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlContent(webviewView.webview);
  }

  private _getHtmlContent(webview: vscode.Webview) {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'assets', 'app.js')
    );
    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'assets', 'main.css')
    );
    const codiconsUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this._extensionUri,
        'node_modules',
        '@vscode/codicons',
        'dist',
        'codicon.css'
      )
    );

    const nonce = getNonce();

    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}'; img-src ${webview.cspSource} data:; connect-src http://127.0.0.1:3000;">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleUri}" rel="stylesheet">
        <link href="${codiconsUri}" rel="stylesheet" />
				<title>My Local Music Player</title>
			</head>
			<body>
        <svg width="0" height="0" style="position:absolute">
          <defs>
            <symbol id="icon-play" viewBox="0 0 16 16">
              <path d="M 3 2 L 3 14 L 13 8 Z"></path>
            </symbol>
            
            <symbol id="icon-pause" viewBox="0 0 16 16">
              <path d="M 3 2 L 6 2 L 6 14 L 3 14 Z M 10 2 L 13 2 L 13 14 L 10 14 Z"></path>
            </symbol>
            
            <symbol id="icon-prev" viewBox="0 0 16 16">
              <path d="M 3 2 L 3 14 L 5 14 L 5 2 Z M 6 8 L 14 14 L 14 2 Z"></path>
            </symbol>
            
            <symbol id="icon-next" viewBox="0 0 16 16">
              <path d="M 13 2 L 13 14 L 11 14 L 11 2 Z M 10 8 L 2 14 L 2 2 Z"></path>
            </symbol>
            
            <symbol id="icon-shuffle" viewBox="0 0 16 16">
              <path d="M 1 4 L 4 1 L 4 3 L 5 3 C 7 3 9 5 9 7 C 9 9 7 11 5 11 L 4 11 L 4 13 L 1 10 L 1 4 Z M 11 5 L 12 5 C 14 5 16 7 16 9 C 16 11 14 13 12 13 L 11 13 L 11 15 L 15 12 L 15 8 L 11 5 Z M 4 5 L 5 5 C 6.1 5 7 5.9 7 7 C 7 8.1 6.1 9 5 9 L 4 9 L 4 5 Z"></path>
            </symbol>
            
            <symbol id="icon-repeat" viewBox="0 0 16 16">
              <path d="M 1 6 L 1 2 L 3 2 L 3 5 C 5 3 8 3 10 5 L 11 3 L 14 6 L 11 9 L 10 7 C 8 5 5 5 3 7 L 3 10 L 1 10 L 1 6 Z M 15 10 L 15 14 L 13 14 L 13 11 C 11 13 8 13 6 11 L 5 13 L 2 10 L 5 7 L 6 9 C 8 11 11 11 13 9 L 13 6 L 15 6 L 15 10 Z"></path>
            </symbol>

            <symbol id="icon-volume" viewBox="0 0 16 16"><path d="M 1 6 L 1 10 L 4 10 L 8 14 L 8 2 L 4 6 Z M 10 4 C 11.1 5.1 11.1 6.9 10 8 M 11 2 C 13.2 4.2 13.2 7.8 11 10"></path></symbol>
          </defs>
        </svg>

        <div class="player-container">
          <div id="loading" class="loading-spinner"></div>
          <div id="error-message" class="error-message"></div>

          <div class="current-track-info">
            <img id="track-cover" src="" alt="Album Cover" class="album-cover hidden">
            <div class="text-info">
              <div id="track-title" class="track-title"></div>
              <div id="track-artist" class="track-artist"></div>
            </div>
          </div>

          <div class="controls">
            <button id="shuffle-btn" class="control-btn" title="Shuffle">
              <svg><use href="#icon-shuffle"></use></svg>
            </button>
            <button id="prev-btn" class="control-btn" title="Previous Track">
              <svg><use href="#icon-prev"></use></svg>
            </button>
            <button id="play-pause-btn" class="control-btn play-pause-btn" title="Play/Pause">
              <svg class="icon-play-pause"><use href="#icon-play"></use></svg>
            </button>
            <button id="next-btn" class="control-btn" title="Next Track">
              <svg><use href="#icon-next"></use></svg>
            </button>
            <button id="repeat-btn" class="control-btn" title="Repeat">
              <svg><use href="#icon-repeat"></use></svg>
            </button>
          </div>

          <div class="progress-bar-container">
            <span id="current-time" class="time">0:00</span>
            <input type="range" id="progress-bar" value="0" min="0" max="100">
            <span id="duration" class="time">0:00</span>
          </div>

          <div class="volume-container">
            <button id="volume-btn" class="control-btn volume-btn" title="Mute/Unmute">
              <svg><use href="#icon-volume"></use></svg>
            </button>
            <input type="range" id="volume-bar" min="0" max="100" value="75">
          </div>
        </div>

        <div class="track-list-container">
          <input type="text" id="search-input" placeholder="Search tracks..." class="search-input">
          <ul id="track-list" class="track-list">
            </ul>
        </div>
        
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
  }
}

function getNonce() {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}