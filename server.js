const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const fs = require('fs');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

// Load JSON data
const jsonData = JSON.parse(fs.readFileSync('restaurants.json', 'utf8'));

app.use(bodyParser.json());

// MySQL configuration
const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to the QKSA API!');
});

// Route to get JSON data
app.get('/jsonData', (req, res) => {
  res.json(jsonData);
});

// API route to get all restaurants
app.get('/restaurants', (req, res) => {
  const sql = 'SELECT * FROM restaurants';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
  });
});

// API route to get a specific restaurant by ID
app.get('/restaurants/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM restaurants WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Server error');
      return;
    }
    if (results.length === 0) {
      res.status(404).send('Restaurant not found');
      return;
    }
    res.json(results[0]);
  });
});

// API route to create a new restaurant
app.post('/restaurants', (req, res) => {
  const { name, location, cuisine } = req.body;
  const sql = 'INSERT INTO restaurants (name, location, cuisine) VALUES (?, ?, ?)';
  db.query(sql, [name, location, cuisine], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).send('Server error');
      return;
    }
    res.status(201).json({ id: result.insertId, name, location, cuisine });
  });
});

// API route to update a restaurant by ID
app.put('/restaurants/:id', (req, res) => {
  const { id } = req.params;
  const { name, location, cuisine } = req.body;
  const sql = 'UPDATE restaurants SET name = ?, location = ?, cuisine = ? WHERE id = ?';
  db.query(sql, [name, location, cuisine, id], (err, result) => {
    if (err) {
      console.error('Error updating data:', err);
      res.status(500).send('Server error');
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).send('Restaurant not found');
      return;
    }
    res.status(200).json({ id, name, location, cuisine });
  });
});

// API route to delete a restaurant by ID
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
