const express = require('express');
const mysql = require('mysql');
const fs = require('fs');
const app = express();
const port = 8080;

app.use(express.json());

// إعداد الاتصال بقاعدة البيانات
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Ranemat19@',
    database: 'restaurantdb'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database.');
    loadDataToDatabase(); // تحميل البيانات من ملف JSON إلى قاعدة البيانات عند بدء التشغيل
});

// تحميل البيانات من ملف JSON إلى قاعدة البيانات
const loadDataToDatabase = () => {
    const data = fs.readFileSync('./restaurants.json', 'utf8');
    const restaurants = JSON.parse(data);

    restaurants.forEach(restaurant => {
        const query = 'INSERT INTO restaurants (restaurant_name, description, location) VALUES (?, ?, ?)';
        db.query(query, [restaurant.restaurant_name, restaurant.description, restaurant.location], (err, result) => {
            if (err) {
                console.error('Error inserting data:', err);
            }
        });
    });
    console.log('Data loaded to the database.');
};

// نقطة النهاية للترحيب
app.get('/', (req, res) => {
    res.send('Welcome to the QKSA API!');
});

// قراءة جميع المطاعم
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

// إضافة مطعم جديد
app.post('/restaurants', (req, res) => {
    const newRestaurant = req.body;
    const query = 'INSERT INTO restaurants (restaurant_name, description, location) VALUES (?, ?, ?)';
    db.query(query, [newRestaurant.restaurant_name, newRestaurant.description, newRestaurant.location], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).send('Server error');
            return;
        }
        res.status(201).json({ id: result.insertId, ...newRestaurant });
    });
});

// تحديث مطعم موجود
app.put('/restaurants/:id', (req, res) => {
    const restaurantId = req.params.id;
    const updatedRestaurant = req.body;
    const query = 'UPDATE restaurants SET restaurant_name = ?, description = ?, location = ? WHERE id = ?';
    db.query(query, [updatedRestaurant.restaurant_name, updatedRestaurant.description, updatedRestaurant.location, restaurantId], (err, result) => {
        if (err) {
            console.error('Error updating data:', err);
            res.status(500).send('Server error');
            return;
        }
        res.json({ id: restaurantId, ...updatedRestaurant });
    });
});

// حذف مطعم
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

// تشغيل الخادم
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
