const express = require('express');
const mysql = require('mysql');
const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

// إعدادات الاتصال بقاعدة البيانات
const db = mysql.createConnection({
    host: process.env.MARIADB_HOST || '127.0.0.1',
    user: process.env.MARIADB_USER || 'root',
    password: process.env.MARIADB_PASSWORD || 'Ranemat19@',
    database: process.env.MARIADB_DATABASE || 'restaurantdb',
    charset: 'utf8mb4'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MariaDB:', err);
        return;
    }
    console.log('Connected to MariaDB');
});

app.get('/', (req, res) => {
    res.send('Welcome to the QKSA API!');
});

app.get('/restaurants', (req, res) => {
    const sql = 'SELECT * FROM restaurants';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Server error');
            return;
        }
        res.json(result);
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
