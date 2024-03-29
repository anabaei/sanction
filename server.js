//2
  const Express= require('express')
  const app = Express()
  const mysql = require('mysql');
  const bodyParser = require('body-parser');
  const cookieParser = require('cookie-parser');
  const Database = require('./Database.js');
  // new
  // master
  //1
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(cookieParser());
  app.use(bodyParser.json()); // support json encoded bodies
  app.use(bodyParser.urlencoded({ extended: false})); // support encoded bodies
  // Configure our Express app to use ejs as our templating engine
  app.set('view engine', 'ejs'); 
  ///////////////////////////////////////////////////
  //////////////////////// DB  //////////////////////
  ///////////////////////////////////////////////////
  // -u root -h 192.168.2.10 -P 3030 -p
  // let db_config = {
  //   host: "localhost",
  //   user: "root",
  //   password: "password"//,
  //  // database: "aml"
  // }
  // let db_config_sanction = {
  //   host: "localhost",
  //   user: "root",
  //   password: "password",
  //   database: "aml_pro_dev"
  // }

      let db_config = {
        host: "192.168.2.10",
        port: "3030",
        user: "root",
        password: "Glsys2015!"//,
      // database: "aml"
      }

      let db_config_sanction = {
        host: "192.168.2.10",
        port: "3030",
        user: "root",
        password: "Glsys2015!",
        database: "aml_pro_dev"
      }
  
  var connection;
  function handleDisconnect(db_config) {

    connection = mysql.createConnection(db_config); // Recreate the connection, since
                                                    // the old one cannot be reused.
    connection.connect(function(err) {              // The server is either down
      if(err) {                                     // or restarting (takes a while sometimes).
        console.log('error when connecting to db:', err);
        setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
      }                                     // to avoid a hot loop, and to allow our node script to
    });                                     // process asynchronous requests in the meantime.                                          // If you're also serving http, display a 503 error.
    connection.on('error', function(err) {
      console.log('db error', err);
      if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
        handleDisconnect();                         // lost due to either server restart, or a
      } else {                                      // connnection idle timeout (the wait_timeout
        throw err;                                  // server variable configures this)
      }
    });
  }
  

  function dosqltest(table, message)
  {
    handleDisconnect(db_config);
    connection.query(table, function (err, result) 
    {
      if (err) console.log(err);
      else {console.log(message); return true}
    });
  }
  
 
  /////////////////////////////////////////// source /////////////////////////////////////////////
 ///////////////////////////////////////////////////////////////////////////////////////////////////

 
  function dosql_sl(table, message)
  {
    handleDisconnect(db_config);
    connection.query(table, function (err, result) 
    {
      if (err) console.log(err);
      else {console.log(message);}
    });
  }

  /////////////////////////////////////////// SANCTION /////////////////////////////////////////////
 ///////////////////////////////////////////////////////////////////////////////////////////////////
  function dosql_sanction(table, message)
  {
    handleDisconnect(db_config_sanction);
    connection.query(table, function (err, result) 
    {
      if (err) console.log(err);
      else {console.log(message);}
    });
  }

  /////////////////////////////////////////////////////////////////
 ////////////////////////  Truncate TABKES //////////////////////////
 /////////////////////////////////////////////////////////////////

  var truncate_address = "TRUNCATE TABLE aml_pro_dev.address";
  var truncate_info = "TRUNCATE TABLE aml_pro_dev.info";
  var truncate_list = "TRUNCATE TABLE aml_pro_dev.list";

  let set_var = ' SET @defualt := Null ';
  let err_handler_name = ' ALTER TABLE aml_pro_dev.info MODIFY COLUMN name Text CHARACTER SET utf8 COLLATE utf8_general_ci ';
 
  let db_a = new Database(db_config); 
  db_a.query(truncate_info)
  .then( rows => db_a.query(set_var))
  .then( rows=> db_a.query(truncate_list))
  .then( rows => db_a.query(truncate_address), console.log("truncated!"))
  .then( rows => {return db_a.close()}, err => {
    return database.close().then( () => { throw err; } ) })
  .catch( err => {
       console.log("Err = "+ err);
   } )


  /////////////////////////////////////////////////////////////////
 ////////////////////////  CREATE TABKES //////////////////////////
 /////////////////////////////////////////////////////////////////
 let info_table = "insert into aml_pro_dev.info (firstName, lastName, fatherName, name,  source, type, summary, program, url, gender, title, second_name, third_name, listed_at) "
 // + " Select @defualt as firstName, @defualt as LastName, @defualt as fatherName, name as name, id as source, type as type , summary as summary, program as program, @defualt as url, @defualt as gender, @defualt as title, @defualt as second_name, @defualt as third_name, @defualt as listed_at from  union "
 + " SELECT  @defualt as firstName, @defualt as lastName,   @defualt as fatherName,   name as name, id as source, type as type, summary as summary,  program as program, url as url, @defualt as gender, @defualt as title,     @defualt as second_name, @defualt as third_name, @defualt  as listed_at  FROM aml.au_dfat_sanctions  union"
