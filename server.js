const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

const jsonData = [
  {
    "restaurant_name": "جوي كافيه",
    "description": "كافيه و مطعم جميل و رايق. الأسعار تعتبر مرتفعه و الويكند زحمه. فطورهم روعة و السعر متوسط و مرتفع. جلسات داخلية و خارجية. واجهة الرياض و فيه فرع في ذا زون.",
    "location": "https://goo.gl/maps/46vRF9dAURW5vNrh6"
},
{
    "restaurant_name": "جوي زون",
    "description": "ألعاب حركية والكترونية وكهربائية. يوجد مطعم وقاعة للحفلات. الصحافة.",
    "location": "https://goo.gl/maps/GmiXVjGmQeP8a7qy9"
},
{
    "restaurant_name": "فرن الضيعة",
    "description": "يقدم أطباق متنوعة من البيتزا والفطائر. تقديم طلبات التوصيل.",
    "location": "https://goo.gl/maps/M1ZvPPxAxeA2"
},
{
    "restaurant_name": "شوروز جوي",
    "description": "يقدم شوروز جوي شوروز جوي اذا ما جربت الشوروز هذي الفرصة انك تزور تشوروك كافيه و تطلبه من عندهم حاجة خيالية وفي الدماغ. تقييم الزوار ممتاز ٤.٦/٥.",
    "location": "https://goo.gl/maps/yJ3cqYRr1WQWBCmR7"
},
{
    "restaurant_name": "جوي اند جوس",
    "description": "قادم من لندن ونيويورك. يقدم أطباق فرنسية لذيذة.",
    "location": "https://goo.gl/maps/syVDCgbRMhRBjXty5"
},
{
    "restaurant_name": "جوي زون",
    "description": "ألعاب حركية والكترونية وكهربائية. يوجد مطعم وقاعة للحفلات. الصحافة.",
    "location": "https://goo.gl/maps/GmiXVjGmQeP8a7qy9"
},
{
    "restaurant_name": "جوي كافيه",
    "description": "كافيه و مطعم جميل و رايق 👌🏼 الأسعار تعتبر مرتفعه و الويكند زحمه فطورهم روعة و السعر متوسط و مرتفع جلسات داخلية و خارجية 🛋🪑 واجهة الرياض و فيه فرع في ذا زون 📍",
    "location": "https://goo.gl/maps/3eLzCj9mXB4yFeWc8"
},
{
    "restaurant_name": "جوي زون",
    "description": "ألعاب حركية والكترونية وكهربائية🎠 يوجد مطعم وقاعة للحفلات🎈",
    "location": "https://goo.gl/maps/GmiXVjGmQeP8a7qy9"
},
{
    "restaurant_name": "Meem Cafe",
    "description": "Meem Cafe is pleased to offer a variety of delicious dishes and beverages in Riyadh. Enjoy our cozy ambiance and excellent service while indulging in our menu, which includes a range of coffees, teas, sandwiches, salads, and desserts. Visit us for a delightful dining experience!",
    "location": "https://goo.gl/maps/sJT6eF7LVnGG7aYA8"
},
{
    "name": "Joy Cafe",
    "description": "Joy Cafe offers indoor and outdoor seating with outdoor seats overlooking a beautiful fountain. Their menu is diverse with many options, and their service is excellent. The place tends to be crowded.",
    "location": "https://goo.gl/maps/b4MKrDAAH7R2"
},
{
    "name": "Meem Cafe",
    "description": "Meem Cafe is a cozy spot in Riyadh. They provide great service and have a diverse menu. It's worth a visit, especially for breakfast.",
    "location": "https://goo.gl/maps/sJT6eF7LVnGG7aYA8"
},
{
    "restaurant_name": "جوي كافيه ☕️",
    "description": "كافيه و مطعم جميل و رايق 👌🏼 الأسعار تعتبر مرتفعه و الويكند زحمه فطورهم روعة و السعر متوسط و مرتفع جلسات داخلية و خارجية 🛋🪑 واجهة الرياض و فيه فرع في ذا زون 📍",
    "location": "https://goo.gl/maps/3eLzCj9mXB4yFeWc8"
},
{
    "restaurant_name": "ديب اند جوي",
    "description": "مطعم متخصص في الوجبات السريعة والمأكولات البحرية.",
    "location": "https://goo.gl/maps/ey6A8RQsJqGJU9dC6",
    "sponsor_name": "موبايلي"
},
{
    "restaurant_name": "مقهى المسافر",
    "description": "مقهى مميز يقدم القهوة والوجبات الخفيفة في أجواء مريحة وممتعة. يعتبر مكانًا مثاليًا للاستمتاع بالأجواء الرياضية ومتابعة المباريات.",
    "location": "https://goo.gl/maps/1RRQ3pNvLQmqrbkG8"
}];

// MySQL connection
const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
  
  // Create restaurants table if not exists
  const createTableQuery = `
  CREATE TABLE IF NOT EXISTS restaurants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL
  )
  `;

  connection.query(createTableQuery, (err, results) => {
    if (err) {
      console.error('Error creating table:', err);
      return;
    }
    console.log('Table created or already exists');

    // Insert JSON data into the table
    jsonData.forEach((restaurant) => {
      const insertQuery = 'INSERT INTO restaurants (restaurant_name, description, location) VALUES (?, ?, ?)';
      connection.query(insertQuery, [restaurant.restaurant_name, restaurant.description, restaurant.location], (err, results) => {
        if (err) {
          console.error('Error inserting data:', err);
          return;
        }
        console.log('Data inserted for', restaurant.restaurant_name);
      });
    });
  });
});

app.get('/restaurants', (req, res) => {
  connection.query('SELECT * FROM restaurants', (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
