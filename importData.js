const mysql = require('mysql');
const fs = require('fs');
const path = require('path');

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

    // قراءة ملف JSON
    const filePath = path.join(__dirname, 'restaurants.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            return;
        }
        const restaurants = JSON.parse(data);

        // إدراج البيانات في قاعدة البيانات
        restaurants.forEach((restaurant) => {
            const { restaurant_name, description, location } = restaurant;
            const sql = 'INSERT INTO restaurants (restaurant_name, description, location) VALUES (?, ?, ?)';
            db.query(sql, [restaurant_name, description, location], (err, result) => {
                if (err) {
                    console.error('Error inserting data:', err);
                } else {
                    console.log('Data inserted successfully:', result);
                }
            });
        });

        db.end();
    });
});