//  + " SELECT first_name as firstName, last_name as lastName, @defualt as fatherName,   name as name, id as source, type as type, summary as summary, @defualt as program, @defualt as url, @defualt as gender, @defualt as title, @defualt as second_name, @defualt as third_name, @defualt  as listed_at  FROM aml.coe_assembly union" 
 + " SELECT first_name as firstName, last_name as lastName, father_name as fatherName, name as name, id as source, type as type, summary as summary, program as program, @defualt as url, @defualt as gender, @defualt as title, @defualt as second_name, @defualt as third_name , @defualt  as listed_at FROM aml.ch_seco_sanctions union" 
 + " SELECT first_name as firstName, last_name as lastName, @defualt as fatherName, @defualt as name, id as source, type as type, summary as summary,@defualt as program, @defualt as url, @defualt as gender, @defualt as title, @defualt as second_name, @defualt as third_name, @defualt  as listed_at FROM aml.eu_meps union" 
 + " SELECT  @defualt as firstName,  @defualt as lastName,  @defualt as fatherName,  name as name, id as source, type as type , @defualt as summary, program as program, @defualt as url,  gender as gender, @defualt as title,   @defualt as second_name, @defualt as third_name, @defualt  as listed_at FROM aml.everypolitician union "             
 + " SelECT first_name as first_name, last_name as lastName,@defualt as fatherName,  name as name, id as source, type as type, @defualt as summary, program as program, @defualt as url, @defualt as gender, title as title,     second_name as second_name, third_name as third_name, @defualt as listed_at  FROM aml.gb_hmt_sanctions  union"                                                                                                               
 + " SeLECT first_name  as firstName, last_name as lastName, @defualt as fatherName, name as name, id as source, type as type, summary as summary, program as program, url as url,     gender as gender,    @defualt as title,   @defualt as second_name, @defualt as third_name, @defualt  as listed_at  FROM aml.interpol_red_notices  union" 
 + " SELECT first_name as first_name, last_name as lastName,@defualt as fatherName,  name as name, id as source, type as type, summary as summary, program as program, @defualt as url,  @defualt as gender, @defualt as title, second_name as second_name, @defualt as third_name, listed_at as listed_at FROM aml.kg_fiu_national union"
 + " SELECT first_name as firstName, last_name as lastName, @defualt as fatherName,  name as name, id as source, type as type, summary as summary, program as program, url as url,      @defualt as gender, @defualt as title, second_name as second_name,third_name as third_name,  @defualt as listed_at FROM aml.ua_sdfm_blacklist union" 
 + " SELECT first_name as firstName, @defualt as lastName,  @defualt as fatherName,  name as name, id as source, type as type, summary as summary, program as program, @defualt as url, @defualt as gender,  title as title , second_name as second_name,third_name as third_name,listed_at as listed_at  FROM aml.un_sc_sanctions union" 
 + " SELECT @defualt as firstName, @defualt as LastName,    @defualt as fatherName,  name as name, id as source, type as type ,summary as summary, program as program, @defualt as url, @defualt as gender, @defualt as title, @defualt as second_name, @defualt as third_name, updated_at as listed_at from aml.us_bis_denied union "
 + " SELECT @defualt as firstName, @defualt as LastName,    @defualt as fatherName,  name as name, id as source, type as type , @defualt as summary, program as program, @defualt as url, @defualt as gender, @defualt as title, @defualt as second_name, @defualt as third_name, updated_at as listed_at from aml.us_ofac union "
 + " SELECT first_name as firstName, last_name as LastName, @defualt as fatherName,  name as name, id as source, type as type , summary as summary, program as program, url as url, gender as gender, title as title, second_name as second_name, @defualt as third_name, updated_at as listed_at FROM aml.eu_eeas_sanctions union "
 + " SELECT first_name as firstName, last_name as LastName, @defualt as fatherName,  name as name, id as source, type as type , summary as summary, @defualt as program, @defualt as url, @defualt as gender, @defualt as title, @defualt as second_name, @defualt as third_name, @defualt as listed_at FROM aml.ca_dfatd_sema_sanctions union "
 + " SELECT @defualt as firstName, @defualt as LastName, @defualt as fatherName,  name as name, id as source, @defualt as type , @defualt as summary, program as program, url as url, @defualt as gender, @defualt as title, @defualt as second_name, @defualt as third_name, updated_at as listed_at FROM aml.worldbank_debarred union "
 + " SELECT @defualt as firstName, @defualt as LastName, @defualt as fatherName, name as name, id as source, @defualt as type ,@defualt as summary, program as program, url as url, @defualt as gender, @defualt as title, @defualt as second_name, @defualt as third_name, updated_at as listed_at from aml.worldbank_debarred ";

     ///// insert from sanction address into address table ///////

     let au_dfat_address = "insert into aml_pro_dev.address (source,  note)"
     + " SELECT entity_id, text FROM aml.au_dfat_sanctions_addresses "
     + "ON DUPLICATE KEY UPDATE"
     + " aml_pro_dev.address.note = aml_pro_dev.address.note";
     //dosql(au_dfat_address, "insert from sanction address");
     //// Just add to that then we specifies aliases ////


     let au_dfat_sanctions_aliases  = "insert into aml_pro_dev.info (name, source, alias)"
     + " SELECT name, entity_id, true FROM aml.au_dfat_sanctions_aliases";

     // let  update_alias = "update aml_pro_dev.info ,(select id, source from aml_pro_dev.info where alias = false) as src set aml_pro_dev.info.parent = src.id where aml_pro_dev.info.source = src.source";


     let birth_date = "UPDATE aml_pro_dev.info ,( SELECT entity_id, date FROM aml.au_dfat_sanctions_birth_dates ) AS src"
     +" SET aml_pro_dev.info.birth_date = src.date"
     +" WHERE aml_pro_dev.info.source = src.entity_id AND src.date IS NOT NULL"
     //dosql(birth_date , "info birth date updated");


     let birth_place = "UPDATE aml_pro_dev.info ,( SELECT entity_id, place FROM aml.au_dfat_sanctions_birth_places bd ) AS src"
     +" SET aml_pro_dev.info.birth_place = src.place"
     +" WHERE aml_pro_dev.info.source = src.entity_id AND src.place IS NOT NULL"
     // dosql(birth_place , "info birth place updated");


     let country = "UPDATE aml_pro_dev.info ,( SELECT entity_id, country_name, country_code FROM aml.au_dfat_sanctions_nationalities) AS src"
     +" SET aml_pro_dev.info.nationality = src.country_name"
     +" , aml_pro_dev.info.nationality_code = src.country_code"
     +" WHERE aml_pro_dev.info.source = src.entity_id AND src.country_name IS NOT NULL"
     //dosql(country , "info country updated");


       /////////////////////////// 
       ///// ch_seco sanction/////
       /////////////////////////// 

     let ch_seco_sanctions_addresses = " insert aml_pro_dev.address (source,  note, street, street_2, postal_code, country, country_code, region  )  "
     + " SELECT entity_id, text, street, street_2, postal_code, country_name, country_code, region  FROM aml.ch_seco_sanctions_addresses "
     + " ON DUPLICATE KEY update"
     + "   aml_pro_dev.address.note  = aml_pro_dev.address.note ";
     // dosql(ch_seco_sanctions_addresses, "insert from ch_seco_sanctions_addresses ");

     let ch_seco_sanctions_aliases  = "insert into aml_pro_dev.info (firstName, lastName, fatherName, name, source , quality, title, second_name, third_name, alias)"
     + " SELECT first_name, last_name, father_name, name, entity_id, quality, title, second_name, third_name , true FROM aml.ch_seco_sanctions_aliases ";
     // dosql(ch_seco_sanctions_aliases , " aliases inserted");

     let everypolitician_aliases  = "insert into aml_pro_dev.info (name,  source, alias)"
     + " SELECT name, entity_id, true  FROM aml.everypolitician_aliases";

     // let ch_seco_sanctions_aliases_cluster  = "insert into aml_pro_dev.info_cluster (firstName, lastName, fatherName, name, source , quality, title, second_name, third_name, alias)"
     // + " SELECT first_name, last_name, father_name, name, entity_id, quality, title, second_name, third_name , true FROM aml.ch_seco_sanctions_aliases ";
     // dosql(ch_seco_sanctions_aliases_cluster  , " aliases cluster inserted");

     let ch_seco_birth_date = "UPDATE aml_pro_dev.info ,( SELECT entity_id, date FROM aml.ch_seco_sanctions_birth_dates ) AS src"
     +" SET aml_pro_dev.info.birth_date = src.date"
     +" WHERE aml_pro_dev.info.source = src.entity_id AND src.date IS NOT NULL"
     // dosql(ch_seco_birth_date , "info birth date updated from ch_seco_birth_date");

     let ch_seco_sanctions_birth_places = "UPDATE aml_pro_dev.info ,( SELECT entity_id, place, quality FROM aml.ch_seco_sanctions_birth_places ) AS src"
     +" SET aml_pro_dev.info.birth_place = src.place"
     +", aml_pro_dev.info.quality = src.quality"
     +" WHERE aml_pro_dev.info.source = src.entity_id AND src.place IS NOT NULL"
     //dosql(ch_seco_sanctions_birth_places , "ch seco sanctions birth places ");

     let ch_seco_sanctions_identifiers = "UPDATE aml_pro_dev.info ,( SELECT entity_id, country_name, country_code, type, description, number FROM aml.ch_seco_sanctions_identifiers) AS src"
     +" SET aml_pro_dev.info.nationality = src.country_name"
     +" , aml_pro_dev.info.nationality_code = src.country_code"
     +" , aml_pro_dev.info.type = src.type"
     +" , aml_pro_dev.info.description = src.description"
     +" , aml_pro_dev.info.number = src.number"
     +" WHERE aml_pro_dev.info.source = src.entity_id AND src.country_name IS NOT NULL"


     //let update_alias_im = "update aml_pro_dev.info ,(select id, source from aml_pro_dev.info where alias = true ) as src set aml_pro_dev.info.parent = src.id where aml_pro_dev.info.source = src.source AND aml_pro_dev.info.alias = true ";

     let updateSanctionList = "insert into aml_pro_dev.list (name,source) SELECT source as name,id as source FROM aml.au_dfat_sanctions  union "
    +" SELECT source as name, id as source FROM aml.ch_seco_sanctions union"
    +" SELECT source as name, id as source FROM aml.everypolitician union"
    +" SELECT source as name, id as source FROM aml.interpol_red_notices union"
    +" SELECT source as name, id as source FROM aml.eu_meps union"
    +" SELECT source as name, id as source FROM aml.gb_hmt_sanctions union"
    +" SELECT source as name, id as source FROM aml.us_ofac union"
    +" SELECT source as name, id as source FROM aml.kg_fiu_national union"
    +" SELECT source as name, id as source FROM aml.ua_sdfm_blacklist union"
    +" SELECT source as name, id as source FROM aml.un_sc_sanctions union"
    +" SELECT source as name, id as source FROM aml.worldbank_debarred union"
    +" SELECT source as name, id as source FROM aml.eu_eeas_sanctions union"
    +" SELECT source as name, id as source FROM aml.ca_dfatd_sema_sanctions union "
    +" SELECT source as name, id as source FROM aml.us_bis_denied"
   
    //+" SELECT source as name,id as source FROM aml.worldbank_debarred"  
    +" ON DUPLICATE KEY update"
    + " aml_pro_dev.list.name = aml_pro_dev.list.name"; 


        //////////////////////////// 
        ///// coe_assembly   ///////
        //////////////////////////// 

      
          //// TODO: cluster the selection ? ////
        let coe_assembly_nationalitiescountry = "UPDATE aml_pro_dev.info ,( SELECT entity_id, country_name, country_code FROM aml.coe_assembly_nationalities) AS src"
        +" SET aml_pro_dev.info.nationality = src.country_name"
        +" , aml_pro_dev.info.nationality_code = src.country_code"
        +" WHERE aml_pro_dev.info.source = src.entity_id AND src.country_name IS NOT NULL"
        //dosql(coe_assembly_nationalitiescountry , "info country coe_assembly_nationalitiescountry");


        ///////////////////////////// 
        ///////  eu_meps   /////////
        ////////////////////////////
      

        //// TODO : cluster? ///
        let eu_meps_nationalities = "UPDATE aml_pro_dev.info ,( SELECT entity_id, country_name, country_code FROM aml.eu_meps_nationalities) AS src"
        +" SET aml_pro_dev.info.nationality = src.country_name"
        +" , aml_pro_dev.info.nationality_code = src.country_code"
        +" WHERE aml_pro_dev.info.source = src.entity_id AND src.country_name IS NOT NULL ";
       // dosql(eu_meps_nationalities, " eu_meps_nationalities");

        /////////////////////////////////// 
        ///////  everypolitician  /////////
        /////////////////////////////////// 
        
 
       
       // dosql(everypolitician_aliases, "everypolitician_aliases");
       
        let everypolitician_nationalities = "UPDATE aml_pro_dev.info ,(SELECT entity_id, country_name, country_code FROM aml.everypolitician_nationalities) AS src"
        +" SET aml_pro_dev.info.nationality = src.country_name"
        +" , aml_pro_dev.info.nationality_code = src.country_code"
        +" WHERE aml_pro_dev.info.source = src.entity_id AND src.country_name IS NOT NULL";
       // dosql(everypolitician_nationalities, "everypolitician_nationalities");

        ////////////////////////////////////// 
        ///////   gb_hmt_sanctions  /////////
        ///////////////////////////////////// 
       

        let gb_hmt_sanctions_addresses = "insert into aml_pro_dev.address (source, country, country_code, postal_code, note  )  "
        + " SELECT entity_id, country_name, country_code, postal_code, text  FROM aml.gb_hmt_sanctions_addresses "
        + " ON DUPLICATE KEY update"
        + " aml_pro_dev.address.note  = aml_pro_dev.address.note ";
        //dosql(gb_hmt_sanctions_addresses, "gb_hmt_sanctions_addresses");
      

       /// TODO Cluster? ///
        let gb_hmt_sanctions_aliases = "insert into aml_pro_dev.info (firstName, second_name, title, lastName,  source, third_name, name, type, alias )   "
        + " SELECT first_name, second_name, title, last_name, entity_id, third_name, name, type, true  FROM aml.gb_hmt_sanctions_aliases";
        //dosql_sl(gb_hmt_sanctions_aliases, "gb_hmt_sanctions_aliases");

        let gb_hmt_sanctions_birth_dates = "UPDATE aml_pro_dev.info ,( SELECT entity_id, date FROM aml.gb_hmt_sanctions_birth_dates ) AS src"
        +" SET aml_pro_dev.info.birth_date = src.date"
        +" WHERE aml_pro_dev.info.source = src.entity_id AND src.date IS NOT NULL"
       //dosql(gb_hmt_sanctions_birth_dates, "gb_hmt_sanctions_birth_dates");

        let gb_hmt_sanctions_birth_places = "UPDATE aml_pro_dev.info ,( SELECT entity_id, country_name, country_code, place FROM aml.gb_hmt_sanctions_birth_places ) AS src"
        +" SET aml_pro_dev.info.birth_place = src.place"
        +" , aml_pro_dev.info.nationality_code = src.country_code" ///TODO country codes??
        +" WHERE aml_pro_dev.info.source = src.entity_id AND src.place IS NOT NULL"
        //dosql(gb_hmt_sanctions_birth_places, "gb_hmt_sanctions_birth_places");

        //// TODO : clsuter?
        let gb_hmt_sanctions_identifiers = "UPDATE aml_pro_dev.info ,( SELECT entity_id, country_name, country_code, type, number FROM aml.gb_hmt_sanctions_identifiers) AS src"
          +" SET aml_pro_dev.info.nationality = src.country_name"
          +" , aml_pro_dev.info.nationality_code = src.country_code"
          +" , aml_pro_dev.info.type = src.type"
          +" , aml_pro_dev.info.number = src.number"
          +" WHERE aml_pro_dev.info.source = src.entity_id AND src.country_name IS NOT NULL"
        //  dosql(gb_hmt_sanctions_identifiers, "gb_hmt_sanctions_identifiers");

       let gb_hmt_sanctions_nationalities = "UPDATE aml_pro_dev.info ,(SELECT entity_id, country_name, country_code FROM aml.gb_hmt_sanctions_nationalities) AS src"
        +" SET aml_pro_dev.info.nationality = src.country_name"
        +" , aml_pro_dev.info.nationality_code = src.country_code"
        +" WHERE aml_pro_dev.info.source = src.entity_id AND src.country_name IS NOT NULL";
       // dosql(gb_hmt_sanctions_nationalities, "gb_hmt_sanctions_nationalities");


       ////////////////////////////////////////////
       ////////// ca_dfatd_sema_sanctions /////////
       ////////////////////////////////////////////

       let ca_dfatd_sema_sanctions_aliases = "INSERT INTO aml_pro_dev.info( source, name, alias) "
       + " SELECT entity_id, name, true FROM aml.ca_dfatd_sema_sanctions_aliases ";
       
       let ca_dfatd_sema_sanctions_birth_dates = " UPDATE  aml_pro_dev.info ,( SELECT entity_id, date, quality FROM aml.ca_dfatd_sema_sanctions_birth_dates) AS src"
       +" SET aml_pro_dev.info.birth_date = src.date"
       +" , aml_pro_dev.info.quality = src.quality"
       +" WHERE aml_pro_dev.info.source = src.entity_id AND src.date IS NOT NULL"

      let  ca_dfatd_sema_sanctions_nationalities = "UPDATE aml_pro_dev.info ,(SELECT entity_id, country_name, country_code FROM  aml.ca_dfatd_sema_sanctions_nationalities) AS src"
      +" SET aml_pro_dev.info.nationality = src.country_name"
      +" , aml_pro_dev.info.nationality_code = src.country_code"
      +" WHERE aml_pro_dev.info.source = src.entity_id AND src.country_name IS NOT NULL ";
        //////////////////////////////////////////////
        /////////////// eu_eeas_sanctions ////////////
        //////////////////////////////////////////////

        let eu_eeas_sanctions_aliases = "INSERT INTO aml_pro_dev.info( source, name, alias, title, firstName, lastName, second_name) "
        + " SELECT entity_id, name, true, title, first_name, last_name, second_name FROM aml.eu_eeas_sanctions_aliases ";

        let eu_eeas_sanctions_birth_dates = " UPDATE  aml_pro_dev.info ,( SELECT entity_id, date FROM aml.eu_eeas_sanctions_birth_dates ) AS src"
        +" SET aml_pro_dev.info.birth_date = src.date"
        +" WHERE aml_pro_dev.info.source = src.entity_id AND src.date IS NOT NULL"

        let eu_eeas_sanctions_birth_places = "UPDATE aml_pro_dev.info ,( SELECT entity_id, country_name, country_code, place FROM aml.eu_eeas_sanctions_birth_places ) AS src"
        +" SET aml_pro_dev.info.birth_place = src.place "
        +" , aml_pro_dev.info.nationality_code = src.country_code"
        +" , aml_pro_dev.info.nationality = src.country_name"
        +" WHERE aml_pro_dev.info.source = src.entity_id AND src.place IS NOT NULL"
        
        let eu_eeas_sanctions_identifiers = "UPDATE aml_pro_dev.info ,( SELECT entity_id, country_name, country_code, type, number FROM aml.eu_eeas_sanctions_identifiers) AS src"
        +" SET aml_pro_dev.info.nationality = src.country_name"
        +" , aml_pro_dev.info.nationality_code = src.country_code"
        +" , aml_pro_dev.info.type = src.type"
        +" , aml_pro_dev.info.number = src.number"
        +" WHERE aml_pro_dev.info.source = src.entity_id AND src.country_name IS NOT NULL AND src.country_code IS NOT NULL ";

        let eu_eeas_sanctions_nationalities = "UPDATE aml_pro_dev.info ,(SELECT entity_id, country_name, country_code FROM  aml.eu_eeas_sanctions_nationalities) AS src"
        +" SET aml_pro_dev.info.nationality = src.country_name"
        +" , aml_pro_dev.info.nationality_code = src.country_code"
        +" WHERE aml_pro_dev.info.source = src.entity_id AND src.country_name IS NOT NULL ";

        let eu_eeas_sanctions_addresses = "INSERT INTO aml_pro_dev.address (source, country, country_code, postal_code, city, street, street_2) "
        + " SELECT entity_id, country_name, country_code, postal_code, city, street, street_2 FROM aml.eu_eeas_sanctions_addresses "
        + " ON DUPLICATE KEY update"
        + " aml_pro_dev.address.city = aml_pro_dev.address.city ";
        // let eu_eeas_sanctions_identifiers = ""
        /////////////////////////////////////////////
        ////////////   Ineterpol ///////////////////
        ////////////////////////////////////////////

        
        let interpol_red_notices_aliases = "insert into aml_pro_dev.info (source, name, alias) "
        + " SELECT entity_id, name, true FROM aml.interpol_red_notices_aliases";
        //dosql(interpol_red_notices_aliases, "interpol red notices aliases");
       
       let interpol_red_notices_birth_dates = "UPDATE aml_pro_dev.info ,( SELECT entity_id, date FROM aml.interpol_red_notices_birth_dates ) AS src"
       +" SET aml_pro_dev.info.birth_date = src.date"
       +" WHERE aml_pro_dev.info.source = src.entity_id AND src.date IS NOT NULL"
       //dosql(interpol_red_notices_birth_dates, "interpol_red_notices_birth_dates")

       // TODO This table has only entity column!
       let interpol_red_notices_birth_places = "UPDATE aml_pro_dev.info ,( SELECT entity_id FROM aml.interpol_red_notices_birth_places ) AS src"
       //+" SET aml_pro_dev.info.birth_place = src.place"
       // +" , info.country_code = src.country_code" ///TODO country codes??
      // +" WHERE aml_pro_dev.info.source = src.entity_id AND src.place IS NOT NULL"
       //dosql(interpol_red_notices_birth_places, "interpol red notices birth places");

      
       let interpol_red_notices_nationalities = "UPDATE aml_pro_dev.info ,(SELECT entity_id, country_name, country_code FROM  aml.interpol_red_notices_nationalities) AS src"
       +" SET aml_pro_dev.info.nationality = src.country_name"
       +" , aml_pro_dev.info.nationality_code = src.country_code"
       +" WHERE aml_pro_dev.info.source = src.entity_id AND src.country_name IS NOT NULL";
       //dosql(interpol_red_notices_nationalities, "interpol red notices nationalities");


       ///////////////////////////////////////////////
       //////////// kg_fiu_national //////////////////
       ///////////////////////////////////////////////
    

     //  let kg_fiu_national = " insert into aml_pro_dev.info ( firstName, lastName, second_name ,source, type, summary,  program,  name, listed_at) "
     //  + "Select first_name, last_name, second_name, id, type, summary, program,  name, listed_at  FROM aml.kg_fiu_national ";
       //dosql(kg_fiu_national, "kg_fiu_national");
       
      
       let kg_fiu_national_aliases =  "insert into aml_pro_dev.info (source, name, alias) "
       + " SELECT entity_id, name, true FROM aml.kg_fiu_national_aliases";
       //dosql(kg_fiu_national_aliases, "kg fiu national aliases");
      
       let kg_fiu_national_birth_dates = "UPDATE aml_pro_dev.info ,( SELECT entity_id, date FROM aml.kg_fiu_national_birth_dates ) AS src"
       +" SET aml_pro_dev.info.birth_date = src.date"
       +" WHERE aml_pro_dev.info.source = src.entity_id AND src.date IS NOT NULL"
      // dosql(kg_fiu_national_birth_dates, "kg fiu national birth dates")


      //  let ua_sdfm_blacklist = " insert into aml_pro_dev.info (firstName, lastName, second_name , third_name, source, type, summary, program, url, name, title) "
     //  + "Select first_name, last_name, second_name, third_name ,id, type, summary, program, url, name, title  FROM aml.ua_sdfm_blacklist ";
       //dosql(ua_sdfm_blacklist, "ua sdfm blacklist"); 

    //   let ua_sdfm_blacklist_cluster = " insert into aml_pro_dev.info_cluster (firstName, lastName, second_name , third_name, source, type, summary, program, url, name, title) "
    //   + "Select first_name, last_name, second_name, third_name ,id, type, summary, program, url, name, title  FROM aml.ua_sdfm_blacklist ";
       //dosql(ua_sdfm_blacklist_cluster, "ua sdfm blacklist_cluster"); 

       let ua_sdfm_blacklist_addresses = "insert into aml_pro_dev.address (source,note) "
       + " SELECT entity_id, text  FROM aml.ua_sdfm_blacklist_addresses "
       + " ON DUPLICATE KEY update"
       + " aml_pro_dev.address.note  = aml_pro_dev.address.note ";
       //dosql(ua_sdfm_blacklist_addresses, "ua sdfm blacklist addresses");

       // TODO change name type to TEXT in info table
       let ua_sdfm_blacklist_aliases =  "insert into aml_pro_dev.info (source, name, alias) "
       + " SELECT entity_id, name, true  FROM aml.ua_sdfm_blacklist_aliases ";
       //dosql(ua_sdfm_blacklist_aliases, "ua sdfm blacklist aliases");
      
      let ua_sdfm_blacklist_birth_dates = "UPDATE aml_pro_dev.info ,( SELECT entity_id, date FROM aml.ua_sdfm_blacklist_birth_dates ) AS src"
      +" SET aml_pro_dev.info.birth_date = src.date"
      +" WHERE aml_pro_dev.info.source = src.entity_id  AND src.date IS NOT NULL "
      //dosql(ua_sdfm_blacklist_birth_dates, "ua sdfm blacklist birth dates");
     
      let ua_sdfm_blacklist_birth_places = "UPDATE aml_pro_dev.info ,( SELECT entity_id, place FROM aml.ua_sdfm_blacklist_birth_places) AS src"
      +" SET aml_pro_dev.info.birth_place = src.place"
      // +" , info.country_code = src.country_code" ///TODO country codes??
      +" WHERE aml_pro_dev.info.source = src.entity_id  AND src.place IS NOT NULL"
       //dosql(ua_sdfm_blacklist_birth_places, "ua sdfm blacklist birth places")

      let ua_sdfm_blacklist_identifiers = "UPDATE aml_pro_dev.info ,( SELECT entity_id, description, country_name, country_code, type, number FROM aml.ua_sdfm_blacklist_identifiers) AS src"
      +" SET aml_pro_dev.info.nationality = src.country_name"
      +" , aml_pro_dev.info.nationality_code = src.country_code"
      +" , aml_pro_dev.info.type = src.type"
      +" , aml_pro_dev.info.number = src.number"
      +" WHERE aml_pro_dev.info.source = src.entity_id  AND src.country_name IS NOT NULL";
       //dosql(ua_sdfm_blacklist_identifiers, "ua sdfm blacklist identifiers");
    
      let ua_sdfm_blacklist_nationalities =  "UPDATE aml_pro_dev.info ,(SELECT entity_id, country_name, country_code FROM aml.ua_sdfm_blacklist_nationalities) AS src"
      +" SET aml_pro_dev.info.nationality = src.country_name"
      +" , aml_pro_dev.info.nationality_code = src.country_code"
      +" WHERE aml_pro_dev.info.source = src.entity_id  AND src.country_name IS NOT NULL";
       //dosql(ua_sdfm_blacklist_nationalities, "ua sdfm blacklist nationalities")
   
      //////////////////////////////
      ////// un_sc_sanctions //////
      /////////////////////////////


     let un_sc_sanctions_addresses = " insert into aml_pro_dev.address (source,  country, country_code, note, street, city, region  )  "
     + " SELECT entity_id, country_name, country_code, note, street, city, region  FROM aml.un_sc_sanctions_addresses "
     + " ON DUPLICATE KEY update"
     + " aml_pro_dev.address.country  = aml_pro_dev.address.country ";
     //dosql(un_sc_sanctions_addresses, "un sc sanctions addresses")
     
     let un_sc_sanctions_aliases =  "insert into aml_pro_dev.info (source, name, quality, alias) "
     + " SELECT entity_id, name, quality, true  FROM aml.un_sc_sanctions_aliases";
     //dosql(un_sc_sanctions_aliases, "un_sc_sanctions_aliases");

     let un_sc_sanctions_birth_dates = "UPDATE aml_pro_dev.info ,( SELECT entity_id, date, quality FROM aml.un_sc_sanctions_birth_dates) AS src"
     +" SET aml_pro_dev.info.birth_date = src.date"
     +" , aml_pro_dev.info.quality = src.quality"
     +" WHERE aml_pro_dev.info.source = src.entity_id AND src.date IS NOT NULL "
     //dosql(un_sc_sanctions_birth_dates, "un_sc_sanctions_birth_dates")

     let un_sc_sanctions_birth_places = "UPDATE aml_pro_dev.info ,( SELECT entity_id, place, country_name, country_code FROM aml.un_sc_sanctions_birth_places) AS src"
     +" SET aml_pro_dev.info.birth_place = src.place"
     +" , aml_pro_dev.info.nationality = src.country_code" ///TODO country codes??
     +" , aml_pro_dev.info.nationality_code = src.country_code"
     +" WHERE aml_pro_dev.info.source = src.entity_id AND src.place IS NOT NULL"
     //dosql(un_sc_sanctions_birth_places, "un sc sanctions birth places");
    
     let un_sc_sanctions_identifiers = "UPDATE aml_pro_dev.info ,( SELECT entity_id, description, country_name, country_code, type, number, issued_at FROM aml.un_sc_sanctions_identifiers) AS src"
     +" SET aml_pro_dev.info.nationality = src.country_name"
     +" , aml_pro_dev.info.nationality_code = src.country_code"
     +" , aml_pro_dev.info.type = src.type"
     +" , aml_pro_dev.info.number = src.number"
     +" , aml_pro_dev.info.listed_at = src.issued_at"
     +" , aml_pro_dev.info.description = src.description"
     +" WHERE aml_pro_dev.info.source = src.entity_id AND src.country_name IS NOT NULL";
     //dosql(un_sc_sanctions_identifiers, "un_sc_sanctions_identifiers")

     let un_sc_sanctions_nationalities =  "UPDATE aml_pro_dev.info ,(SELECT entity_id, country_name, country_code FROM aml.un_sc_sanctions_nationalities) AS src"
     +" SET aml_pro_dev.info.nationality = src.country_name"
     +" , aml_pro_dev.info.nationality_code = src.country_code"
     +" WHERE aml_pro_dev.info.source = src.entity_id AND src.country_name IS NOT NULL"
     
      //dosql(un_sc_sanctions_nationalities, "un sc sanctions nationalities");

      //////////////////////////////
      ////// us_bis_denied /////////
      /////////////////////////////


      let us_bis_denied_addresses = "insert into aml_pro_dev.address (source, country, country_code, street, postal_code, city, region  )  "
      + " SELECT entity_id, country_name, country_code, street, postal_code, city, region  FROM aml.us_bis_denied_addresses";
      + " ON DUPLICATE KEY update"
      + " aml_pro_dev.address.country  = aml_pro_dev.address.country ";
      //dosql(us_bis_denied_addresses, "us_bis_denied_addresses");
    

      let us_cia_world_leaders = "UPDATE aml_pro_dev.info ,( SELECT id, type, program, url, updated_at, name FROM aml.us_cia_world_leaders) AS src"
      +" SET aml_pro_dev.info.name = src.name"
      +" , aml_pro_dev.info.type = src.type"
      +" , aml_pro_dev.info.program = src.program"
      +" , aml_pro_dev.info.url = src.url"
      +" , aml_pro_dev.info.listed_at = src.updated_at"
      +" WHERE aml_pro_dev.info.source = src.id AND src.name IS NOT NULL";
      //dosql(us_cia_world_leaders, "us cia world leaders")
     
      let us_cia_world_leaders_nationalities =  "UPDATE aml_pro_dev.info ,(SELECT entity_id, country_name, country_code FROM aml.us_cia_world_leaders_nationalities) AS src"
      +" SET aml_pro_dev.info.nationality = src.country_name"
      +" , aml_pro_dev.info.nationality_code = src.country_code"
      +" WHERE aml_pro_dev.info.source = src.entity_id AND src.country_name IS NOT NULL";
      //dosql(us_cia_world_leaders_nationalities, "us cia world leaders nationalities")
      
      /////////////////////////////
      ///////// us_ofac //////////
      ////////////////////////////

    
      let us_ofac_addresses = "insert into aml_pro_dev.address (source,  country, country_code, street, street_2, city)"
      + " SELECT entity_id, country_name, country_code, street, street_2, city  FROM aml.us_ofac_addresses "
      + " ON DUPLICATE KEY update"
      + " aml_pro_dev.address.country = aml_pro_dev.address.country ";
      //dosql(us_ofac_addresses, "us ofac addresses")

      let us_ofac_aliases =  "insert into aml_pro_dev.info (source, lastName, quality, type, name, firstName, alias) "
      + " SELECT entity_id, last_name, quality, type, name, first_name, true  FROM aml.us_ofac_aliases";
      //dosql(us_ofac_aliases, "us ofac aliases")

      let us_ofac_birth_dates = "UPDATE aml_pro_dev.info ,( SELECT entity_id, date, quality FROM aml.us_ofac_birth_dates) AS src"
      +" SET aml_pro_dev.info.birth_date = src.date"
      +" , aml_pro_dev.info.quality = src.quality" ///TODO country codes??
      +" WHERE aml_pro_dev.info.source = src.entity_id AND src.date IS NOT NULL"
      //dosql(us_ofac_birth_dates, "us ofac birth dates")
      
      let us_ofac_birth_places = "UPDATE aml_pro_dev.info ,( SELECT entity_id, place, quality FROM aml.us_ofac_birth_places) AS src"
      +" SET aml_pro_dev.info.birth_place = src.place"
      +" , aml_pro_dev.info.quality = src.quality"
      +" WHERE aml_pro_dev.info.source = src.entity_id AND src.place IS NOT NULL"
      //dosql(us_ofac_birth_places, "us ofac birth places")
 
      let us_ofac_identifiers= "UPDATE aml_pro_dev.info ,( SELECT entity_id, description, country_name, country_code, type, number FROM aml.us_ofac_identifiers) AS src"
      +" SET aml_pro_dev.info.nationality = src.country_name"
      +" , aml_pro_dev.info.nationality_code = src.country_code"
      +" , aml_pro_dev.info.type = src.type"
      +" , aml_pro_dev.info.number = src.number"
      +" , aml_pro_dev.info.description = src.description"
      +" WHERE aml_pro_dev.info.source = src.entity_id AND src.country_name IS NOT NULL";
      //dosql(us_ofac_identifiers, "us ofac identifiers")


      //////////////////////////////////////
      /////// worldbank_debarred ///////////
      /////////////////////////////////////
      
      let worldbank_debarred = "insert into aml_pro_dev.info (source, program, listed_at, name, url)"
      + "Select id, program, updated_at, name, url FROM aml.worldbank_debarred ";
      //dosql(worldbank_debarred , "worldbank debarred ")


      let worldbank_debarred_addresses = "insert into aml_pro_dev.address (source,  country, country_code, note) "
      + " SELECT entity_id, country_name, country_code, text  FROM aml.worldbank_debarred_addresses "
      + " ON DUPLICATE KEY update"
      + " aml_pro_dev.address.country = aml_pro_dev.address.country ";
      //dosql(worldbank_debarred_addresses, "worldbank debarred addresses")

      let worldbank_debarred_aliases = "insert into aml_pro_dev.info (source, name, alias) "
      + " SELECT entity_id, name, true FROM aml.worldbank_debarred_aliases";
      //dosql(worldbank_debarred_aliases, "worldbank debarred aliases")

      let worldbank_debarred_nationalities = "UPDATE aml_pro_dev.info ,(SELECT entity_id, country_name, country_code FROM aml.worldbank_debarred_nationalities) AS src"
      +" SET aml_pro_dev.info.nationality = src.country_name"
      +" , aml_pro_dev.info.nationality_code = src.country_code"
      +" WHERE aml_pro_dev.info.source = src.entity_id AND src.country_name IS NOT NULL";
      //dosql(worldbank_debarred_nationalities, "worldbank debarred nationalities")
 
     let update_alias = "update aml_pro_dev.info ,(select id, source from aml_pro_dev.info) as src set aml_pro_dev.info.parent = src.id "
     + " where aml_pro_dev.info.source = src.source  AND aml_pro_dev.info.id != src.id AND aml_pro_dev.info.alias = true ";
      

     let update_info_id =  " UPDATE aml_pro_dev.address ,(select id, source from aml_pro_dev.info) AS src SET aml_pro_dev.address.info_id = src.id WHERE aml_pro_dev.address.source = src.source ";
     let update_list_id = "  UPDATE aml_pro_dev.info ,( Select id, name from aml_pro_dev.list) AS src SET aml_pro_dev.info.list_id = src.id WHERE aml_pro_dev.info.source LIKE  CONCAT('%',src.name,'%')"; 
     

  //     let db_db = new Database(db_config); 
  
  //     db_db.query(err_handler_name)
     

  //   .then(rows => db_db.query(info_table))
  //   // .then( rows=> db_db.query(update_alias_im))
     
  //    .then( rows => db_db.query(au_dfat_address)) 
  //  //   .then( rows => db.query(everypolitician_aliases)) 
  //    .then( rows => db_db.query(au_dfat_sanctions_aliases)) 
  //    .then( rows => db_db.query(update_alias)) 
  //    .then( rows => db_db.query(birth_date)) 
  //    .then( rows => db_db.query(birth_place)) 
  
 
  //  //  .then( rows => db_db.query(ch_seco_sanctions_addresses)) // HERE WE GET ERRORc= about utf8 fristName TODO
  //    .catch( err => {
  //     console.log("Err = "+ err);
  // } )
  //    .then( rows => db_db.query(ch_seco_sanctions_aliases))
  //  //  .then( rows => db.query(ch_seco_sanctions_aliases_cluster))
  //    .then( rows => db_db.query(ch_seco_birth_date))
  //    .then( rows => db_db.query(ch_seco_sanctions_birth_places))
  //    .then( rows => db_db.query(ch_seco_sanctions_identifiers), console.log("Ino0 Start"))
     
  //    .then( rows => {return db_db.close()}, err => {
  //      return database.close().then( () => { throw err; } ) })
  //    .catch( err => {
  //         console.log("Err = "+ err);
  //     } )

      let db_db_1 = new Database(db_config); 
      // let db2 = new Database(db_config); 
      //  db_db_1.query(coe_assembly_nationalitiescountry)
      db_db_1.query(err_handler_name)
      .then(rows => db_db_1.query(info_table))

      .then( rows => db_db_1.query(eu_eeas_sanctions_aliases))
      .then( rows => db_db_1.query(eu_eeas_sanctions_birth_dates))
      .then( rows => db_db_1.query(eu_eeas_sanctions_birth_places))
      .then( rows => db_db_1.query(eu_eeas_sanctions_nationalities))
      .then( rows => db_db_1.query(eu_eeas_sanctions_addresses))

      .then( rows => db_db_1.query(eu_eeas_sanctions_aliases))
      // .then( rows => db_db_1.query(eu_eeas_sanctions_birth_dates))
      // .then( rows => db_db_1.query(eu_eeas_sanctions_birth_places))
      // .then( rows => db_db_1.query(eu_eeas_sanctions_nationalities))
      // .then( rows => db_db_1.query(eu_eeas_sanctions_addresses))

      .then( rows=> db_db_1.query(updateSanctionList))
      .then( rows => db_db_1.query(au_dfat_address)) 
      //.then( rows => db.query(everypolitician_aliases)) 
      .then( rows => db_db_1.query(au_dfat_sanctions_aliases)) 
      .then( rows => db_db_1.query(update_alias)) 
      .then( rows => db_db_1.query(birth_date)) 
      .then( rows => db_db_1.query(birth_place)) 
     
       //  .then( rows => db_db.query(ch_seco_sanctions_addresses)) // HERE WE GET ERRORc= about utf8 fristName TODO
         .catch( err => {
          console.log("Err = "+ err);
      } )

      .then( rows => db_db_1.query(ca_dfatd_sema_sanctions_aliases))
      .then( rows => db_db_1.query(ca_dfatd_sema_sanctions_birth_dates))
      .then( rows => db_db_1.query(ca_dfatd_sema_sanctions_nationalities))
      .then( rows => db_db_1.query(eu_eeas_sanctions_identifiers))
      
      
     
      .then( rows => db_db_1.query(ch_seco_sanctions_aliases))

      .then( rows => db_db_1.query(ch_seco_birth_date))
      .then( rows => db_db_1.query(ch_seco_sanctions_birth_places))
      .then( rows => db_db_1.query(ch_seco_sanctions_identifiers), console.log("Ino0 Start"))
      // .then (rows => db_db_1.query(coe_assembly_nationalitiescountry)) // this table if comes at first query back error database not defined! 
       .then( rows => db_db_1.query(everypolitician_nationalities))
       .then( rows => db_db_1.query(eu_meps_nationalities)) // nt wrk
       .then( rows => db_db_1.query(gb_hmt_sanctions_addresses))
       .then( rows => db_db_1.query(gb_hmt_sanctions_aliases))
       .then( rows => db_db_1.query(gb_hmt_sanctions_birth_dates))
       .then( rows => db_db_1.query(gb_hmt_sanctions_birth_places))
       .then( rows => db_db_1.query(gb_hmt_sanctions_identifiers))
       .then( rows => db_db_1.query(gb_hmt_sanctions_nationalities))
       .then( rows => db_db_1.query(interpol_red_notices_aliases))
       .then( rows => db_db_1.query(interpol_red_notices_birth_dates))
       .then( rows => db_db_1.query(interpol_red_notices_nationalities)) 
     //  .then( rows => db_db_1.query(kg_fiu_national_aliases))   
       .then (rows => db_db_1.query(worldbank_debarred))
       .then (rows => db_db_1.query(worldbank_debarred_addresses))
       .then (rows => db_db_1.query(worldbank_debarred_aliases))
       .then (rows => db_db_1.query(worldbank_debarred_nationalities))
       
   
      .then( rows => db_db_1.query(ua_sdfm_blacklist_addresses))
      .then( rows => db_db_1.query(ua_sdfm_blacklist_aliases))
      .then( rows => db_db_1.query(ua_sdfm_blacklist_birth_dates))
      .then( rows => db_db_1.query(ua_sdfm_blacklist_birth_places))
      .then( rows => db_db_1.query(ua_sdfm_blacklist_identifiers))
      .then( rows => db_db_1.query(ua_sdfm_blacklist_nationalities))
      .then( rows => db_db_1.query(un_sc_sanctions_addresses))
      .then( rows => db_db_1.query(un_sc_sanctions_aliases))
      .then( rows => db_db_1.query(un_sc_sanctions_birth_dates))
      .then( rows => db_db_1.query(un_sc_sanctions_birth_places))
      .then( rows => db_db_1.query(un_sc_sanctions_identifiers))
      .then( rows => db_db_1.query(un_sc_sanctions_nationalities))
      

      .then( rows => db_db_1.query(us_bis_denied_addresses)) //TODO has issue about duplicate keys 
      .catch( err => {
        console.log("Err = "+ err);
      }) //TODO 
      .then( rows => db_db_1.query(us_cia_world_leaders))
      .then( rows => db_db_1.query(us_cia_world_leaders_nationalities))
      .then( rows => db_db_1.query(us_ofac_addresses))
      .then( rows => db_db_1.query(us_ofac_aliases))
      .then( rows => db_db_1.query(us_ofac_birth_dates))
      .then( rows => db_db_1.query(us_ofac_birth_places))
      .then( rows => db_db_1.query(us_ofac_identifiers))

      .then( rows => db_db_1.query(update_info_id)) //TODO fix it
      
      .then( rows => db_db_1.query(ua_sdfm_blacklist_aliases)) 
      .then( rows => db_db_1.query(update_alias))
     .then( rows => db_db_1.query(update_list_id))
     .then( rows=> db_db_1.query(kg_fiu_national_birth_dates), console.log(" Completed! "))
      .then( rows => {return db_db_1.close()}, err => {
        return database.close().then( () => { throw err; } ) })
      .catch( err => {
           console.log("Err = "+ err);
       } )

   
 /////////////////////////////////////////////////////////////////
 /////////////////////////////////////////////////////////////////
 /////////////////////////////////////////////////////////////////
  


