const express = require('express');
const multer = require('multer');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const upload = multer({ dest: 'uploads/' });

// Serve static files from the 'public' directory
// Static files are moved into the docker container when building
app.use(express.static(path.join(__dirname, 'public')));
// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create SQLite database
// inside the docker container /app/files points to the outer ./files.db in 
// development, /var/www/<something>/files.db in prod.
const db = new sqlite3.Database('./files.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the files database.');
});

// Create files table with category column
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        path TEXT NOT NULL,
        category TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/upload', upload.single('file'), (req, res) => {
    const { originalname, path: filePath } = req.file;
    const category = req.body.category; // Assuming category are sent in the request body

    db.run('INSERT INTO files (name, path, category) VALUES (?, ?, ?)', [originalname, filePath, category], function(err) {
        if (err) {
            return console.log(err.message);
        }
        console.log(`A row has been inserted with rowid ${this.lastID}`);
        res.send('File uploaded successfully');
    });
});

app.get('/files', (req, res) => {
    db.all('SELECT * FROM files', [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.json(rows);
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
