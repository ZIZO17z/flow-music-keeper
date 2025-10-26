const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const cors = require("cors");
const mm = require("music-metadata");

const app = express();
const port = process.env.PORT || 3000;

const musicDir = process.argv[2];

if (!musicDir) {
  console.error("No music directory provided to server.");
}

app.use(cors());

if (musicDir) {
  app.use("/music", express.static(musicDir));
}

app.get("/music-list", async (req, res) => {
  if (!musicDir) {
    return res
      .status(500)
      .json({ error: "Music directory not configured in VS Code settings." });
  }

  try {
    const files = await fs.readdir(musicDir);
    const supported = files.filter((f) => f.match(/\.(mp3|ogg|wav|m4a)$/i));

    const list = await Promise.all(
      supported.map(async (filename) => {
        const filePath = path.join(musicDir, filename);
        try {
          const metadata = await mm.parseFile(filePath);
          const { title, artist, album, duration } = metadata.common;

          const picture = metadata.common.picture?.[0];
          let cover = null;
          if (picture) {
            cover = `data:${picture.format};base64,${picture.data.toString("base64")}`;
          }

          return {
            name: title || path.parse(filename).name,
            artist: artist || "Unknown Artist",
            album: album || "Unknown Album",
            duration: duration ? formatDuration(duration) : "0:00",
            file: "/music/" + encodeURIComponent(filename),
            cover: cover,
          };
        } catch (err) {
          return {
            name: path.parse(filename).name,
            artist: "Unknown Artist",
            album: "Unknown Album",
            duration: "0:00",
            file: "/music/" + encodeURIComponent(filename),
            cover: null,
          };
        }
      })
    );

    res.json({ tracks: list });
  } catch (err) {
    console.error("❌ Error reading music directory:", err);
    return res
      .status(500)
      .json({ error: "Failed to read music folder. Check path." });
  }
});

function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

app.listen(port, () => {
  console.log(`Local Music Player running on http://127.0.0.1:${port}`);
  if (musicDir) {
    console.log(`Serving music from: ${musicDir}`);
  }
});
