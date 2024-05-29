const express = require('express');
const mysql = require('mysql');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 8080;

// Read and parse the JSON file
const jsonData = JSON.parse(fs.readFileSync('restaurants.json', 'utf8'));

// Database connection
const db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

// Connect to MySQL and create table if not exists
db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');

    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS restaurants (
            id INT AUTO_INCREMENT PRIMARY KEY,
            restaurant_name VARCHAR(255) NOT NULL,
            description TEXT,
            location VARCHAR(255),
            sponsor_name VARCHAR(255)
        );
    `;

    db.query(createTableQuery, (err, result) => {
        if (err) {
            console.error('Error creating table:', err);
            return;
        }
        console.log('Table "restaurants" created or already exists.');
    });
});

// Route to get all restaurants
app.get('/restaurants', (req, res) => {
    const sql = 'SELECT * FROM restaurants';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error retrieving data:', err);
            res.status(500).send('Server error');
            return;
        }
        res.json(result);
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
