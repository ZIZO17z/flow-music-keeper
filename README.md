
"myMusicPlayer.musicDirectory": "choose whereever place in your pc you want"
after installing the .vsfx file you must go to your settings.json using ctrl+shift+p then choose settings.json after that add the line of code above 

Flow Keeper (My Local Music Player)
Flow Keeper is a Visual Studio Code extension that adds a music player directly into your sidebar. It's designed to help you stay in the "flow state" by playing music from your local computer without ever having to leave your editor.

The player runs a tiny, self-contained server in the background to serve your music files, so it's 100% local and requires no internet connection.

Features
🎶 Plays music (MP3, OGG, WAV, M4A) directly from a folder on your computer.

🖼️ Automatically fetches and displays embedded album art, track title, and artist.

▶️ Full playback controls: Play/Pause, Next Track, and Previous Track.

🔀 Standard audio features: Shuffle and Repeat.

🔊 Volume control and a seekable progress bar.

📄 Displays your full music library in a scrollable list.

How to Use (Quick Start)
To use the player, you just need to tell it where your music is.

Install the Extension: (Assuming it's installed from the VS Code Marketplace or a .vsix file).

Open Settings: Go to File > Preferences > Settings (or press Ctrl + ,).

Find the Setting: In the settings search bar, type in myMusicPlayer.musicDirectory.

Set Your Music Path: You will see a setting named "My Local Music Player: Music Directory". In the textbox, enter the absolute path to your music folder.

Examples:

Windows: C:\Users\YourName\Music

macOS / Linux: /home/YourName/Music

Reload VS Code: Open the Command Palette (Ctrl+Shift+P) and run the "Developer: Reload Window" command.

Open the Player: Click on the "Flow Keeper" icon in the Activity Bar (the sidebar on the left). Your music library will load, and you can start playing!

For Developers: Building from Source
If you want to modify or contribute to the extension, here is how to build and run it locally.

Prerequisites
Node.js (which includes npm)

Visual Studio Code

1. Installation
First, clone the repository and install all the required npm packages.

Bash

# Clone the project
git clone https://github.com/zizo17z/flow-keeper.git

# Navigate into the project directory
cd flow-keeper

# Install all dependencies (like Express, music-metadata, etc.)
npm install
2. Compiling the Code
This extension uses TypeScript for the main extension logic and plain JavaScript for the server and webview. You must compile the TypeScript to JavaScript before running.

The compile script in package.json handles this and copies all the necessary assets (server.js, app.js, main.css) into the final out build directory.

Bash

# Run the build script
npm run compile
3. Running the Extension
The easiest way to test the extension is by using VS Code's built-in "Run and Debug" feature.

After running npm run compile, open the project folder in VS Code.

Go to the Run and Debug view (the play icon with a bug in the Activity Bar, or press Ctrl+Shift+D).

A "Run Extension" configuration should be visible at the top. Click the green Play button next to it (or just press F5).

This will compile your code and launch a new "Extension Development Host" window.

In this new window, follow the "How to Use" steps above to set your music directory and test the player.

Project Architecture
This project is a VS Code extension that works by running a small, local client-server architecture.

src/extension.ts: (TypeScript) This is the main entry point for the extension. When VS Code activates it, it reads the myMusicPlayer.musicDirectory setting and uses child_process.fork to start the Node.js server. It automatically kills the server when VS Code is closed.

server/server.js: (JavaScript) An Express.js server that runs on http://127.0.0.1:3000. It receives the music path from extension.ts and creates two endpoints:

/music: Serves the static audio files from your folder.

/music-list: Scans your folder, uses music-metadata to read ID3 tags (artist, title, cover art), and sends a JSON list of all tracks to the player.

src/customSidebarViewProvider.ts: (TypeScript) This file tells VS Code how to create the webview (the player UI) in the sidebar.

assets/app.js: (JavaScript) This is the frontend for the music player. It runs inside the webview, fetches the track list from server.js, and handles all the logic for play, pause, shuffle, etc., by controlling an HTML5 <audio> element.

assets/main.css: The stylesheet that makes the player look clean and integrate with VS Code's theme.
