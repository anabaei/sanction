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

//   var con = mysql.createConnection({
//     host: "us-cdbr-iron-east-01.cleardb.net",
//     user: "b8fab95b485474",
//     password: "1d283d4f",
//     database: "heroku_fe78334d2b9e30f"
    
//   });

app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false})); // support encoded bodies
// Configure our Express app to use ejs as our templating engine
app.set('view engine', 'ejs'); 
///////////////////////////////////////////////////
//////////////////////// DB  //////////////////////
///////////////////////////////////////////////////
var db_config = {
    host: "us-cdbr-iron-east-01.cleardb.net",
    user: "b8fab95b485474",
    password: "1d283d4f",
    database: "heroku_fe78334d2b9e30f"
  };
  
  var connection;
  
  function handleDisconnect() {
    connection = mysql.createConnection(db_config); // Recreate the connection, since
                                                    // the old one cannot be reused.
  
    connection.connect(function(err) {              // The server is either down
      if(err) {                                     // or restarting (takes a while sometimes).
        console.log('error when connecting to db:', err);
        setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
      }                                     // to avoid a hot loop, and to allow our node script to
    });                                     // process asynchronous requests in the meantime.
                                            // If you're also serving http, display a 503 error.
    connection.on('error', function(err) {
      console.log('db error', err);
      if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
        handleDisconnect();                         // lost due to either server restart, or a
      } else {                                      // connnection idle timeout (the wait_timeout
        throw err;                                  // server variable configures this)
      }
    });
  }
  
  handleDisconnect();

//   con.connect(function(err) {
//     if (err) { console.log("Not Connected!"); console.log(err.message); handleDisconnect(con)}
//     else{
//     console.log("Connected!");
//     }
//     // con.query("use heroku_fe78334d2b9e30f", function (err, result) {
//     //     if (err) { console.log("Not created!"); console.log(err.message); throw err;}
//     //     console.log(" using");
//     //   });
//   });
  

///////////////////////////////////////////////////
////////// Allow to parse bodies in json //////////
///////////////////////////////////////////////////
app.get('/', (request, response) => { 
    
    response.send(`Hello`) 
})




app.listen(
    process.env.PORT  || 3000, ()=>console.log('server is running')
)






