const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route to get albums
app.get('/AudioFiles', (req, res) => {
    const albumsDir = path.join(__dirname, 'public', 'AudioFiles');
    fs.readdir(albumsDir, (err, files) => {
        if (err) {
            console.error('Error reading AudioFiles directory:', err);
            return res.status(500).json({ error: 'Failed to load albums' });
        }

        // Filter only directories (albums)
        const albums = files.filter(file => {
            return fs.statSync(path.join(albumsDir, file)).isDirectory();
        });

        res.json(albums);
    });
});

// Route to get audio files from a specific album
app.get('/AudioFiles/:album', (req, res) => {
    const albumName = req.params.album;
    const albumDir = path.join(__dirname, 'public', 'AudioFiles', albumName);

    fs.readdir(albumDir, (err, files) => {
        if (err) {
            console.error('Error reading album directory:', err);
            return res.status(500).json({ error: 'Failed to load album' });
        }

        const audioFiles = files.filter(file => file.endsWith('.mp3'));
        res.json(audioFiles);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
