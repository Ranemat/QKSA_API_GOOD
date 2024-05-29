const mysql = require('mysql');
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

const db = mysql.createConnection({
    host: process.env.MYSQL_HOST || '127.0.0.1',
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
    const createTableSql = `
        CREATE TABLE IF NOT EXISTS restaurants (
            id INT AUTO_INCREMENT PRIMARY KEY,
            restaurant_name VARCHAR(255) NOT NULL,
            description TEXT,
            location VARCHAR(255),
            sponsor_name VARCHAR(255)
        )
    `;
    db.query(createTableSql, (err, result) => {
        if (err) {
            console.error('Error creating table:', err);
            return;
        }
        console.log('Table created or already exists.');
    });
});

app.use(express.json());

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
