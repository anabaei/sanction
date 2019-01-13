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
//     user: "bd5294a3a4f4ce",
//     password: "650afed5", // "9303e8fdb9943f2"
//     database: "heroku_8a9641ddd906877"
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

  //doSql(drop_sanction, "drop sanction");
  //doSql(drop_address, "drop address");
  //doSql(drop_info_santion, "drop info santion");
  doSql(drop_info, "drop info");


  ///////// INFO ///////////
  var create_info = " CREATE TABLE info (name VARCHAR(255), "
  +"firstName VARCHAR(255), "
  +"lastName VARCHAR(255), "
  +"fatherName VARCHAR(255), "
  +"birth_date VARCHAR(255)"
  +", birth_place Text"
  +", place VARCHAR(255)"
  +", nationality Text"
  +", nationality_code VARCHAR(255)"
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
  +", program Text"
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
  //doSql(create_address, "created address");
 
   ///////// Info-Sanction ///////////
   var create_info_sanction = " CREATE TABLE info_sanction (sanction_list_id INT, "
   +"info_id INT)";
   //doSql(create_info_sanction, "created info_sanction");

    ///////// sanction_list ///////////
    var sanction_list = " CREATE TABLE sanction_list (name VARCHAR(255)) ";
    //doSql(sanction_list , "sanction_list");

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

    /////////////////////////// 
    ///// AU_DFAT sanction ////
    /////////////////////////// 

  ////// insert from au_drat_sanction into INFO table ////////
  let au_dfat_sanctions = " insert into info (name,  source, type, summary, program, url) "
 + " SELECT name, id,  type,  summary, program, url  FROM au_dfat_sanctions";
// doSql(au_dfat_sanctions, "insert from au_dfat_sanctions");
 ///// insert from sanction address into address table ///////
 let au_dfat_address = "  insert into address (source,  note )  "
 + " SELECT entity_id, text  FROM au_dfat_sanctions_addresses ";
// doSql(au_dfat_address, "insert from sanction address");
 //// Just add to that then we specifies aliases ////
 let au_dfat_sanctions_aliases  = "insert into info (name,  source)   "
 + " SELECT name, entity_id  FROM au_dfat_sanctions_aliases";
 //doSql(au_dfat_sanctions_aliases , "au_dfat_sanctions_aliases");

 /// UPDATE `table_name` SET `column_name` = `new_value' [WHERE condition];
//  UPDATE tableA a
// INNER JOIN tableB b ON a.name_a = b.name_b
// SET validation_check = if(start_dts > end_dts, 'VALID', '')
// -- where clause can go here

let birth_date = "UPDATE info ,( SELECT entity_id, date FROM au_dfat_sanctions_birth_dates bd ) AS src"
+" SET info.birth_date = src.date"
+" WHERE info.source = src.entity_id"
//11 doSql(birth_date , "info birth date updated");


let birth_place = "UPDATE info ,( SELECT entity_id, place FROM au_dfat_sanctions_birth_places bd ) AS src"
+" SET info.birth_place = src.place"
+" WHERE info.source = src.entity_id"
//11 doSql(birth_place , "info birth place updated");


let country = "UPDATE info ,( SELECT entity_id, country_name, country_code FROM au_dfat_sanctions_nationalities) AS src"
+" SET info.nationality = src.country_name"
+" , info.nationality_code = src.country_code"
+" WHERE info.source = src.entity_id"
//doSql(country , "info country updated");


  /////////////////////////// 
  ///// ch_seco sanction/////
  /////////////////////////// 

  //// TODO function column has been removed due to error form ch_seco_sanctions tables 
  let ch_seco_sanctions = " insert into info (firstName,  lastName, fatherName ,source, type, summary, program, name) "
  + " SELECT first_name, last_name, father_name, id,  type,  summary, program,  name  FROM ch_seco_sanctions";
 // doSql(ch_seco_sanctions, "insert from ch_seco_sanctions");
});

