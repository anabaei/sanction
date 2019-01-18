  const Express= require('express')
  const app = Express()
  const mysql = require('mysql');
  const bodyParser = require('body-parser');
  const cookieParser = require('cookie-parser');
  const Database = require('./Database.js');
  

  app.use(bodyParser.urlencoded({extended: false}));
  app.use(cookieParser());
  app.use(bodyParser.json()); // support json encoded bodies
  app.use(bodyParser.urlencoded({ extended: false})); // support encoded bodies
  // Configure our Express app to use ejs as our templating engine
  app.set('view engine', 'ejs'); 
  ///////////////////////////////////////////////////
  //////////////////////// DB  //////////////////////
  ///////////////////////////////////////////////////

  let db_config = {
    host: "localhost",
    user: "root",
    password: "password"//,
   // database: "aml"
  }



  let db_config_sanction = {
    host: "localhost",
    user: "root",
    password: "password",
    database: "aml_pro"
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

 
  function dosql(table, message)
  {
    
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
 

////////// 
  app.get('/json_info', (request, response) => { 

    let update_sanction_info = " select * from aml_pro.info "
   
      handleDisconnect(db_config);
      connection.query(update_sanction_info, function (err, result) 
        {
        if (err) console.log(err);
        else {
          response.json(result);
        }
        });

  });
   

    //////////////////////////////////////////// CREAT //////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
      app.get('/create', (request, response) => { 
       
        var drop_sanction = "DROP TABLE IF EXISTS aml_pro.sanction_list";
        var drop_address = "DROP TABLE IF EXISTS aml_pro.address";
        var drop_info_santion = "DROP TABLE IF EXISTS aml_pro.info_sanction";
        var drop_info_cluster = "DROP TABLE IF EXISTS aml_pro.info_cluster";
        var drop_info = "DROP TABLE IF EXISTS aml_pro.info";
        
        // dosql_sanction(drop_info, "drop info");
        // dosql_sanction(drop_address, "drop address");
        // dosql_sanction(drop_info_santion, "drop info santion");
        // dosql_sanction(drop_sanction, "drop sanction");
        // dosql_sanction(drop_info_cluster, "drop info cluster");
        
        ///////// INFO ///////////
        var create_info = " CREATE TABLE aml_pro.info (ID int NOT NULL AUTO_INCREMENT, name Text, "
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
        +", alias boolean DEFAULT false"
        +", parent VARCHAR(255), PRIMARY KEY (ID) )";
       //  dosql_sanction(create_info, "created info");

        ///////// INFO  Cluster ///////////
        var create_info_cluster = " CREATE TABLE aml_pro.info_cluster (ID int NOT NULL AUTO_INCREMENT, name Text, "
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
        +", alias boolean DEFAULT false"
        +", parent VARCHAR(255), PRIMARY KEY (ID) )";
        //dosql_sanction(create_info_cluster, "created info cluster");
        
        

        ///////// Address ///////////
        var create_address = " CREATE TABLE aml_pro.address (ID int NOT NULL AUTO_INCREMENT, source VARCHAR(255) UNIQUE, info_id INT, "
        +"country VARCHAR(255), "
        +"city VARCHAR(255), "
        +"street VARCHAR(255), "
        +"postal_code VARCHAR(255), "
        +"country_code VARCHAR(255), "
        +"region VARCHAR(255), "
        +"note Text, "
        +"street_2 VARCHAR(255), PRIMARY KEY (ID))";
        // dosql_sanction(create_address, "created address");
      
        ///////// Info-Sanction ///////////
        var create_info_sanction = " CREATE TABLE aml_pro.info_sanction (ID int NOT NULL AUTO_INCREMENT, sanction_list_id INT, "
        +"info_id INT, PRIMARY KEY (ID) )";
       // dosql_sanction(create_info_sanction, "created info sanction");

        ///////// sanction_list ///////////
        var sanction_list = " CREATE TABLE aml_pro.sanction_list (ID int NOT NULL AUTO_INCREMENT, name VARCHAR(255) UNIQUE, source VARCHAR(255), PRIMARY KEY (ID, name)) ";
       // dosql_sanction(sanction_list , " Created sanctionist");
        response.send(`created!`);

         let dba = new Database(db_config ); 
          dba.query(drop_info)
         .then( rows => dba.query(drop_sanction), console.log("1"))
         .then( rows => dba.query(drop_address), console.log("1"))
         .then( rows => dba.query(drop_info_santion), console.log("1"))
         .then( rows => dba.query(drop_info_cluster), console.log("1"))
         .then( rows => dba.query(create_info), console.log("1"))
         .then( rows => dba.query(create_info_cluster), console.log("1"))
         .then( rows => dba.query(create_address), console.log("1"))
         .then( rows => dba.query(create_info_sanction), console.log("1"))
         .then( rows => dba.query(sanction_list), console.log("1"))
         .then( rows => dba.close());
        
  })


///// insert into info (name,  source) SELECT name, entity_id  FROM au_dfat_sanctions_aliases  //

  app.get('/info0', (request, response) => { 

        
          ///// AU_DFAT sanction ////
          /////////////////////////// 
          let au_dfat_sanctions_table= "insert into aml_pro.sanction_list (name,source) SELECT source,id FROM aml.au_dfat_sanctions"
          + " ON DUPLICATE KEY update"
          + " aml_pro.sanction_list.source = aml_pro.sanction_list.source";
          //dosql(au_dfat_sanctions_table, "au_dfat_sanctions inserted")

          ////// insert from au_drat_sanction into INFO table ////////
          let au_dfat_sanctions_cluster = "insert into aml_pro.info_cluster (name,  source, type, summary, program, url) "
          + " SELECT name, id,  type,  summary, program, url  FROM aml.au_dfat_sanctions ";
          //  dosql(au_dfat_sanctions_cluster, "clustered info");
  
          let au_dfat_sanctions = "insert into aml_pro.info (name,  source, type, summary, program, url) "
        + " SELECT name, id,  type,  summary, program, url  FROM aml.au_dfat_sanctions ";
         // dosql(au_dfat_sanctions, "insert from au_dfat_sanctions");

        ///// insert from sanction address into address table ///////

        let au_dfat_address = "insert into aml_pro.address (source,  note)"
        + " SELECT entity_id, text FROM aml.au_dfat_sanctions_addresses "
        + "ON DUPLICATE KEY UPDATE"
        + " aml_pro.address.note = aml.au_dfat_sanctions_addresses.text";
        //dosql(au_dfat_address, "insert from sanction address");
        //// Just add to that then we specifies aliases ////
        
        

        let au_dfat_sanctions_aliases_cluster  = "insert into aml_pro.info_cluster (name, source, alias)"
        + " SELECT name, entity_id, true FROM aml.au_dfat_sanctions_aliases ";
        //dosql(au_dfat_sanctions_aliases_cluster , " info_cluster");

        let au_dfat_sanctions_aliases  = "insert into aml_pro.info(name, source, alias)"
        + " SELECT name, entity_id, true FROM aml.au_dfat_sanctions_aliases";
        // dosql(au_dfat_sanctions_aliases , "au_dfat_sanctions_aliases");


         let update_alias = "update aml_pro.info ,(select id, source from aml_pro.info_cluster where alias = false) as src set aml_pro.info.parent = src.id where aml_pro.info.source = aml_pro.src.source";
        // dosql(update_alias, "update alias");


        let birth_date = "UPDATE aml_pro.info ,( SELECT entity_id, date FROM aml.au_dfat_sanctions_birth_dates ) AS src"
        +" SET aml_pro.info.birth_date = src.date"
        +" WHERE aml_pro.info.source = src.entity_id AND src.date IS NOT NULL"
        //dosql(birth_date , "info birth date updated");


        let birth_place = "UPDATE aml_pro.info ,( SELECT entity_id, place FROM aml.au_dfat_sanctions_birth_places bd ) AS src"
        +" SET aml_pro.info.birth_place = src.place"
        +" WHERE aml_pro.info.source = src.entity_id AND src.place IS NOT NULL"
        // dosql(birth_place , "info birth place updated");


        let country = "UPDATE aml_pro.info ,( SELECT entity_id, country_name, country_code FROM aml.au_dfat_sanctions_nationalities) AS src"
        +" SET aml_pro.info.nationality = src.country_name"
        +" , aml_pro.info.nationality_code = src.country_code"
        +" WHERE aml_pro.info.source = src.entity_id AND src.country_name IS NOT NULL"
        //dosql(country , "info country updated");


          /////////////////////////// 
          ///// ch_seco sanction/////
          /////////////////////////// 
          let ch_seco_sanctions_table= "insert into aml_pro.sanction_list (name, source) SELECT source,id FROM aml.ch_seco_sanctions ON DUPLICATE KEY UPDATE aml_pro.sanction_list.source = aml_pro.sanction_list.source";
         // dosql(ch_seco_sanctions_table, "ch_seco_sanctions_table inserted")

          //// TODO function column has been removed due to error form ch_seco_sanctions tables 
          let ch_seco_sanctions = " insert into aml_pro.info (firstName,  lastName, fatherName ,source, type, summary, program, name) "
          + " SELECT first_name, last_name, father_name, id,  type,  summary, program,  name  FROM aml.ch_seco_sanctions";
          // dosql(ch_seco_sanctions, "insert from ch_seco_sanctions");
        
          let ch_seco_sanctions_cluster = " insert into aml_pro.info_cluster (firstName,  lastName, fatherName ,source, type, summary, program, name) "
          + " SELECT first_name, last_name, father_name, id,  type,  summary, program,  name  FROM aml.ch_seco_sanctions";
         // dosql(ch_seco_sanctions_cluster, "insert from ch_seco_sanctions cluster");
        
        

        let ch_seco_sanctions_addresses = " insert aml_pro.address (source,  note, street, street_2, postal_code, country, country_code, region  )  "
        + " SELECT entity_id, text, street, street_2, postal_code, country_name, country_code, region  FROM aml.ch_seco_sanctions_addresses "
        + " ON DUPLICATE KEY update"
        + "   aml_pro.address.note  = aml_pro.address.note ";
        // dosql(ch_seco_sanctions_addresses, "insert from ch_seco_sanctions_addresses ");

        let ch_seco_sanctions_aliases  = "insert into aml_pro.info (firstName, lastName, fatherName, name, source , quality, title, second_name, third_name, alias)"
        + " SELECT first_name, last_name, father_name, name, entity_id, quality, title, second_name, third_name , true FROM aml.ch_seco_sanctions_aliases ";
        // dosql(ch_seco_sanctions_aliases , " aliases inserted");

        let ch_seco_sanctions_aliases_cluster  = "insert into aml_pro.info_cluster (firstName, lastName, fatherName, name, source , quality, title, second_name, third_name, alias)"
        + " SELECT first_name, last_name, father_name, name, entity_id, quality, title, second_name, third_name , true FROM aml.ch_seco_sanctions_aliases ";
        // dosql(ch_seco_sanctions_aliases_cluster  , " aliases cluster inserted");

        let ch_seco_birth_date = "UPDATE aml_pro.info ,( SELECT entity_id, date FROM aml.ch_seco_sanctions_birth_dates ) AS src"
        +" SET aml_pro.info.birth_date = src.date"
        +" WHERE aml_pro.info.source = src.entity_id AND src.date IS NOT NULL"
        // dosql(ch_seco_birth_date , "info birth date updated from ch_seco_birth_date");

        let ch_seco_sanctions_birth_places = "UPDATE aml_pro.info ,( SELECT entity_id, place, quality FROM aml.ch_seco_sanctions_birth_places ) AS src"
        +" SET aml_pro.info.birth_place = src.place"
        +", aml_pro.info.quality = src.quality"
        +" WHERE aml_pro.info.source = src.entity_id AND src.place IS NOT NULL"
        //dosql(ch_seco_sanctions_birth_places , "ch seco sanctions birth places ");

        let ch_seco_sanctions_identifiers = "UPDATE aml_pro.info ,( SELECT entity_id, country_name, country_code, type, description, number FROM aml.ch_seco_sanctions_identifiers) AS src"
        +" SET aml_pro.info.nationality = src.country_name"
        +" , aml_pro.info.nationality_code = src.country_code"
        +" , aml_pro.info.type = src.type"
        +" , aml_pro.info.description = src.description"
        +" , aml_pro.info.number = src.number"
        +" WHERE aml_pro.info.source = src.entity_id AND src.country_name IS NOT NULL"


        let update_alias_im = "update aml_pro.info ,(select id, source from aml_pro.info_cluster where alias = true ) as src set aml_pro.info.parent = src.id where aml_pro.info.source = aml_pro.src.source AND aml_pro.info.alias = true ";

        let db = new Database(db_config ); 
        db.query('insert into aml_pro.info (name, source, type, summary, program, url) SELECT name, id,  type,  summary, program, url  FROM aml.au_dfat_sanctions')
        .then( rows => db.query('insert into aml_pro.info_cluster (name,  source, type, summary, program, url) SELECT name, id,  type,  summary, program, url  FROM aml.au_dfat_sanctions'), console.log("1"))
        .then( rows => db.query(au_dfat_sanctions)) 
        .then( rows=> db.query(update_alias_im))
        .then( rows => db.query(au_dfat_address)) 
        .then( rows => db.query(au_dfat_sanctions_aliases_cluster)) 
        .then( rows => db.query(au_dfat_sanctions_aliases)) 
        .then( rows => db.query(update_alias)) 
        .then( rows => db.query(birth_date)) 
        .then( rows => db.query(birth_place)) 
        .then( rows => db.query(ch_seco_sanctions_table)) 
        .then( rows => db.query(ch_seco_sanctions)) 
        .then( rows => db.query(ch_seco_sanctions_cluster)) 
        .then( rows => db.query(ch_seco_sanctions_addresses))
        .then( rows => db.query(ch_seco_sanctions_aliases))
        .then( rows => db.query(ch_seco_sanctions_aliases_cluster))
        .then( rows => db.query(ch_seco_birth_date))
        .then( rows => db.query(ch_seco_sanctions_birth_places))
        .then( rows => db.query(ch_seco_sanctions_identifiers), console.log("Ino0 Start"))
        
        .then( rows => db.close());


      });


  app.get('/info1', (request, response) => { 

        //////////////////////////// 
        ///// coe_assembly   ///////
        //////////////////////////// 

        ////// insert from au_drat_sanction into INFO table ////////

        let coe_assembly_table= "insert into aml_pro.sanction_list (name, source) SELECT source,id FROM aml.interpol_red_notices ON DUPLICATE KEY UPDATE aml_pro.sanction_list.source = aml_pro.sanction_list.source";
        // dosql(coe_assembly_table, "created!" );


        let coe_assembly = " insert into aml_pro.info (firstName, lastName,  source, type, summary,  url, name) "
        + " SELECT first_name, last_name, id,  type,  summary, url, name  FROM aml.coe_assembly";
        //dosql(coe_assembly, "insert from acoe_assembly");
        
        let coe_assembly_cluster = " insert into aml_pro.info_cluster (firstName, lastName,  source, type, summary,  url, name) "
        + " SELECT first_name, last_name, id,  type,  summary, url, name  FROM aml.coe_assembly";
        //dosql(coe_assembly_cluster, "insert coe_assembly_cluster");
      
          //// TODO: cluster the selection ? ////
        let coe_assembly_nationalitiescountry = "UPDATE aml_pro.info ,( SELECT entity_id, country_name, country_code FROM aml.coe_assembly_nationalities) AS src"
        +" SET aml_pro.info.nationality = src.country_name"
        +" , aml_pro.info.nationality_code = src.country_code"
        +" WHERE aml_pro.info.source = src.entity_id AND src.country_name IS NOT NULL"
        //dosql(coe_assembly_nationalitiescountry , "info country coe_assembly_nationalitiescountry");


        ///////////////////////////// 
        ///////  eu_meps   /////////
        ////////////////////////////
        let eu_meps_table= "insert into aml_pro.sanction_list (name, source) SELECT source, id FROM aml.eu_meps ON DUPLICATE KEY UPDATE aml_pro.sanction_list.source = aml_pro.sanction_list.source";
        dosql(eu_meps_table, "created!" ); 

        let eu_meps = " insert into aml_pro.info (firstName, lastName,  source, type, summary ) "
        + " SELECT first_name, last_name, id,  type,  summary  FROM aml.coe_assembly";
        dosql(eu_meps, "info eu_meps");
        let eu_meps_cluster = " insert into aml_pro.info_cluster (firstName, lastName,  source, type, summary ) "
        + " SELECT first_name, last_name, id,  type,  summary  FROM aml.coe_assembly";
        dosql(eu_meps_cluster, "eu_meps_cluster");

        //// TODO : cluster? ///
        let eu_meps_nationalities = "UPDATE aml_pro.info ,( SELECT entity_id, country_name, country_code FROM aml.eu_meps_nationalities) AS src"
        +" SET aml_pro.info.nationality = src.country_name"
        +" , aml_pro.info.nationality_code = src.country_code"
        +" WHERE aml_pro.info.source = src.entity_id AND src.country_name IS NOT NULL ";
        dosql(eu_meps_nationalities, " eu_meps_nationalities");

        /////////////////////////////////// 
        ///////  everypolitician  /////////
        /////////////////////////////////// 
        let everypolitician_table= "insert into aml_pro.sanction_list (name, source) SELECT source,id FROM aml.everypolitician ON DUPLICATE KEY UPDATE aml_pro.sanction_list.source = aml_pro.sanction_list.source";
        dosql(everypolitician_table, "everypolitician_table" ); 
         
        let everypolitician = " insert into aml_pro.info ( source, type, program, name , gender ) "
        + " select  id,  type, program, name, gender  FROM aml.everypolitician";
        dosql(everypolitician, "info everypolitician");
        let everypolitician_cluster = " insert into aml_pro.info_cluster ( source, type, program, name , gender ) "
        + " select  id,  type, program, name, gender  FROM aml.everypolitician";
        dosql(everypolitician_cluster, "info everypolitician_cluster");
         
        let everypolitician_aliases  = "insert into aml_pro.info (name,  source, alias)   "
        + " SELECT name, entity_id, true  FROM aml.everypolitician_aliases";
        dosql(everypolitician_aliases, "everypolitician_aliases");
       
        let everypolitician_nationalities = "UPDATE aml_pro.info ,(SELECT entity_id, country_name, country_code FROM aml.everypolitician_nationalities) AS src"
        +" SET aml_pro.info.nationality = src.country_name"
        +" , aml_pro.info.nationality_code = src.country_code"
        +" WHERE aml_pro.info.source = src.entity_id AND src.country_name IS NOT NULL";
        dosql(everypolitician_nationalities, "everypolitician_nationalities");

        ////////////////////////////////////// 
        ///////   gb_hmt_sanctions  /////////
        ///////////////////////////////////// 
        let gb_hmt_sanctions_table= "insert into aml_pro.sanction_list (name, source) SELECT source,id FROM aml.gb_hmt_sanctions ON DUPLICATE KEY UPDATE aml_pro.sanction_list.source = aml_pro.sanction_list.source";
        dosql(gb_hmt_sanctions_table, "gb_hmt_sanctions_table" );
       
        let gb_hmt_sanctions  = " insert into aml_pro.info ( title, lastName, source, type, summary,  program, name , firstName, second_name, third_name ) "
        + "Select title, last_name, id, type, summary, program, name, first_name, second_name, third_name  FROM aml.gb_hmt_sanctions ";
        dosql(gb_hmt_sanctions , "info gb_hmt_sanctions ");
        
        let gb_hmt_sanctions_cluster  = " insert into aml_pro.info_cluster ( title, lastName, source, type, summary,  program, name , firstName, second_name, third_name ) "
        + "Select title, last_name, id, type, summary, program, name, first_name, second_name, third_name  FROM aml.gb_hmt_sanctions ";
        dosql(gb_hmt_sanctions_cluster , "info gb_hmt_sanctions_cluster ");

        let gb_hmt_sanctions_addresses = "insert into aml_pro.address (source,  country, country_code, postal_code, note  )  "
        + " SELECT entity_id, country_name, country_code, postal_code, text  FROM aml.gb_hmt_sanctions_addresses "
        + " ON DUPLICATE KEY update"
        + " aml_pro.address.note  = aml_pro.address.note ";
        dosql(gb_hmt_sanctions_addresses, "gb_hmt_sanctions_addresses");
      

       /// TODO Cluster? ///
        let gb_hmt_sanctions_aliases = "insert into aml_pro.info (firstName, second_name, title, lastName,  source, third_name, name, type, alias )   "
        + " SELECT first_name, second_name, title, last_name, entity_id, third_name, name, type, true  FROM aml.gb_hmt_sanctions_aliases";
        dosql(gb_hmt_sanctions_aliases, "gb_hmt_sanctions_aliases");

        let gb_hmt_sanctions_birth_dates = "UPDATE info ,( SELECT entity_id, date FROM gb_hmt_sanctions_birth_dates ) AS src"
        +" SET info.birth_date = src.date"
        +" WHERE info.source = src.entity_id AND src.date IS NOT NULL"
       //dosql(gb_hmt_sanctions_birth_dates, "gb_hmt_sanctions_birth_dates");

        let gb_hmt_sanctions_birth_places = "UPDATE info ,( SELECT entity_id, country_name, country_code, place FROM gb_hmt_sanctions_birth_places ) AS src"
        +" SET info.birth_place = src.place"
        +" , info.country_code = src.country_code" ///TODO country codes??
        +" WHERE info.source = src.entity_id AND src.place IS NOT NULL"
        //dosql(gb_hmt_sanctions_birth_places, "gb_hmt_sanctions_birth_places");

        //// TODO : clsuter?
        let gb_hmt_sanctions_identifiers = "UPDATE aml_pro.info ,( SELECT entity_id, country_name, country_code, type, number FROM aml.gb_hmt_sanctions_identifiers) AS src"
          +" SET aml_pro.info.nationality = src.country_name"
          +" , aml_pro.info.nationality_code = src.country_code"
          +" , aml_pro.info.type = src.type"
          +" , aml_pro.info.number = src.number"
          +" WHERE aml_pro.info.source = src.entity_id AND src.country_name IS NOT NULL"
          dosql(gb_hmt_sanctions_identifiers, "gb_hmt_sanctions_identifiers");

       let gb_hmt_sanctions_nationalities = "UPDATE aml_pro.info ,(SELECT entity_id, country_name, country_code FROM aml.gb_hmt_sanctions_nationalities) AS src"
        +" SET aml_pro.info.nationality = src.country_name"
        +" , aml_pro.info.nationality_code = src.country_code"
        +" WHERE aml_pro.info.source = src.entity_id AND src.country_name IS NOT NULL";
        dosql(gb_hmt_sanctions_nationalities, "gb_hmt_sanctions_nationalities");

      

       
        ////////////////////////////////////// 
        ////////////   Ineterpol /////////////
        ///////////////////////////////////// 
        let interpol_red_notices_table= "insert into aml_pro.sanction_list (name, source) SELECT source,id FROM aml.interpol_red_notices ON DUPLICATE KEY UPDATE aml_pro.sanction_list.source = aml_pro.sanction_list.source";
        dosql(interpol_red_notices_table, "created!")

        let interpol_red_notices = " insert into aml_pro.info ( firstName, lastName, source, type, summary,  program, url, gender, name) "
        + "Select first_name, last_name, id, type, summary, program, url, gender, name  FROM aml.interpol_red_notices ";
        dosql(interpol_red_notices , "interpol red notices");

        let interpol_red_notices_cluster = " insert into aml_pro.info_cluster ( firstName, lastName, source, type, summary,  program, url, gender, name) "
        + "Select first_name, last_name, id, type, summary, program, url, gender, name  FROM aml.interpol_red_notices ";
        dosql(interpol_red_notices_cluster , "interpol red notices_cluster");
         
        let interpol_red_notices_aliases = "insert into aml_pro.info (source, name, alias) "
        + " SELECT entity_id, name, true FROM aml.interpol_red_notices_aliases";
        dosql(interpol_red_notices_aliases, "interpol red notices aliases");
       
       let interpol_red_notices_birth_dates = "UPDATE info ,( SELECT entity_id, date FROM interpol_red_notices_birth_dates ) AS src"
       +" SET info.birth_date = src.date"
       +" WHERE info.source = src.entity_id AND src.date IS NOT NULL"
       //dosql(interpol_red_notices_birth_dates, "interpol_red_notices_birth_dates")

       // TODO no place for this found!
       let interpol_red_notices_birth_places = "UPDATE info ,( SELECT entity_id, place FROM interpol_red_notices_birth_places ) AS src"
       +" SET info.birth_place = src.place"
       // +" , info.country_code = src.country_code" ///TODO country codes??
       +" WHERE info.source = src.entity_id AND src.place IS NOT NULL"
       //dosql(interpol_red_notices_birth_places, "interpol red notices birth places");

      
       let interpol_red_notices_nationalities = "UPDATE aml_pro.info ,(SELECT entity_id, country_name, country_code FROM aml.interpol_red_notices_nationalities) AS src"
       +" SET aml_pro.info.nationality = src.country_name"
       +" , aml_pro.info.nationality_code = src.country_code"
       +" WHERE aml_pro.info.source = src.entity_id AND src.country_name IS NOT NULL";
       dosql(interpol_red_notices_nationalities, "interpol red notices nationalities");


       ///////////////////////////////////////////////
       //////////// kg_fiu_national //////////////////
       ///////////////////////////////////////////////
       let kg_fiu_national_table= "insert into aml_pro.sanction_list (name, source) SELECT source,id FROM aml.kg_fiu_national ON DUPLICATE KEY UPDATE aml_pro.sanction_list.source = aml_pro.sanction_list.source";
       dosql(kg_fiu_national_table, "created!")

       let kg_fiu_national = " insert into aml_pro.info ( firstName, lastName, second_name ,source, type, summary,  program,  name, listed_at) "
       + "Select first_name, last_name, second_name, id, type, summary, program,  name, listed_at  FROM aml.kg_fiu_national ";
       dosql(kg_fiu_national, "kg_fiu_national");
       
       let kg_fiu_national_cluster = " insert into aml_pro.info_cluster (firstName, lastName, second_name ,source, type, summary,  program,  name, listed_at) "
       + "Select first_name, last_name, second_name, id, type, summary, program,  name, listed_at  FROM aml.kg_fiu_national ";
       dosql(kg_fiu_national_cluster , "kg_fiu_national_cluster ");
      
       let kg_fiu_national_aliases =  "insert into aml_pro.info (source, name, alias) "
       + " SELECT entity_id, name, true FROM aml.kg_fiu_national_aliases";
       dosql(kg_fiu_national_aliases, "kg fiu national aliases");
      
       let kg_fiu_national_birth_dates = "UPDATE info ,( SELECT entity_id, date FROM kg_fiu_national_birth_dates ) AS src"
       +" SET info.birth_date = src.date"
       +" WHERE info.source = src.entity_id AND src.date IS NOT NULL"
      // dosql(kg_fiu_national_birth_dates, "kg fiu national birth dates")

      update_alias = "update aml_pro.info ,(select id, source from aml_pro.info_cluster where alias = 1) as src set aml_pro.info.parent = src.id where aml_pro.info.source = aml_pro.src.source AND aml_pro.info.alias = 1 ";

      db = new Database(db_config ); 
      db.query(coe_assembly_table)
      .then( rows => db.query(coe_assembly))
      .then( rows => db.query(coe_assembly_cluster))
      .then( rows => db.query(coe_assembly_nationalitiescountry))
      .then( rows => db.query(eu_meps_table))
      .then( rows => db.query(eu_meps))
      .then( rows => db.query(eu_meps_cluster))
      .then( rows => db.query(eu_meps_nationalities))
      .then( rows => db.query(everypolitician_table))
      .then( rows => db.query(everypolitician))
      .then( rows => db.query(everypolitician_cluster))
      .then( rows => db.query(everypolitician_aliases))
      .then( rows => db.query(everypolitician_nationalities))
      .then( rows => db.query(gb_hmt_sanctions_table))
      .then( rows => db.query(gb_hmt_sanctions))
      .then( rows => db.query(gb_hmt_sanctions_cluster))
      .then( rows => db.query(gb_hmt_sanctions_addresses))
      .then( rows => db.query(gb_hmt_sanctions_aliases))
      .then( rows => db.query(gb_hmt_sanctions_birth_dates))
      .then( rows => db.query(gb_hmt_sanctions_birth_places))
      .then( rows => db.query(gb_hmt_sanctions_identifiers))
      .then( rows => db.query(gb_hmt_sanctions_nationalities))
      .then( rows => db.query(interpol_red_notices_table))
      .then( rows => db.query(interpol_red_notices))
      .then( rows => db.query(interpol_red_notices_cluster))
      .then( rows => db.query(interpol_red_notices_aliases))
      .then( rows => db.query(interpol_red_notices_birth_dates))
      .then( rows => db.query(interpol_red_notices_birth_places))
      .then( rows => db.query(interpol_red_notices_nationalities))
      .then( rows => db.query(kg_fiu_national_table))
      .then( rows => db.query(kg_fiu_national))
      .then( rows => db.query(kg_fiu_national_cluster))
      .then( rows => db.query(kg_fiu_national_aliases))
      .then( rows => db.query(kg_fiu_national_birth_dates))
      .then( rows=> db.query(update_alias), console.log("Info1 start"))
      .then( rows => db.close());
      
    
  });

  app.get('/info2', (request, response) => { 
   
       //////////////////////////////////////////////////
       ///////////// ua_sdfm_blacklist //////////////////
       /////////////////////////////////////////////////
       let ua_sdfm_blacklist_table= "insert into aml_pro.sanction_list (name, source) SELECT source,id FROM aml.ua_sdfm_blacklist ON DUPLICATE KEY UPDATE aml_pro.sanction_list.source = aml_pro.sanction_list.source";
       dosql(ua_sdfm_blacklist_table, "created!")

       let ua_sdfm_blacklist = " insert into aml_pro.info (firstName, lastName, second_name , third_name, source, type, summary, program, url, name, title) "
       + "Select first_name, last_name, second_name, third_name ,id, type, summary, program, url, name, title  FROM aml.ua_sdfm_blacklist ";
       dosql(ua_sdfm_blacklist, "ua sdfm blacklist"); 

       let ua_sdfm_blacklist_cluster = " insert into aml_pro.info_cluster (firstName, lastName, second_name , third_name, source, type, summary, program, url, name, title) "
       + "Select first_name, last_name, second_name, third_name ,id, type, summary, program, url, name, title  FROM aml.ua_sdfm_blacklist ";
       dosql(ua_sdfm_blacklist_cluster, "ua sdfm blacklist_cluster"); 

       let ua_sdfm_blacklist_addresses = "insert into aml_pro.address (source,  country, country_code, postal_code, note) "
       + " SELECT entity_id, country_name, country_code, postal_code, text  FROM aml.ua_sdfm_blacklist_addresses "
       + " ON DUPLICATE KEY update"
       + " aml_pro.address.note  = aml_pro.address.note ";
       dosql(ua_sdfm_blacklist_addresses, "ua sdfm blacklist addresses");

       // TODO change name type to TEXT in info table
       let ua_sdfm_blacklist_aliases =  "insert into aml_pro.info (source, name, alias) "
       + " SELECT entity_id, name, true  FROM aml.ua_sdfm_blacklist_aliases";
       dosql(ua_sdfm_blacklist_aliases, "ua sdfm blacklist aliases");
      
      let ua_sdfm_blacklist_birth_dates = "UPDATE aml_pro.info ,( SELECT entity_id, date FROM aml.ua_sdfm_blacklist_birth_dates ) AS src"
      +" SET aml_pro.info.birth_date = src.date"
      +" WHERE aml_pro.info.source = src.entity_id  AND src.date IS NOT NULL"
      //dosql(ua_sdfm_blacklist_birth_dates, "ua sdfm blacklist birth dates");
     
      let ua_sdfm_blacklist_birth_places = "UPDATE aml_pro.info ,( SELECT entity_id, place FROM aml.ua_sdfm_blacklist_birth_places) AS src"
      +" SET aml_pro.info.birth_place = src.place"
      // +" , info.country_code = src.country_code" ///TODO country codes??
      +" WHERE aml_pro.info.source = src.entity_id  AND src.place IS NOT NULL"
       //dosql(ua_sdfm_blacklist_birth_places, "ua sdfm blacklist birth places")

      let ua_sdfm_blacklist_identifiers = "UPDATE aml_pro.info ,( SELECT entity_id, description, country_name, country_code, type, number FROM aml.ua_sdfm_blacklist_identifiers) AS src"
      +" SET aml_pro.info.nationality = src.country_name"
      +" , aml_pro.info.nationality_code = src.country_code"
      +" , aml_pro.info.type = src.type"
      +" , aml_pro.info.number = src.number"
      +" WHERE aml_pro.info.source = src.entity_id  AND src.country_name IS NOT NULL";
       //dosql(ua_sdfm_blacklist_identifiers, "ua sdfm blacklist identifiers");
    
      let ua_sdfm_blacklist_nationalities =  "UPDATE aml_pro.info ,(SELECT entity_id, country_name, country_code FROM aml.ua_sdfm_blacklist_nationalities) AS src"
      +" SET aml_pro.info.nationality = src.country_name"
      +" , aml_pro.info.nationality_code = src.country_code"
      +" WHERE aml_pro.info.source = src.entity_id  AND src.country_name IS NOT NULL";
       dosql(ua_sdfm_blacklist_nationalities, "ua sdfm blacklist nationalities")
   
      //////////////////////////////
      ////// un_sc_sanctions //////
      /////////////////////////////
      let un_sc_sanctions_table= "insert into aml_pro.sanction_list (name,source) SELECT source,id FROM aml.un_sc_sanctions ON DUPLICATE KEY UPDATE aml_pro.sanction_list.source = aml_pro.sanction_list.source";
      dosql(un_sc_sanctions_table, "created!")
       /// TODO updated_at from this table not consider 

      let un_sc_sanctions = " insert into aml_pro.info (firstName,  second_name , third_name, source, type, summary, program, listed_at,  name, title) "
      + "Select first_name, second_name, third_name ,id, type, summary, program, listed_at,   name, title  FROM aml.un_sc_sanctions  ";
      dosql(un_sc_sanctions, "un sc sanctions")

      let un_sc_sanctions_cluster = " insert into aml_pro.info_cluster (firstName,  second_name , third_name, source, type, summary, program, listed_at,  name, title) "
      + "Select first_name, second_name, third_name ,id, type, summary, program, listed_at,   name, title  FROM aml.un_sc_sanctions  ";
      dosql(un_sc_sanctions_cluster, "un sc sanctions_cluster")

     let un_sc_sanctions_addresses = "insert into aml_pro.address (source,  country, country_code, note, street, city, region  )  "
     + " SELECT entity_id, country_name, country_code, note, street, city, region  FROM aml.un_sc_sanctions_addresses "
     + " ON DUPLICATE KEY update"
     + " aml_pro.address.country  = aml_pro.address.country ";
     dosql(un_sc_sanctions_addresses, "un sc sanctions addresses")
     
     let un_sc_sanctions_aliases =  "insert into aml_pro.info (source, name, quality, alias) "
     + " SELECT entity_id, name, quality, true  FROM aml.un_sc_sanctions_aliases";
     dosql(un_sc_sanctions_aliases, "un_sc_sanctions_aliases");

     let un_sc_sanctions_birth_dates = "UPDATE aml_pro.info ,( SELECT entity_id, date, quality FROM aml.un_sc_sanctions_birth_dates) AS src"
     +" SET aml_pro.info.birth_date = src.date"
     +" , aml_pro.info.quality = src.quality"
     +" WHERE aml_pro.info.source = src.entity_id AND src.date IS NOT NULL "
     //dosql(un_sc_sanctions_birth_dates, "un_sc_sanctions_birth_dates")

     let un_sc_sanctions_birth_places = "UPDATE aml_pro.info ,( SELECT entity_id, place, country_name, country_code FROM aml.un_sc_sanctions_birth_places) AS src"
     +" SET aml_pro.info.birth_place = src.place"
     +" , aml_pro.info.nationality = src.country_code" ///TODO country codes??
     +" , aml_pro.info.nationality_code = src.country_code"
     +" WHERE aml_pro.info.source = src.entity_id AND src.place IS NOT NULL"
     //dosql(un_sc_sanctions_birth_places, "un sc sanctions birth places");
    
     let un_sc_sanctions_identifiers = "UPDATE aml_pro.info ,( SELECT entity_id, description, country_name, country_code, type, number, issued_at FROM aml.un_sc_sanctions_identifiers) AS src"
     +" SET aml_pro.info.nationality = src.country_name"
     +" , aml_pro.info.nationality_code = src.country_code"
     +" , aml_pro.info.type = src.type"
     +" , aml_pro.info.number = src.number"
     +" , aml_pro.info.listed_at = src.issued_at"
     +" , aml_pro.info.description = src.description"
     +" WHERE aml_pro.info.source = src.entity_id AND src.country_name IS NOT NULL";
     //dosql(un_sc_sanctions_identifiers, "un_sc_sanctions_identifiers")

     let un_sc_sanctions_nationalities =  "UPDATE aml_pro.info ,(SELECT entity_id, country_name, country_code FROM aml.un_sc_sanctions_nationalities) AS src"
     +" SET aml_pro.info.nationality = src.country_name"
     +" , aml_pro.info.nationality_code = src.country_code"
     +" WHERE aml_pro.info.source = src.entity_id AND src.country_name IS NOT NULL";
      dosql(un_sc_sanctions_nationalities, "un sc sanctions nationalities");

      //////////////////////////////
      ////// us_bis_denied /////////
      /////////////////////////////

      let us_bis_denied_table= "insert into aml_pro.sanction_list (name,source) SELECT source,id FROM aml.us_bis_denied ON DUPLICATE KEY UPDATE aml_pro.sanction_list.source = aml_pro.sanction_list.source";
      dosql(us_bis_denied_table, "created!")

      let us_bis_denied = " insert into aml_pro.info ( source, type, summary, program, listed_at,  name) "
      + "Select id, type, summary, program, updated_at, name FROM aml.us_bis_denied";
      dosql(us_bis_denied , "us_bis_denied")
      let us_bis_denied_cluster = " insert into aml_pro.info_cluster ( source, type, summary, program, listed_at,  name) "
      + "Select id, type, summary, program, updated_at, name FROM aml.us_bis_denied";
      dosql(us_bis_denied_cluster , "us_bis_denied_cluster")

      let us_bis_denied_addresses = "insert into aml_pro.address (source,  country, country_code, street, postal_code, city, region  )  "
      + " SELECT entity_id, country_name, country_code, street, postal_code, city, region  FROM aml.us_bis_denied_addresses";
      + " ON DUPLICATE KEY update"
      + " aml_pro.address.country  = aml_pro.address.country ";
      dosql(us_bis_denied_addresses, "us_bis_denied_addresses");
    

      let us_cia_world_leaders = "UPDATE aml_pro.info ,( SELECT id, type, program, url, updated_at, name FROM aml.us_cia_world_leaders) AS src"
      +" SET aml_pro.info.name = src.name"
      +" , aml_pro.info.type = src.type"
      +" , aml_pro.info.program = src.program"
      +" , aml_pro.info.url = src.url"
      +" , aml_pro.info.listed_at = src.updated_at"
      +" WHERE aml_pro.info.source = src.id AND src.name IS NOT NULL";
      dosql(us_cia_world_leaders, "us cia world leaders")
     
      let us_cia_world_leaders_nationalities =  "UPDATE aml_pro.info ,(SELECT entity_id, country_name, country_code FROM aml.us_cia_world_leaders_nationalities) AS src"
      +" SET aml_pro.info.nationality = src.country_name"
      +" , aml_pro.info.nationality_code = src.country_code"
      +" WHERE aml_pro.info.source = src.entity_id AND src.country_name IS NOT NULL";
      dosql(us_cia_world_leaders_nationalities, "us cia world leaders nationalities")
      
      /////////////////////////////
      ///////// us_ofac //////////
      ////////////////////////////

      let us_ofac_table= "insert into aml_pro.sanction_list (name,source) SELECT source,id FROM aml.us_ofac ON DUPLICATE KEY UPDATE aml_pro.sanction_list.source = aml_pro.sanction_list.source";
      dosql(us_ofac_table, "created!")

      let us_ofac = "insert into aml_pro.info (  source, type, summary, program, listed_at, name) "
      + "Select id, type, summary, program, updated_at, name FROM aml.us_ofac";
      dosql(us_ofac, "us_ofac")

      let us_ofac_cluster = "insert into aml_pro.info_cluster (source, type, summary, program, listed_at, name) "
      + "Select id, type, summary, program, updated_at, name FROM aml.us_ofac";
      dosql(us_ofac_cluster, "us_ofac_cluster")
    
      let us_ofac_addresses = "insert into aml_pro.address (source,  country, country_code, street, street_2, city)"
      + " SELECT entity_id, country_name, country_code, street, street_2, city  FROM aml.us_ofac_addresses "
      + " ON DUPLICATE KEY update"
      + " aml_pro.address.country = aml_pro.address.country ";
      dosql(us_ofac_addresses, "us ofac addresses")

      let us_ofac_aliases =  "insert into aml_pro.info (source, lastName, quality, type, name, firstName, alias) "
      + " SELECT entity_id, last_name, quality, type, name, first_name, true  FROM aml.us_ofac_aliases";
      dosql(us_ofac_aliases, "us ofac aliases")

      let us_ofac_birth_dates = "UPDATE aml_pro.info ,( SELECT entity_id, date, quality FROM aml.us_ofac_birth_dates) AS src"
      +" SET aml_pro.info.birth_date = src.date"
      +" , aml_pro.info.quality = src.quality" ///TODO country codes??
      +" WHERE aml_pro.info.source = src.entity_id AND src.date IS NOT NULL"
      //dosql(us_ofac_birth_dates, "us ofac birth dates")
      
      let us_ofac_birth_places = "UPDATE aml_pro.info ,( SELECT entity_id, place, quality FROM aml.us_ofac_birth_places) AS src"
      +" SET aml_pro.info.birth_place = src.place"
      +" , aml_pro.info.quality = src.quality"
      +" WHERE aml_pro.info.source = src.entity_id AND src.place IS NOT NULL"
      //dosql(us_ofac_birth_places, "us ofac birth places")

      let us_ofac_identifiers = "UPDATE aml_pro.info ,( SELECT entity_id, description, country_name, country_code, type, number FROM aml.us_ofac_identifiers) AS src"
      +" SET aml_pro.info.nationality = src.country_name"
      +" , aml_pro.info.nationality_code = src.country_code"
      +" , aml_pro.info.type = src.type"
      +" , aml_pro.info.number = src.number"
      +" , aml_pro.info.description = src.description"
      +" WHERE aml_pro.info.source = src.entity_id AND src.country_name IS NOT NULL";
      //dosql(us_ofac_identifiers, "us ofac identifiers")


      //////////////////////////////////////
      /////// worldbank_debarred ///////////
      /////////////////////////////////////

     
      let worldbank_debarred_table= "insert into aml_pro.sanction_list (name,source) SELECT source,id FROM aml.worldbank_debarred ON DUPLICATE KEY UPDATE aml_pro.sanction_list.source = aml_pro.sanction_list.source";
      dosql(worldbank_debarred_table, "created!")
      
      let worldbank_debarred = "insert into aml_pro.info (source, program, listed_at, name, url)"
      + "Select id, program, updated_at, name, url FROM aml.worldbank_debarred ";
      dosql(worldbank_debarred , "worldbank debarred ")

      let worldbank_debarred_cluster = "insert into aml_pro.info_cluster (source, program, listed_at, name, url)"
      + "Select id, program, updated_at, name, url FROM aml.worldbank_debarred ";
      dosql(worldbank_debarred_cluster , "worldbank debarred_cluster")

      let worldbank_debarred_addresses = "insert into aml_pro.address (source,  country, country_code, note) "
      + " SELECT entity_id, country_name, country_code, text  FROM aml.worldbank_debarred_addresses "
      + " ON DUPLICATE KEY update"
      + " aml_pro.address.country = aml_pro.address.country ";
      dosql(worldbank_debarred_addresses, "worldbank debarred addresses")

      let worldbank_debarred_aliases = "insert into aml_pro.info (source, name, alias) "
      + " SELECT entity_id, name, true FROM aml.worldbank_debarred_aliases";
      dosql(worldbank_debarred_aliases, "worldbank debarred aliases")

      let worldbank_debarred_nationalities = "UPDATE aml_pro.info ,(SELECT entity_id, country_name, country_code FROM aml.worldbank_debarred_nationalities) AS src"
      +" SET aml_pro.info.nationality = src.country_name"
      +" , aml_pro.info.nationality_code = src.country_code"
      +" WHERE aml_pro.info.source = src.entity_id AND src.country_name IS NOT NULL";
      dosql(worldbank_debarred_nationalities, "worldbank debarred nationalities")

      update_alias = "update aml_pro.info ,(select id, source from aml_pro.info_cluster where alias = 1) as src set aml_pro.info.parent = src.id where aml_pro.info.source = aml_pro.src.source AND aml_pro.info.alias = 1 ";
      
       db = new Database(db_config ); 
       db.query(ua_sdfm_blacklist_table)
      .then( rows => db.query(ua_sdfm_blacklist))
      .then( rows => db.query(ua_sdfm_blacklist_cluster))
     // .then( rows => db.query(ua_sdfm_blacklist_addresses))
      .then( rows => db.query(ua_sdfm_blacklist_aliases))
      .then( rows => db.query(ua_sdfm_blacklist_birth_dates))
      .then( rows => db.query(ua_sdfm_blacklist_birth_places))
      .then( rows => db.query(ua_sdfm_blacklist_identifiers))
      .then( rows => db.query(ua_sdfm_blacklist_nationalities))
      .then( rows => db.query(un_sc_sanctions_table))
      .then( rows => db.query(un_sc_sanctions))
      .then( rows => db.query(un_sc_sanctions_cluster))
      .then( rows => db.query(un_sc_sanctions_addresses))
      .then( rows => db.query(un_sc_sanctions_aliases))
      .then( rows => db.query(un_sc_sanctions_birth_dates))
      .then( rows => db.query(un_sc_sanctions_birth_places))
      .then( rows => db.query(un_sc_sanctions_identifiers))
      .then( rows => db.query(un_sc_sanctions_nationalities))
      .then( rows => db.query(us_bis_denied_table))
      .then( rows => db.query(us_bis_denied))
      .then( rows => db.query(us_bis_denied_cluster))
     // .then( rows => db.query(us_bis_denied_addresses)) has issue about duplicate keys 
      .then( rows => db.query(us_cia_world_leaders))
      .then( rows => db.query(us_cia_world_leaders_nationalities))
      .then( rows => db.query(us_ofac_table))
      .then( rows => db.query(us_ofac))
      .then( rows => db.query(us_ofac_cluster))
      .then( rows => db.query(us_ofac_addresses))
      .then( rows => db.query(us_ofac_aliases))
      .then( rows => db.query(us_ofac_birth_dates))
      .then( rows => db.query(us_ofac_birth_places))
      .then( rows => db.query(us_ofac_identifiers))
      .then( rows => db.query(worldbank_debarred_table))
      .then( rows => db.query(worldbank_debarred))
      .then( rows => db.query(worldbank_debarred_cluster))
      .then( rows => db.query(worldbank_debarred_addresses))
      .then( rows => db.query(worldbank_debarred_aliases))
      .then( rows => db.query(worldbank_debarred_nationalities))
      .then( rows=> db.query(update_alias), console.log("Info2 Start"))
      .then( rows => db.close());  
  
  })

      
  app.listen(
    process.env.PORT  || 3000, ()=>console.log('server running')
  )


  





