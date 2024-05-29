const express = require('express');
const mysql = require('mysql');
const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

const db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
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

app.get('/restaurants/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM restaurants WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Server error');
            return;
        }
        if (result.length === 0) {
            res.status(404).send('Restaurant not found');
            return;
        }
        res.json(result[0]);
    });
});

app.post('/restaurants', (req, res) => {
    const newRestaurant = req.body;
    const sql = 'INSERT INTO restaurants SET ?';
    db.query(sql, newRestaurant, (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).send('Server error');
            return;
        }
        res.status(201).json({ id: result.insertId, ...newRestaurant });
    });
});

app.put('/restaurants/:id', (req, res) => {
    const { id } = req.params;
    const updatedRestaurant = req.body;
    const sql = 'UPDATE restaurants SET ? WHERE id = ?';
    db.query(sql, [updatedRestaurant, id], (err, result) => {
        if (err) {
            console.error('Error updating data:', err);
            res.status(500).send('Server error');
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).send('Restaurant not found');
            return;
        }
        res.status(204).send();
    });
});

app.delete('/restaurants/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM restaurants WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error deleting data:', err);
            res.status(500).send('Server error');
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).send('Restaurant not found');
            return;
        }
        res.status(204).send();
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
