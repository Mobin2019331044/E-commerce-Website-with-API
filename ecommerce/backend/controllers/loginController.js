// // log_in and sign_up are the names of the ejs files that are being rendered.
const mysql = require('mysql2');
const User = require('../models/user');


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
        app.listen(4000);
        console.log("Listening on port 4000");
    }
});

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


// const login_get = (req, res) => {
//     res.render('login');
// }

const user_login = async(req, res) => {
    console.log(req.body);
    let username = req.body.username;
    let password = req.body.password;

    let query = "SELECT * FROM user WHERE username = ? AND password = ?";
    let values = [username, password];

    var result = await getFromServer(query, values);

    console.log(result);
    res.send(result);
}

// const signup_get = (req, res) => {
//     res.render('signup');
// }

// const user_signup = (req, res) => {
//     console.log(req.body);

//     const user = new User(req.body);
//     user.save().then(result => {
//         res.redirect('/');
//     }).catch(err => {
//         console.log(err);
//     });
// }

// const user_logout = (req, res) => {
//     res.render('login');
// }

module.exports = {
    // login_get,
    user_login,
    // signup_get,
    // user_signup,
    // user_logout
};