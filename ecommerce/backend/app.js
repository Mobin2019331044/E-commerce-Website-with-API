const express = require('express');
const morgan = require('morgan');
const mysql = require('mysql2');
const ecommRoutes = require('./routes/ecommRoutes');
const dotenv = require("dotenv")
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'E_Commerce'
});
PORT=process.env.PORT || 4001
db.connect((err) => {
    if(err) {
        console.log(err);
    }   else {
        console.log("Connected to MySQL");
        app.listen(PORT);
        console.log(`Listening to Port ${PORT}`);
    }
});

app.use('/api/ecomm', ecommRoutes);