////////////////////////////////// DISPLAY  JSON ////////////////////////////////////////////
  app.get('/info', (request, response) => { 
    let update_sanction_info = " select * from aml_pro_dev.info "
      handleDisconnect(db_config);
      connection.query(update_sanction_info, function (err, result) 
        {
        if (err) console.log(err);
        else {
          response.json(result);
        }
        });
  });
  app.get('/', (request, response) => { 
    let update_sanction_info = " select * from aml_pro_dev.address "
      handleDisconnect(db_config);
      connection.query(update_sanction_info, function (err, result) 
        {
        if (err) console.log(err);
        else {
          response.json(result);
        }
        });
  });
  // app.get('/info_sanction', (request, response) => { 
  //   let update_sanction_info = " select * from aml_pro_dev.info_sanction "
  //     handleDisconnect(db_config);
  //     connection.query(update_sanction_info, function (err, result) 
  //       {
  //       if (err) console.log(err);
  //       else {
  //         response.json(result);
  //       }
  //       });
  // });
  app.get('/sanction_list', (request, response) => { 
    let update_sanction_info = " select * from aml_pro_dev.sanction_list "
      handleDisconnect(db_config);
      connection.query(update_sanction_info, function (err, result) 
        {
        if (err) console.log(err);
        else {
          response.json(result);
        }
        });
  });