let ch_seco_sanctions_addresses = "  insert into address (source,  note, street, street_2, postal_code, country, country_code, region  )  "
+ " SELECT entity_id, text, street, street_2, postal_code, country_name, country_code, region  FROM ch_seco_sanctions_addresses ";
//doSql(ch_seco_sanctions_addresses, "insert from ch_seco_sanctions_addresses ");

let ch_seco_sanctions_aliases  = "insert into info (firstName, lastName, fatherName, name, source , quality, title, second_name, third_name)"
 + " SELECT first_name, last_name, father_name, name, entity_id, quality, title, second_name, third_name  FROM ch_seco_sanctions_aliases";
// doSql(ch_seco_sanctions_aliases , " ch_seco_sanctions_aliases ");

let ch_seco_birth_date = "UPDATE info ,( SELECT entity_id, date FROM ch_seco_sanctions_birth_dates bd ) AS src"
+" SET info.birth_date = src.date"
+" WHERE info.source = src.entity_id"
//doSql(ch_seco_birth_date , "info birth date updated from ch_seco_birth_date");


let ch_seco_sanctions_birth_places = "UPDATE info ,( SELECT entity_id, place, quality FROM ch_seco_sanctions_birth_places ) AS src"
+" SET info.birth_place = src.place"
+", info.quality = src.quality"
+" WHERE info.source = src.entity_id"
// doSql(ch_seco_sanctions_birth_places , "ch seco sanctions birth places ");

let ch_seco_sanctions_identifiers = "UPDATE info ,( SELECT entity_id, country_name, country_code, type, description, number FROM ch_seco_sanctions_identifiers) AS src"
+" SET info.nationality = src.country_name"
+" , info.nationality_code = src.country_code"
+" , info.type = src.type"
+" , info.description = src.description"
+" , info.number = src.number"
+" WHERE info.source = src.entity_id"
//doSql(ch_seco_sanctions_identifiers, "ch_seco_sanctions_identifiers");

