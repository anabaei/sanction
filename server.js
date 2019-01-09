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
// var db_config = {
//     host: "us-cdbr-iron-east-01.cleardb.net",
//     user: "b8fab95b485474",
//     password: "1d283d4f",
//     database: "heroku_fe78334d2b9e30f"
//   };

  var db_config = {
    host: "localhost",
    user: "root",
    password: "password",
    database: "aml"
  }
  
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

app.get('/seed', (request, response) => { 

//   var sql = "DROP TABLE IF EXISTS sanction_list, "+ 
//   +"CREATE TABLE sanction_list (name VARCHAR(255)) ";



  var sql = "DROP TABLE IF EXISTS sanction_list, "+ 
  +" DROP TABLE IF EXISTS address, "+ 
  +" DROP TABLE IF EXISTS info_sanction, "+ 
  +" DROP TABLE IF EXISTS info, "+ 
  +" CREATE TABLE sanction_list (name VARCHAR(255)), "+
  +" CREATE TABLE info (name VARCHAR(255) "+
  +", firstName VARCHAR(255)"+
  +", lastName VARCHAR(255)"+
  +", birth_date VARCHAR(255)"+
  +", place VARCHAR(255)"+
  +", quality VARCHAR(255)"+
  +", title VARCHAR(255)"+
  +", source VARCHAR(255)"+
  +", description VARCHAR(255)"+
  +", issued_at VARCHAR(255)"+
  +", number VARCHAR(255)"+
  +", url VARCHAR(255)"+
  +", second_name VARCHAR(255)"+
  +", third_name VARCHAR(255)"+
  +", listed_at VARCHAR(255)"+
  +", function VARCHAR(255)"+
  +", program VARCHAR(255)"+
  +", summary VARCHAR(255)"+
  +", text VARCHAR(255)"+
  +", gender VARCHAR(255)"+
  +", alias VARCHAR(255)"+
  +", parent VARCHAR(255)"+
  +") ";
  
 


  var sql2 = +"DROP TABLE IF EXISTS aml_pro.sanction_list "+ 
  +", DROP TABLE IF EXISTS aml_pro.address "+ 
  +", DROP TABLE IF EXISTS aml_pro.info_sanction "+ 
  +", DROP TABLE IF EXISTS aml_pro.info "+ 
  +", CREATE TABLE aml_pro.santion_list SELECT * FROM aml.sanction_list " +
  +", CREATE TABLE aaml_pro.address SELECT * FROM aml.address " +
  +", CREATE TABLE aml_pro.info_sanction SELECT * FROM aml.info_sanction " +
  +", CREATE TABLE aml_pro.info SELECT * FROM aml.info ";
  
  connection.query(sql, function (err, result) {
    if (err) console.log(err);
    else {console.log("Table created");}
  });
  
//   var sql = "CREATE TABLE sanction_list (name VARCHAR(255))";
//   connect.query(sql, function (err, result) {
//     if (err) throw err;
//     console.log("Table created");
//   });

    response.send(`created`) 
})





app.listen(
    process.env.PORT  || 3000, ()=>console.log('server is running')
)