//////////////////////////////////    \\\\\\\   ////////////////////////////////////////////

    //////////////////////////////////////////// CREAT //////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
      app.get('/create', (request, response) => { 
       
        var drop_sanction = "DROP TABLE IF EXISTS aml_pro_dev.list";
        var drop_address = "DROP TABLE IF EXISTS aml_pro_dev.address";
        var drop_info = "DROP TABLE IF EXISTS aml_pro_dev.info";
        
        dosql_sanction(drop_info, "drop info");
        dosql_sanction(drop_address, "drop address");
        dosql_sanction(drop_sanction, "drop list");
       // dosql_sanction(drop_info_cluster, "drop info cluster");
        
        ///////// INFO ///////////
        var create_info = " CREATE TABLE aml_pro_dev.info (id int NOT NULL AUTO_INCREMENT, list_id VARCHAR(255), name Text, "
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
        +", source text"
        +", description Text "
        +", issued_at VARCHAR(255)"
        +", number Text "
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
        +", alias boolean DEFAULT false"
        +", parent VARCHAR(255), PRIMARY KEY (id) )";
       //  dosql_sanction(create_info, "created info");

        
        ///////// Address ///////////
        var create_address = " CREATE TABLE aml_pro_dev.address (id int NOT NULL AUTO_INCREMENT, source Text, info_id INT, "
        +"country VARCHAR(255), "
        +"city VARCHAR(255), "
        +"street VARCHAR(255), "
        +"postal_code VARCHAR(255), "
        +"country_code VARCHAR(255), "
        +"region VARCHAR(255), "
        +"note Text, "
        +"street_2 VARCHAR(255), PRIMARY KEY (id))";
        // dosql_sanction(create_address, "created address");
      
        ///////// Info-Sanction ///////////
      //   var create_info_sanction = " CREATE TABLE aml_pro_dev.info_sanction (id int NOT NULL AUTO_INCREMENT, sanction_list_id INT, "
      //  +"info_id INT, PRIMARY KEY (id) )";
       // dosql_sanction(create_info_sanction, "created info sanction");

        ///////// sanction_list ///////////
         var list = " CREATE TABLE aml_pro_dev.list (id int NOT NULL AUTO_INCREMENT, name VARCHAR(255) unique, source Text, PRIMARY KEY (id)) ";
      //  // dosql_sanction(sanction_list , " Created sanctionist");
      //   response.sendStatus(`created!`);
      let errInfo = ' ALTER table  aml_pro_dev.info convert to CHARACTER SET utf8 COLLATE utf8_unicode_ci ';
      let errAddress = ' ALTER table  aml_pro_dev.address convert to CHARACTER SET utf8 COLLATE utf8_unicode_ci ';


         let dba = new Database(db_config ); 
          dba.query(create_info)
          .then( rows => dba.query(create_address))
          //.then( rows => dba.query(sanction_list ))
          .then( rows => dba.query(list)) 
          .then( rows => dba.query(errAddress))
      
         .then( rows => dba.query(errInfo)) 
         .then( rows => {return dba.close()}, err => {
          return database.close().then( () => { throw err; } ) })
        .catch( err => {
             console.log("Err = "+ err);
         } )
         response.sendStatus(200);
  })



  app.listen(
    process.env.PORT  || 3000, ()=>console.log('server running')
  )

  
  