app.get('/info1', (request, response) => { 

        //////////////////////////// 
        ///// coe_assembly   ///////
        //////////////////////////// 

        ////// insert from au_drat_sanction into INFO table ////////
        let coe_assembly = " insert into info (firstName, lastName,  source, type, summary,  url, name) "
        + " SELECT first_name, last_name, id,  type,  summary, url, name  FROM coe_assembly";
        // doSql(coe_assembly, "insert from acoe_assembly");

        let coe_assembly_nationalitiescountry = "UPDATE info ,( SELECT entity_id, country_name, country_code FROM coe_assembly_nationalities) AS src"
        +" SET info.nationality = src.country_name"
        +" , info.nationality_code = src.country_code"
        +" WHERE info.source = src.entity_id"
        //doSql(coe_assembly_nationalitiescountry , "info country coe_assembly_nationalitiescountry");

        ///////////////////////////// 
        ///////  eu_meps   /////////
        //////////////////////////// 

        let eu_meps = " insert into info (firstName, lastName,  source, type, summary ) "
        + " SELECT first_name, last_name, id,  type,  summary  FROM coe_assembly";
       // doSql(eu_meps, "info eu_meps");

        let eu_meps_nationalities = "UPDATE info ,( SELECT entity_id, country_name, country_code FROM eu_meps_nationalities) AS src"
        +" SET info.nationality = src.country_name"
        +" , info.nationality_code = src.country_code"
        +" WHERE info.source = src.entity_id";
        // doSql(eu_meps_nationalities, " eu_meps_nationalities");

        /////////////////////////////////// 
        ///////  everypolitician  /////////
        /////////////////////////////////// 
         
        let everypolitician = " insert into info ( source, type, program, name , gender ) "
        + " select  id,  type, program, name, gender  FROM everypolitician";
        //doSql(everypolitician, "info everypolitician");
         
        let everypolitician_aliases  = "insert into info (name,  source)   "
        + " SELECT name, entity_id  FROM everypolitician_aliases";
        // doSql(everypolitician_aliases, "everypolitician_aliases");
       
        let everypolitician_nationalities = "UPDATE info ,(SELECT entity_id, country_name, country_code FROM everypolitician_nationalities) AS src"
        +" SET info.nationality = src.country_name"
        +" , info.nationality_code = src.country_code"
        +" WHERE info.source = src.entity_id";
        //doSql(everypolitician_nationalities, "everypolitician_nationalities");

        ////////////////////////////////////// 
        ///////   gb_hmt_sanctions  /////////
        ///////////////////////////////////// 
       
        let gb_hmt_sanctions  = " insert into info ( title, lastName, source, type, summary,  program, name , firstName, second_name, third_name ) "
        + "Select title, last_name, id, type, summary, program, name, first_name, second_name, third_name  FROM gb_hmt_sanctions ";
        //doSql(gb_hmt_sanctions , "info gb_hmt_sanctions ");

        let gb_hmt_sanctions_addresses = "insert into address (source,  country, country_code, postal_code, note  )  "
        + " SELECT entity_id, country_name, country_code, postal_code, text  FROM gb_hmt_sanctions_addresses ";
        //doSql(gb_hmt_sanctions_addresses, "gb_hmt_sanctions_addresses");

        let gb_hmt_sanctions_aliases = "insert into info (firstName, second_name, title, lastName,  source, third_name, name, type )   "
        + " SELECT first_name, second_name, title, last_name, entity_id, third_name, name, type  FROM gb_hmt_sanctions_aliases";
        //doSql(gb_hmt_sanctions_aliases, "gb_hmt_sanctions_aliases");

        let gb_hmt_sanctions_birth_dates = "UPDATE info ,( SELECT entity_id, date FROM gb_hmt_sanctions_birth_dates ) AS src"
        +" SET info.birth_date = src.date"
        +" WHERE info.source = src.entity_id"
        //doSql(gb_hmt_sanctions_birth_dates, "gb_hmt_sanctions_birth_dates");

        let gb_hmt_sanctions_birth_places = "UPDATE info ,( SELECT entity_id, country_name, country_code, place FROM gb_hmt_sanctions_birth_places ) AS src"
        +" SET info.birth_place = src.place"
        // +" , info.country_code = src.country_code" ///TODO country codes??
        +" WHERE info.source = src.entity_id"
        //doSql(gb_hmt_sanctions_birth_places, "gb_hmt_sanctions_birth_places");

        let gb_hmt_sanctions_identifiers = "UPDATE info ,( SELECT entity_id, country_name, country_code, type, number FROM gb_hmt_sanctions_identifiers) AS src"
          +" SET info.nationality = src.country_name"
          +" , info.nationality_code = src.country_code"
          +" , info.type = src.type"
          +" , info.number = src.number"
          +" WHERE info.source = src.entity_id"
        //  doSql(gb_hmt_sanctions_identifiers, "gb_hmt_sanctions_identifiers");

       let gb_hmt_sanctions_nationalities = "UPDATE info ,(SELECT entity_id, country_name, country_code FROM gb_hmt_sanctions_nationalities) AS src"
        +" SET info.nationality = src.country_name"
        +" , info.nationality_code = src.country_code"
        +" WHERE info.source = src.entity_id";
        // doSql(gb_hmt_sanctions_nationalities, "gb_hmt_sanctions_nationalities");

       
        ////////////////////////////////////// 
        ////////////   Ineterpol /////////////
        ///////////////////////////////////// 

        let interpol_red_notices = " insert into info ( firstName, lastName, source, type, summary,  program, url, gender, name  ) "
        + "Select first_name, last_name, id, type, summary, program, url, gender, name  FROM interpol_red_notices ";
        //doSql(interpol_red_notices , "interpol red notices");
         
        let interpol_red_notices_aliases = "insert into info (source, name) "
        + " SELECT entity_id, name  FROM interpol_red_notices_aliases";
       // doSql(interpol_red_notices_aliases, "interpol red notices aliases");
       
       let interpol_red_notices_birth_dates = "UPDATE info ,( SELECT entity_id, date FROM interpol_red_notices_birth_dates ) AS src"
       +" SET info.birth_date = src.date"
       +" WHERE info.source = src.entity_id"
       //doSql(interpol_red_notices_birth_dates, "interpol_red_notices_birth_dates")

       // TODO no place for this found!
       let interpol_red_notices_birth_places = "UPDATE info ,( SELECT entity_id FROM interpol_red_notices_birth_places ) AS src"
       //+" SET info.birth_place = src.place"
       // +" , info.country_code = src.country_code" ///TODO country codes??
       +" WHERE info.source = src.entity_id"
       ///doSql(interpol_red_notices_birth_places, "interpol red notices birth places");

      
       let interpol_red_notices_nationalities = "UPDATE info ,(SELECT entity_id, country_name, country_code FROM interpol_red_notices_nationalities) AS src"
       +" SET info.nationality = src.country_name"
       +" , info.nationality_code = src.country_code"
       +" WHERE info.source = src.entity_id";
       //doSql(interpol_red_notices_nationalities, "interpol red notices nationalities");


       ///////////////////////////////////////////////
       //////////// kg_fiu_national //////////////////
       ///////////////////////////////////////////////

       let kg_fiu_national = " insert into info ( firstName, lastName, second_name ,source, type, summary,  program,  name, listed_at) "
       + "Select first_name, last_name, second_name, id, type, summary, program,  name, listed_at  FROM kg_fiu_national ";
       //doSql(kg_fiu_national, "kg_fiu_national"); 
      
       let kg_fiu_national_aliases =  "insert into info (source, name) "
       + " SELECT entity_id, name  FROM kg_fiu_national_aliases";
       // doSql(kg_fiu_national_aliases, "kg fiu national aliases");
      
       let kg_fiu_national_birth_dates = "UPDATE info ,( SELECT entity_id, date FROM kg_fiu_national_birth_dates ) AS src"
       +" SET info.birth_date = src.date"
       +" WHERE info.source = src.entity_id"
      // doSql(kg_fiu_national_birth_dates, "kg fiu national birth dates")
    
});

