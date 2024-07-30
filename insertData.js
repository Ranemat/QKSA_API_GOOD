const fs = require('fs');

module.exports = function (db) {
    // قراءة البيانات من ملف JSON
    const data = JSON.parse(fs.readFileSync('restaurants.json', 'utf8'));

    // إدخال البيانات في الجدول بعد التحقق من عدم وجودها مسبقاً
    data.forEach((restaurant) => {
        const { restaurant_name, description, location } = restaurant;
        const checkQuery = 'SELECT * FROM restaurants WHERE name = ? AND location = ?';
        db.query(checkQuery, [restaurant_name, location], (err, results) => {
            if (err) {
                console.error('Error checking data:', err);
                return;
            }
            if (results.length > 0) {
                console.log(`Restaurant with name ${restaurant_name} and location ${location} already exists.`);
            } else {
                const query = 'INSERT INTO restaurants (name, description, location) VALUES (?, ?, ?)';
                db.query(query, [restaurant_name, description, location], (err, results) => {
                    if (err) {
                        console.error('Error inserting data:', err);
                        return;
                    }
                    console.log('Data inserted:', results.insertId);
                });
            }
        });
    });

    console.log('Data load to the database complete.');
};
