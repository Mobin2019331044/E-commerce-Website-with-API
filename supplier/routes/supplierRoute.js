const express = require('express');
const mysql = require('mysql2');
const axios = require('axios');
const router = express.Router();

const app = express();
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
        app.listen(5000);
        console.log("Listening on port 5000");
    }
});

// genearate random string of length 'length'
function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
    }

    return randomString;
}

// run query on the sql server
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


// seller login
router.post('/login', async (req, res) => {
    console.log('in login');
    let id = req.body.id;
    let username = req.body.username;
    let password = req.body.password;

    let query = "SELECT * FROM seller WHERE (username = ? OR id = ?) AND pass = ?";
    let values = [username, id, password];

    var result = await getFromServer(query, values);
    
    if(result.length == 0) {
        console.log('in if');
        res.json({ message: 'check seller credentials'});
    } else {
        console.log('in else');
        res.json(result);
    }
});
router.post('/order/alll', async (req, res) => {
    let sid = req.body.s_id || "Guest";

    console.log("inside order/alll as user "+sid );

    let query = "SELECT * FROM eorder WHERE u_id = ?  order by order_date desc"
    let values = [sid];

    var result = await getFromServer(query, values);
    if(result.length === 0){
        res.send('no orders');
    }else {
        res.send(result);
    }
});

// seller all order details
router.post('/order/all', async (req, res) => {
    let sid = req.body.s_id || 'rafiq';

    console.log(sid);

    let query = "SELECT * FROM eorder WHERE s_id = ? order by order_date desc"
    let values = [sid];

    var result = await getFromServer(query, values);
    if(result.length === 0){
        res.send('no orders');
    }else {
        res.send(result);
    }
});

// a single order details
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

// seller order accepted
router.post('/order/accepted', async (req, res) => {
    let oid = req.body.id;

    console.log(oid)

    let sendQuery = "SELECT * FROM eorder WHERE id = ?"
    let sendValues = [oid];

    let query = "UPDATE eorder SET state = '1' WHERE id = ?";
    let values = [oid];

    try {

        // whose bank account to debit
        var result = await getFromServer(sendQuery, sendValues);
        var data = {
            from: result[0].u_id,
            to: result[0].s_id,
            amount: result[0].price
        };
        console.log(data);

        result = await getFromServer(query, values);

        // result = axios.post('http://localhost:3000/api/bank/transaction', data);

        res.send("acception success");

    }   catch(error) {
        console.log(error);
        res.send('server error, try again later');
    }
});

router.post('/order/delivered', async (req, res) => {
    let oid = req.body.id;

    console.log(oid)

    let curD=new Date().toLocaleString();

    console.log("CurD : ",curD)

    // let sendQuery1 = "UPDATE eorder SET deli_date = ? WHERE id = ?"
    // let values1 = [curD, oid];

    let sendQuery = "SELECT * FROM eorder WHERE id = ?"
    let sendValues = [oid];

    let query = "UPDATE eorder SET state = '5', deli_date = ? WHERE id = ?";
    let values = [curD,oid];

    try {

        // var result2 = await getFromServer(sendQuery1, values1);
        // whose bank account to debit
        var result = await getFromServer(sendQuery, sendValues);
        var data = {
            from: result[0].u_id,
            to: result[0].s_id,
            amount: result[0].price
        };
        console.log(data);

        result = await getFromServer(query, values);

        // result = axios.post('http://localhost:3000/api/bank/transaction', data);

        res.send("delivery success");

    }   catch(error) {
        console.log(error);
        res.send('server error, try again later');
    }
});

// seller order cancelled
router.post('/orderCencel', async (req, res) => {
    let oid = req.body.id;

    let query = "UPDATE eorder SET state = 2 WHERE id = ?";
    let values = [oid];

    try {
        var result = await getFromServer(query, values);
        res.send("cancellation success");
    }   catch(error) {
        res.send('server error, try again later');
    }
});


// get bank account
router.get('/user/getBankAcc/:id', async (req, res) => {
    let userId = req.params.id;
    let query = "SELECT bank_acc FROM ecomm_user WHERE username = ?";
    let values = [userId];

    var result = await getFromServer(query, values);
    res.send(result);
});

// transaction request

module.exports = router;