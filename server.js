const Express= require('express')
const app = Express()
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// var con = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "password"
//   });

  
  //mysql://b8fab95b485474:1d283d4f@us-cdbr-iron-east-01.cleardb.net/heroku_fe78334d2b9e30f?reconnect=true

  var con = mysql.createConnection({
    host: "us-cdbr-iron-east-01.cleardb.net",
    user: "b8fab95b485474",
    password: "1d283d4f"
    //port: "3306"
  });

app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false})); // support encoded bodies
// Configure our Express app to use ejs as our templating engine
app.set('view engine', 'ejs'); 
///////////////////////////////////////////////////
//////////////////////// DB  //////////////////////
///////////////////////////////////////////////////

  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query("CREATE DATABASE aml", function (err, result) {
        if (err) throw err;
        console.log("Database aml conneted!");
      });
  });

///////////////////////////////////////////////////
////////// Allow to parse bodies in json //////////
///////////////////////////////////////////////////
app.get('/', (request, response) => { 
    response.send(`Hello, World!`) 
})

app.listen(
    process.env.PORT  || 3000, ()=>console.log('server is running')
)