app.get('/info2', (request, response) => { 
   
       //////////////////////////////////////////////////
       ///////////// ua_sdfm_blacklist //////////////////
       /////////////////////////////////////////////////
  
       let ua_sdfm_blacklist = " insert into info (firstName, lastName, second_name , third_name, source, type, summary, program, url, name, title) "
       + "Select first_name, last_name, second_name, third_name ,id, type, summary, program, url, name, title  FROM ua_sdfm_blacklist ";
       //doSql(ua_sdfm_blacklist, "ua sdfm blacklist"); 

       let ua_sdfm_blacklist_addresses = "insert into address (source,  country, country_code, postal_code, note  )  "
       + " SELECT entity_id, country_name, country_code, postal_code, text  FROM ua_sdfm_blacklist_addresses";
       //doSql(ua_sdfm_blacklist_addresses, "ua sdfm blacklist addresses");

       let ua_sdfm_blacklist_aliases =  "insert into info (source, name) "
       + " SELECT entity_id, name  FROM ua_sdfm_blacklist_aliases";
      // doSql(ua_sdfm_blacklist_aliases, "ua sdfm blacklist aliases");
      
      let ua_sdfm_blacklist_birth_dates = "UPDATE info ,( SELECT entity_id, date FROM ua_sdfm_blacklist_birth_dates ) AS src"
      +" SET info.birth_date = src.date"
      +" WHERE info.source = src.entity_id"
      // doSql(ua_sdfm_blacklist_birth_dates, "ua sdfm blacklist birth dates");
     
      let ua_sdfm_blacklist_birth_places = "UPDATE info ,( SELECT entity_id, place FROM ua_sdfm_blacklist_birth_places) AS src"
      +" SET info.birth_place = src.place"
      // +" , info.country_code = src.country_code" ///TODO country codes??
      +" WHERE info.source = src.entity_id"
      //doSql(ua_sdfm_blacklist_birth_places, "ua sdfm blacklist birth places")

      let ua_sdfm_blacklist_identifiers = "UPDATE info ,( SELECT entity_id, description, country_name, country_code, type, number FROM ua_sdfm_blacklist_identifiers) AS src"
      +" SET info.nationality = src.country_name"
      +" , info.nationality_code = src.country_code"
      +" , info.type = src.type"
      +" , info.number = src.number"
      +" WHERE info.source = src.entity_id";
      //doSql(ua_sdfm_blacklist_identifiers, "ua sdfm blacklist identifiers");
    
      let ua_sdfm_blacklist_nationalities =  "UPDATE info ,(SELECT entity_id, country_name, country_code FROM ua_sdfm_blacklist_nationalities) AS src"
      +" SET info.nationality = src.country_name"
      +" , info.nationality_code = src.country_code"
      +" WHERE info.source = src.entity_id";
      //doSql(ua_sdfm_blacklist_nationalities, "ua sdfm blacklist nationalities")
   
      //////////////////////////////
      ////// un_sc_sanctions //////
      /////////////////////////////
       /// TODO updated_at from this table not consider 
      let un_sc_sanctions = " insert into info (firstName,  second_name , third_name, source, type, summary, program, listed_at,  name, title) "
      + "Select first_name, second_name, third_name ,id, type, summary, program, listed_at,   name, title  FROM un_sc_sanctions  ";
     // doSql(un_sc_sanctions, "un sc sanctions")

     let un_sc_sanctions_addresses = "insert into address (source,  country, country_code, note, street, city, region  )  "
     + " SELECT entity_id, country_name, country_code, note, street, city, region  FROM un_sc_sanctions_addresses";
     //doSql(un_sc_sanctions_addresses, "un sc sanctions addresses")
     
     let un_sc_sanctions_aliases =  "insert into info (source, name, quality) "
     + " SELECT entity_id, name, quality  FROM un_sc_sanctions_aliases";
     //doSql(un_sc_sanctions_aliases, "un_sc_sanctions_aliases");

     let un_sc_sanctions_birth_dates = "UPDATE info ,( SELECT entity_id, date, quality FROM un_sc_sanctions_birth_dates) AS src"
     +" SET info.birth_date = src.date"
     +" , info.quality = src.quality"
     +" WHERE info.source = src.entity_id"
     //doSql(un_sc_sanctions_birth_dates, "un_sc_sanctions_birth_dates")

     let un_sc_sanctions_birth_places = "UPDATE info ,( SELECT entity_id, place, country_name, country_code FROM un_sc_sanctions_birth_places) AS src"
     +" SET info.birth_place = src.place"
     +" , info.nationality = src.country_code" ///TODO country codes??
     +" , info.nationality_code = src.country_code"
     +" WHERE info.source = src.entity_id"
     //doSql(un_sc_sanctions_birth_places, "un sc sanctions birth places");
    
     let un_sc_sanctions_identifiers = "UPDATE info ,( SELECT entity_id, description, country_name, country_code, type, number, issued_at FROM un_sc_sanctions_identifiers) AS src"
     +" SET info.nationality = src.country_name"
     +" , info.nationality_code = src.country_code"
     +" , info.type = src.type"
     +" , info.number = src.number"
     +" , info.listed_at = src.issued_at"
     +" , info.description = src.description"
     +" WHERE info.source = src.entity_id";
     //doSql(un_sc_sanctions_identifiers, "un_sc_sanctions_identifiers")

     let un_sc_sanctions_nationalities =  "UPDATE info ,(SELECT entity_id, country_name, country_code FROM un_sc_sanctions_nationalities) AS src"
     +" SET info.nationality = src.country_name"
     +" , info.nationality_code = src.country_code"
     +" WHERE info.source = src.entity_id";
     //doSql(un_sc_sanctions_nationalities, "un sc sanctions nationalities");

      //////////////////////////////
      ////// us_bis_denied /////////
      /////////////////////////////

      let us_bis_denied = " insert into info ( source, type, summary, program, listed_at,  name) "
      + "Select id, type, summary, program, updated_at, name FROM us_bis_denied";
     // doSql(us_bis_denied , "us_bis_denied")

      let us_bis_denied_addresses = "insert into address (source,  country, country_code, street, postal_code, city, region  )  "
      + " SELECT entity_id, country_name, country_code, street, postal_code, city, region  FROM us_bis_denied_addresses";
    //  doSql(us_bis_denied_addresses, "us_bis_denied_addresses");
    })

      let us_cia_world_leaders = "UPDATE info ,( SELECT id, type, program, url, updated_at, name FROM us_cia_world_leaders) AS src"
      +" SET info.name = src.name"
      +" , info.type = src.type"
      +" , info.program = src.program"
      +" , info.url = src.url"
      +" , info.listed_at = src.updated_at"
      +" WHERE info.source = src.id";
      // doSql(us_cia_world_leaders, "us cia world leaders")
     
      let us_cia_world_leaders_nationalities =  "UPDATE info ,(SELECT entity_id, country_name, country_code FROM us_cia_world_leaders_nationalities) AS src"
      +" SET info.nationality = src.country_name"
      +" , info.nationality_code = src.country_code"
      +" WHERE info.source = src.entity_id";
      // doSql(us_cia_world_leaders_nationalities, "us cia world leaders nationalities")
      
      /////////////////////////////
      ///////// us_ofac //////////
      ////////////////////////////

      let us_bis_denied = "insert into info (  source, type, summary, program, listed_at, name) "
      + "Select id, type, summary, program, updated_at, name FROM us_bis_denied";
      //doSql(us_bis_denied, "us_bis_denied")
    
      let us_ofac_addresses = "insert into address (source,  country, country_code, street, street_2, city)"
      + " SELECT entity_id, country_name, country_code, street, street_2, city  FROM us_ofac_addresses ";
      //doSql(us_ofac_addresses, "us ofac addresses")

      let us_ofac_aliases =  "insert into info (source, lastName, quality, type, name, firstName) "
      + " SELECT entity_id, last_name, quality, type, name, first_name  FROM us_ofac_aliases";
      //doSql(us_ofac_aliases, "us ofac aliases")

      let us_ofac_birth_dates = "UPDATE info ,( SELECT entity_id, date, quality FROM us_ofac_birth_dates) AS src"
      +" SET info.birth_date = src.date"
      +" , info.quality = src.quality" ///TODO country codes??
      +" WHERE info.source = src.entity_id"
      //doSql(us_ofac_birth_dates, "us ofac birth dates")
      
      let us_ofac_birth_places = "UPDATE info ,( SELECT entity_id, place, quality FROM us_ofac_birth_places) AS src"
      +" SET info.birth_place = src.place"
      +" , info.quality = src.quality"
      +" WHERE info.source = src.entity_id"
      //doSql(us_ofac_birth_places, "us ofac birth places")

      let us_ofac_identifiers = "UPDATE info ,( SELECT entity_id, description, country_name, country_code, type, number FROM us_ofac_identifiers) AS src"
      +" SET info.nationality = src.country_name"
      +" , info.nationality_code = src.country_code"
      +" , info.type = src.type"
      +" , info.number = src.number"
      +" , info.description = src.description"
      +" WHERE info.source = src.entity_id";
      //doSql(us_ofac_identifiers, "us ofac identifiers")


      //////////////////////////////////////
      /////// worldbank_debarred ///////////
      /////////////////////////////////////

      let worldbank_debarred = "insert into info (  source, program, listed_at, name, url)"
      + "Select id, program, updated_at, name, url FROM worldbank_debarred ";
      //doSql(worldbank_debarred , "worldbank debarred ")

      let worldbank_debarred_addresses = "insert into address (source,  country, country_code, note)"
      + " SELECT entity_id, country_name, country_code, text  FROM worldbank_debarred_addresses";
      //doSql(worldbank_debarred_addresses, "worldbank debarred addresses")

      let worldbank_debarred_aliases = "insert into info (source, name) "
      + " SELECT entity_id, name FROM worldbank_debarred_aliases";
      doSql(worldbank_debarred_aliases, "worldbank debarred aliases")

      let worldbank_debarred_nationalities = "UPDATE info ,(SELECT entity_id, country_name, country_code FROM worldbank_debarred_nationalities) AS src"
      +" SET info.nationality = src.country_name"
      +" , info.nationality_code = src.country_code"
      +" WHERE info.source = src.entity_id";
      doSql(worldbank_debarred_nationalities, "worldbank debarred nationalities")

     

app.listen(
    process.env.PORT  || 3000, ()=>console.log('👽')
)





