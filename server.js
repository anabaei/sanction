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

  // var db_config = {
  //   host: "localhost",
  //   user: "root",
  //   password: "password",
  //   database: "aml"
  // }
  
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


  function doSql(table, message)
  {
    connection.query(table, function (err, result) 
    {
      if (err) console.log(err);
      else {console.log(message);}
    });
  }

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

app.get('/migrate', (request, response) => { 

  var drop_sanction = "DROP TABLE IF EXISTS sanction_list";
  var drop_address = "DROP TABLE IF EXISTS address";
  var drop_info_santion = "DROP TABLE IF EXISTS info_sanction";
  var drop_info = "DROP TABLE IF EXISTS info";

  doSql(drop_sanction, "drop sanction");
  doSql(drop_address, "drop address");
  doSql(drop_info_santion, "drop info santion");
  doSql(drop_info, "drop info");


  ///////// INFO ///////////
  var create_info = " CREATE TABLE info (name VARCHAR(255), "
  +"firstName VARCHAR(255), "
  +"lastName VARCHAR(255), "
  +"birth_date VARCHAR(255)"
  +", place VARCHAR(255)"
  +", quality VARCHAR(255)"
  +", title VARCHAR(255)"
  +", source VARCHAR(255)"
  +", description VARCHAR(255)"
  +", issued_at VARCHAR(255)"
  +", number VARCHAR(255)"
  +", url VARCHAR(255)"
  +", type VARCHAR(255)"
  +", second_name VARCHAR(255)"
  +", third_name VARCHAR(255)"
  +", listed_at VARCHAR(255)"
  +", action VARCHAR(255)"
  +", program VARCHAR(255)"
  +", summary Text"
  +", text VARCHAR(255)"
  +", gender VARCHAR(255)"
  +", alias VARCHAR(255)"
  +", parent VARCHAR(255))";
  doSql(create_info, "created info");
  
   ///////// Address ///////////
   var create_address = " CREATE TABLE address (source VARCHAR(255), info_id INT, "
   +"country VARCHAR(255), "
  +"city VARCHAR(255), "
  +"street VARCHAR(255), "
  +"postal_code VARCHAR(255), "
  +"country_code VARCHAR(255), "
  +"region VARCHAR(255), "
  +"note Text, "
  +"street_2 VARCHAR(255))";
  doSql(create_address, "created address");
 
   ///////// Info-Sanction ///////////
   var create_info_sanction = " CREATE TABLE info_sanction (sanction_list_id INT, "
   +"info_id INT)";
   doSql(create_info_sanction, "created info_sanction");

    ///////// sanction_list ///////////
    var sanction_list = " CREATE TABLE sanction_list (name VARCHAR(255)) ";
    doSql(sanction_list , "sanction_list");

  /// CREATE INSIDE ANOTHER DATABASE ////
  // var sql2 = +"DROP TABLE IF EXISTS aml_pro.sanction_list "+ 
  // +", DROP TABLE IF EXISTS aml_pro.address "+ 
  // +", DROP TABLE IF EXISTS aml_pro.info_sanction "+ 
  // +", DROP TABLE IF EXISTS aml_pro.info "+ 
  // +", CREATE TABLE aml_pro.santion_list SELECT * FROM sanction_list " +
  // +", CREATE TABLE aaml_pro.address SELECT * FROM address " +
  // +", CREATE TABLE aml_pro.info_sanction SELECT * FROM info_sanction " +
  // +", CREATE TABLE aml_pro.info SELECT * FROM info ";
  
    response.send(`created`) 
})


///// insert into info (name,  source) SELECT name, entity_id  FROM au_dfat_sanctions_aliases  //

app.get('/info', (request, response) => { 
 
  ////// insert from au_drat_sanction into INFO table ////////
  let au_dfat_sanctions = " insert into info (name,  source, type, summary, program, url) "
 + " SELECT name, id,  type,  summary, program, url  FROM au_dfat_sanctions";
 doSql(au_dfat_sanctions, "insert from au_dfat_sanctions");
 ///// insert from sanction address into address table ///////
 let au_dfat_address = "  insert into address (source,  note )  "
 + " SELECT entity_id, text  FROM au_dfat_sanctions_addresses ";
 doSql(au_dfat_address, "insert from sanction address");
 //// Just add to that then we specifies aliases ////
 let au_dfat_sanctions_aliases  = "insert into info (name,  source)   "
 + " SELECT name, entity_id  FROM au_dfat_sanctions_aliases";
 doSql(au_dfat_sanctions_aliases , "au_dfat_sanctions_aliases");

 /// UPDATE `table_name` SET `column_name` = `new_value' [WHERE condition];
//  UPDATE tableA a
// INNER JOIN tableB b ON a.name_a = b.name_b
// SET validation_check = if(start_dts > end_dts, 'VALID', '')
// -- where clause can go here

let tt = "UPDATE info ,( SELECT entity_id, date FROM au_dfat_sanctions_birth_dates bd ) AS src"
+" SET info.birth_date = src.date"
+" WHERE info.source = src.entity_id"
doSql(tt , "tt");


 
});




app.listen(
    process.env.PORT  || 3000, ()=>console.log('server is running')
)





