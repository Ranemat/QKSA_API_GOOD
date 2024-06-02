const mysql = require('mysql');

// إعدادات الاتصال بقاعدة البيانات
const db = mysql.createConnection({
    host: process.env.MARIADB_HOST || '127.0.0.1',
    user: process.env.MARIADB_USER || 'root',
    password: process.env.MARIADB_PASSWORD || '',
    database: process.env.MARIADB_DATABASE || 'restaurantdb',
    charset: 'utf8mb4'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MariaDB:', err);
        process.exit(1); // إنهاء العملية إذا كان هناك خطأ في الاتصال
    }
    console.log('Connected to MariaDB');

    // اختبار الاتصال بقاعدة البيانات
    db.query('SELECT 1 + 1 AS solution', (err, results, fields) => {
        if (err) {
            console.error('Error executing query:', err);
            process.exit(1); // إنهاء العملية إذا كان هناك خطأ في الاستعلام
        }
        console.log('Database connection is working! Solution:', results[0].solution);
        db.end(); // إنهاء الاتصال بقاعدة البيانات
    });
});
