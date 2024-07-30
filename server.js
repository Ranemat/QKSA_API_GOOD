require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const insertData = require('./insertData');
const app = express();
const port = process.env.PORT || 9999;

app.use(express.json());

const dbConfig = {
    host: process.env.DB_HOST || 'my-mariadb',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Ranem',
    database: process.env.DB_NAME || 'restaurantdb',
    charset: 'utf8mb4'
};

let db;

function connectToDatabase(attempt = 1) {
    db = mysql.createConnection(dbConfig);

    db.connect((err) => {
        if (err) {
            console.error(`Error connecting to the database (attempt ${attempt}):`, err);
            if (attempt < 5) {
                setTimeout(() => connectToDatabase(attempt + 1), 5000); // Retry after 5 seconds
            }
            return;
        }
        console.log('Connected to the database.');

        // Create table if it doesn't exist
        const createTableQuery = `
        CREATE TABLE IF NOT EXISTS restaurants (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            location VARCHAR(255)
        ) CHARSET=utf8mb4;
        `;

        db.query(createTableQuery, (err, result) => {
            if (err) {
                console.error('Error creating table:', err);
                return;
            }
            console.log('Table "restaurants" is ready.');
            insertData(db); // Call the function to insert data
        });
    });
}

app.get('/test-db', (req, res) => {
    db.query('SELECT 1 + 1 AS solution', (error, results) => {
        if (error) {
            console.error('Error testing database connection:', error);
            res.send('Database connection failed');
        } else {
            res.send(`Database connection successful: ${results[0].solution}`);
        }
    });
});

// CRUD Endpoints
app.get('/', (req, res) => {
    res.send('Welcome to the QKSA API!');
});

app.get('/restaurants', (req, res) => {
    db.query('SELECT * FROM restaurants', (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Server error');
            return;
        }
        res.json(results);
    });
});

app.post('/restaurants', (req, res) => {
    const newRestaurant = req.body;
    const checkQuery = 'SELECT * FROM restaurants WHERE name = ? AND location = ?';
    db.query(checkQuery, [newRestaurant.name, newRestaurant.location], (err, results) => {
        if (err) {
            console.error('Error checking data:', err);
            res.status(500).send('Server error during check');
            return;
        }
        if (results.length > 0) {
            res.status(400).send('Restaurant with the same name and location already exists');
        } else {
            const query = 'INSERT INTO restaurants (name, description, location) VALUES (?, ?, ?)';
            db.query(query, [newRestaurant.name, newRestaurant.description, newRestaurant.location], (err, result) => {
                if (err) {
                    console.error('Error inserting data:', err);
                    console.error('SQL Query:', query);
                    console.error('Data:', [newRestaurant.name, newRestaurant.description, newRestaurant.location]);
                    res.status(500).send('Server error during insertion');
                    return;
                }
                res.status(201).json({ id: result.insertId, ...newRestaurant });
            });
        }
    });
});

app.put('/restaurants/:id', (req, res) => {
    const restaurantId = req.params.id;
    const updatedRestaurant = req.body;
    const checkQuery = 'SELECT * FROM restaurants WHERE name = ? AND location = ? AND id != ?';
    db.query(checkQuery, [updatedRestaurant.name, updatedRestaurant.location, restaurantId], (err, results) => {
        if (err) {
            console.error('Error checking data:', err);
            res.status(500).send('Server error');
            return;
        }
        if (results.length > 0) {
            res.status(400).send('Another restaurant with the same name and location already exists');
        } else {
            const query = 'UPDATE restaurants SET name = ?, description = ?, location = ? WHERE id = ?';
            db.query(query, [updatedRestaurant.name, updatedRestaurant.description, updatedRestaurant.location, restaurantId], (err, result) => {
                if (err) {
                    console.error('Error updating data:', err);
                    res.status(500).send('Server error');
                    return;
                }
                res.json({ id: restaurantId, ...updatedRestaurant });
            });
        }
    });
});

app.delete('/restaurants/:id', (req, res) => {
    const restaurantId = req.params.id;
    const query = 'DELETE FROM restaurants WHERE id = ?';
    db.query(query, [restaurantId], (err, result) => {
        if (err) {
            console.error('Error deleting data:', err);
            res.status(500).send('Server error');
            return;
        }
        res.json({ message: 'Restaurant deleted' });
    });
});

function startServer() {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
        connectToDatabase();
    });
}

// Adding a delay to ensure the port is free before starting the server
setTimeout(startServer, 5000);
