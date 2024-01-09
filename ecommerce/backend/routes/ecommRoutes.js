const express = require('express');
const axios = require('axios');
const router = express.Router();
const mysql = require('mysql2');

var app = express();
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'E_Commerce'
});

db.connect((err) => {
    if(err) {
        console.log(err);
    }   else {
        console.log("Connected to MySQL");
    }
});

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
    }

    return randomString;
}


const getFromServer = (query, value) => {
    return new Promise( (resolve, reject) => {
        db.query(query, value, function (error, data) {
            if (error) {
                reject(error);
            }
            else {
                resolve(data);
            }
        });

    });
}

// login
router.post('/user/login', async(req, res) => {
    console.log(req.body);
    let username = req.body.username;
    let password = req.body.password;

    let query = "SELECT * FROM ecomm_user WHERE username = ? AND pass = ?";
    let values = [username, password];

    var result = await getFromServer(query, values);

    console.log(result);
    if(result.length == 0) {
        res.send('check user credentials');
    } else {
        res.send(result);
    }
});

// create user
router.post('/user/create', async(req, res) => {

    console.log(req.body);
    let name = req.body.name;
    let username = req.body.username;
    let password = req.body.password;
    let bank_stat = false;

    let query = "INSERT INTO ecomm_user (name, username, pass, bank_stat) VALUES (?, ?, ?, ?)";
    let values = [name, username, password, bank_stat];

    var result = await getFromServer(query, values);

    console.log(result);
    res.send(result);
});

// add bank account
router.post('/user/bankAdd', async(req, res) => {
    let bankAcc = req.body.bank_acc;
    let username = req.body.username;
    let query = "UPDATE ecomm_user SET bank_stat = true, bank_acc = ? WHERE username = ?";
    let values = [bankAcc, username];

    var result = await getFromServer(query, values);

    res.send(result);
});

// get bank account
router.get('/user/getBankAcc/:id', async (req, res) => {
    let userId = req.params.id;
    let query = "SELECT bank_acc FROM ecomm_user WHERE username = ?";
    let values = [userId];

    var result = await getFromServer(query, values);
    res.send(result[0]);
});

// check bank balance
router.post('/user/checkBalance', async (req, res) => {
    let username = req.body.username;

    let query = "SELECT bank_acc FROM ecomm_user WHERE username = ?";
    let values = [username];

    let bankAcc = await getFromServer(query, values);

    var result = await axios.get('http://localhost:3000/api/bank/account/' + bankAcc[0].bank_acc);
    res.send(result.data);
});

// seller login

// get products of a seller
router.post('/seller/getProducts', async (req, res) => {
    let sid = req.body.id;
    console.log(sid)

    let query = "SELECT * FROM product WHERE id = ?";
    let values = [sid];

    var result = await getFromServer(query, values);
    if(result.length === 0){
        res.send('no products');
    }else {
        res.send(result);
    }
});

// seller all order details


// seller order delivered


// seller order cancelled

// make order
router.post('/order/make', (req, res) => {
    let userid = req.body.u_id;
    let price = req.body.price;
    let sellerid = req.body.s_id;
    let status = 0;
    let product = req.body.product;
    let order_date = req.body.order_date;

    let orderId = generateRandomString(6);
    // console.log(orderId);
    // res.send(orderId);

    let query = "INSERT INTO eorder (id, u_id, price, state, s_id,product,order_date) VALUES (?, ?, ?, ?, ?, ?, ?)";
    let values = [orderId, userid, price, status, sellerid, product, order_date];
    try{
        var result = getFromServer(query, values);
        res.send(orderId);
    }   catch(error) {
        res.send(error);
    }
});


// order details
router.post('/order/details', async (req, res) => {
    let oid = req.body.id;

    let query = "SELECT * FROM eorder WHERE id = ?";
    let values = [oid];
    
    var result = await getFromServer(query, values);
    if(result.length === 0){
        res.send('no orders');
    }else {
        res.send(result);
    }
});

// transaction request
router.post('/transaction/request', async (req, res) => {

    let from = req.body.from;
    let to = req.body.to;
    let amount = req.body.amount;

    var query = "SELECT bank_acc FROM ecomm_user WHERE username = ?";
    var values = [from];

    var result = await getFromServer(query, values);
    from = result[0].bank_acc;

    values = [to];
    result = await getFromServer(query, values);
    to = result[0].bank_acc;

    let data = {
        from: from,
        to: to,
        amount: amount
    };

    try {
        var result = await axios.post('http://localhost:3000/api/bank/transaction', data);
        res.send('transaction success');
    } catch(error) {
        res.send("server error, try again later");
    }
});

// router.get('/logout', loginController.user_logout);
module.exports = router;