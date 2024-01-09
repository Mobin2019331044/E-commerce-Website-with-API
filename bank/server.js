const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const bankRoutes = require('./routes/bankRoutes');

const app = express();

// Middleware
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.send('Success');
});
app.use('/api/bank', bankRoutes);

PORT=process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
});


