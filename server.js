const Express= require('express')
const app = Express()
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password"
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
    con.query("use aml", function (err, result) {
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
