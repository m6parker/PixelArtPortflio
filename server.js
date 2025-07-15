
const express = require('express');
const multer = require('multer');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const upload = multer({ dest: 'uploads/' });

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create SQLite database
const db = new sqlite3.Database('./files.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the files database.');
});

// Create files table
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        path TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/upload', upload.single('file'), (req, res) => {
    const { originalname, path: filePath } = req.file;

    db.run('INSERT INTO files (name, path) VALUES (?, ?)', [originalname, filePath], function(err) {
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

//delete
// app.delete('/delete', delete('file'), (req, res) => {
//     const { originalname, path: filePath } = req.file;

//     db.run('DELETE from files (name, path) VALUES (?, ?)', [originalname, filePath], function(err) {
//         if (err) {
//             return console.log(err.message);
//         }
//         console.log(`A row has been deleted with rowid ${this.lastID}`);
//         res.send('File deleted successfully');
//     });
// });
