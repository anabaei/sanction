  const Express= require('express')
  const app = Express()
  const mysql = require('mysql');
  const bodyParser = require('body-parser');
  const cookieParser = require('cookie-parser');


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
  
  handleDisconnect();
 

  function dosql(table, message)
  {
    connection.query(table, function (err, result) 
    {
      if (err) console.log(err);
      else {console.log(message);}
    });
  }

  function dosql_dml(table, message)
  {
    connection.query(table, function (err, result) 
    {
      if (err) console.log(err);
      else {console.log(message);}
    });
  }
  function dosql_dml1(table, message)
  {
    connection.query(table, function (err, result) 
    {
      if (err) console.log(err);
      else {console.log(message);}
    });
  }
  
  function dosql_dml(table, message)
  {
    connection.query(table, function (err, result) 
    {
      if (err) console.log(err);
      else {console.log(message);}
    });
  }

  function dosql_dmllll(table, message)
  {
    connection.query(table, function (err, result) 
    {
      if (err) console.log(err);
      else {return result}
    });
    
  }

  

  ///////////////////////////////////////////////////
  ////////// Allow to parse bodies in json //////////
  ///////////////////////////////////////////////////
  app.get('/first', (request, response) => { 

   
    // var selection = "UPDATE info ,( Select source, id from aml.info where aml.alias = 'yes' ) AS src"
    // +" SET info.birth_date = src.id"
    // +" WHERE info.source = src.entity_id AND src.date IS NOT NULL"

   // var selection = "select source from aml.info where aml.alias = 'yes' SELECT * FROM aml.info where  source = 'everypolitician.dd6909de-898c-4e2d-8c28-f89a967398b3'' 

      var jsonResponse = {};
      var  b = "select * from info"
      var jsonResponse =  dosql_dmllll(b, "jsonResponse")
    
       return JSON.stringify(jsonResponse)
   
       //return json.create_info;
        //  response.send(create_info) 
      })

      app.get('/create', (request, response) => { 
       
        var drop_sanction = "DROP TABLE IF EXISTS sanction_list";
        var drop_address = "DROP TABLE IF EXISTS address";
        var drop_info_santion = "DROP TABLE IF EXISTS info_sanction";
        var drop_info = "DROP TABLE IF EXISTS info";

        //dosql_dml(drop_sanction, "drop sanction");
        //dosql_dml(drop_address, "drop address");
        //dosql_dml(drop_info_santion, "drop info santion");
        //dosql_dml(drop_info, "drop info");
       
       console.log('create')
        ///////// INFO ///////////
        var create_info = " CREATE TABLE info (ID int NOT NULL AUTO_INCREMENT, name Text, "
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
        +", parent VARCHAR(255), PRIMARY KEY (ID) )";
         //dosql_dml(create_info, "created info");
        
        ///////// Address ///////////
        var create_address = " CREATE TABLE address (ID int NOT NULL AUTO_INCREMENT, source VARCHAR(255), info_id INT, "
        +"country VARCHAR(255), "
        +"city VARCHAR(255), "
        +"street VARCHAR(255), "
        +"postal_code VARCHAR(255), "
        +"country_code VARCHAR(255), "
        +"region VARCHAR(255), "
        +"note Text, "
        +"street_2 VARCHAR(255), PRIMARY KEY (ID))";
         //dosql_dml(create_address, "created address");
      
        ///////// Info-Sanction ///////////
        var create_info_sanction = " CREATE TABLE info_sanction (ID int NOT NULL AUTO_INCREMENT, sanction_list_id INT, "
        +"info_id INT, PRIMARY KEY (ID) )";
         //dosql_dml(create_info_sanction, "created info_sanction");

          ///////// sanction_list ///////////
          var sanction_list = " CREATE TABLE sanction_list (ID int NOT NULL AUTO_INCREMENT, name VARCHAR(255), PRIMARY KEY (ID)) ";
         //dosql_dml(sanction_list , "sanction_list");
          response.send(`created!`) 
  })


///// insert into info (name,  source) SELECT name, entity_id  FROM au_dfat_sanctions_aliases  //

  app.get('/info0', (request, response) => { 

          /////////////////////////// 
          ///// AU_DFAT sanction ////
          /////////////////////////// 
          let au_dfat_sanctions_table= "insert into sanction_list (name) SELECT source FROM aml.au_dfat_sanctions limit 1;"
          //dosql_dml(au_dfat_sanctions_table, "au_dfat_sanctions inserted")
          ////// insert from au_drat_sanction into INFO table ////////
          let au_dfat_sanctions = " insert into info (name,  source, type, summary, program, url) "
        + " SELECT name, id,  type,  summary, program, url  FROM au_dfat_sanctions";
       //dosql_dml(au_dfat_sanctions, "insert from au_dfat_sanctions");
        ///// insert from sanction address into address table ///////
        let au_dfat_address = "  insert into address (source,  note )  "
        + " SELECT entity_id, text  FROM au_dfat_sanctions_addresses ";
       //dosql_dml(au_dfat_address, "insert from sanction address");
        //// Just add to that then we specifies aliases ////
        

        let au_dfat_sanctions_aliases  = "insert into info (name, source, alias, parent)"
        + " SELECT name, entity_id, 'yes', parent FROM au_dfat_sanctions_aliases";

         //dosql_dml(au_dfat_sanctions_aliases , "au_dfat_sanctions_aliases");


        let birth_date = "UPDATE info ,( SELECT entity_id, date FROM au_dfat_sanctions_birth_dates bd ) AS src"
        +" SET info.birth_date = src.date"
        +" WHERE info.source = src.entity_id AND src.date IS NOT NULL"
      //dosql_dml(birth_date , "info birth date updated");


        let birth_place = "UPDATE info ,( SELECT entity_id, place FROM au_dfat_sanctions_birth_places bd ) AS src"
        +" SET info.birth_place = src.place"
        +" WHERE info.source = src.entity_id AND src.place IS NOT NULL"
      //dosql_dml(birth_place , "info birth place updated");


        let country = "UPDATE info ,( SELECT entity_id, country_name, country_code FROM au_dfat_sanctions_nationalities) AS src"
        +" SET info.nationality = src.country_name"
        +" , info.nationality_code = src.country_code"
        +" WHERE info.source = src.entity_id AND src.country_name IS NOT NULL"
      //dosql_dml(country , "info country updated");


          /////////////////////////// 
          ///// ch_seco sanction/////
          /////////////////////////// 
          let ch_seco_sanctions_table= "insert into sanction_list (name) SELECT source FROM aml.ch_seco_sanctions limit 1;"
          //dosql_dml(ch_seco_sanctions_table, "ch_seco_sanctions_table inserted")

          //// TODO function column has been removed due to error form ch_seco_sanctions tables 
          let ch_seco_sanctions = " insert into info (firstName,  lastName, fatherName ,source, type, summary, program, name) "
          + " SELECT first_name, last_name, father_name, id,  type,  summary, program,  name  FROM ch_seco_sanctions";
      //dosql_dml(ch_seco_sanctions, "insert from ch_seco_sanctions");
        });

        let ch_seco_sanctions_addresses = "  insert into address (source,  note, street, street_2, postal_code, country, country_code, region  )  "
        + " SELECT entity_id, text, street, street_2, postal_code, country_name, country_code, region  FROM ch_seco_sanctions_addresses ";
      //dosql_dml(ch_seco_sanctions_addresses, "insert from ch_seco_sanctions_addresses ");

        let ch_seco_sanctions_aliases  = "insert into info (firstName, lastName, fatherName, name, source , quality, title, second_name, third_name, alias)"
        + " SELECT first_name, last_name, father_name, name, entity_id, quality, title, second_name, third_name , 'yes' FROM ch_seco_sanctions_aliases";
      //dosql_dml(ch_seco_sanctions_aliases , " ch_seco_sanctions_aliases ");

        let ch_seco_birth_date = "UPDATE info ,( SELECT entity_id, date FROM ch_seco_sanctions_birth_dates bd ) AS src"
        +" SET info.birth_date = src.date"
        +" WHERE info.source = src.entity_id AND src.date IS NOT NULL"
       //dosql_dml(ch_seco_birth_date , "info birth date updated from ch_seco_birth_date");


        let ch_seco_sanctions_birth_places = "UPDATE info ,( SELECT entity_id, place, quality FROM ch_seco_sanctions_birth_places ) AS src"
        +" SET info.birth_place = src.place"
        +", info.quality = src.quality"
        +" WHERE info.source = src.entity_id AND src.place IS NOT NULL"
     //dosql_dml(ch_seco_sanctions_birth_places , "ch seco sanctions birth places ");

        let ch_seco_sanctions_identifiers = "UPDATE info ,( SELECT entity_id, country_name, country_code, type, description, number FROM ch_seco_sanctions_identifiers) AS src"
        +" SET info.nationality = src.country_name"
        +" , info.nationality_code = src.country_code"
        +" , info.type = src.type"
        +" , info.description = src.description"
        +" , info.number = src.number"
        +" WHERE info.source = src.entity_id AND src.country_name IS NOT NULL"
     //dosql_dml(ch_seco_sanctions_identifiers, "ch_seco_sanctions_identifiers");

  app.get('/info1', (request, response) => { 

        //////////////////////////// 
        ///// coe_assembly   ///////
        //////////////////////////// 

        ////// insert from au_drat_sanction into INFO table ////////
        let coe_assembly_table= "insert into sanction_list (name) SELECT source FROM aml.interpol_red_notices limit 1;"
       //dosql(coe_assembly_table, "created!" );

        let coe_assembly = " insert into info (firstName, lastName,  source, type, summary,  url, name) "
        + " SELECT first_name, last_name, id,  type,  summary, url, name  FROM coe_assembly";
       //dosql(coe_assembly, "insert from acoe_assembly");

        let coe_assembly_nationalitiescountry = "UPDATE info ,( SELECT entity_id, country_name, country_code FROM coe_assembly_nationalities) AS src"
        +" SET info.nationality = src.country_name"
        +" , info.nationality_code = src.country_code"
        +" WHERE info.source = src.entity_id AND src.country_name IS NOT NULL"
       //dosql(coe_assembly_nationalitiescountry , "info country coe_assembly_nationalitiescountry");

        ///////////////////////////// 
        ///////  eu_meps   /////////
        ////////////////////////////
        let eu_meps_table= "insert into sanction_list (name) SELECT source FROM aml.eu_meps limit 1;"
       //dosql(eu_meps_table, "created!" ); 

        let eu_meps = " insert into info (firstName, lastName,  source, type, summary ) "
        + " SELECT first_name, last_name, id,  type,  summary  FROM coe_assembly";
       //dosql(eu_meps, "info eu_meps");

        let eu_meps_nationalities = "UPDATE info ,( SELECT entity_id, country_name, country_code FROM eu_meps_nationalities) AS src"
        +" SET info.nationality = src.country_name"
        +" , info.nationality_code = src.country_code"
        +" WHERE info.source = src.entity_id AND src.country_name IS NOT NULL ";
       //dosql(eu_meps_nationalities, " eu_meps_nationalities");

        /////////////////////////////////// 
        ///////  everypolitician  /////////
        /////////////////////////////////// 
        let everypolitician_table= "insert into sanction_list (name) SELECT source FROM aml.everypolitician limit 1;"
       //dosql(everypolitician_table, "created!" ); 
         
        let everypolitician = " insert into info ( source, type, program, name , gender ) "
        + " select  id,  type, program, name, gender  FROM everypolitician";
       //dosql(everypolitician, "info everypolitician");
         
        let everypolitician_aliases  = "insert into info (name,  source, alias)   "
        + " SELECT name, entity_id, 'yes'  FROM everypolitician_aliases";
        //dosql(everypolitician_aliases, "everypolitician_aliases");
       
        let everypolitician_nationalities = "UPDATE info ,(SELECT entity_id, country_name, country_code FROM everypolitician_nationalities) AS src"
        +" SET info.nationality = src.country_name"
        +" , info.nationality_code = src.country_code"
        +" WHERE info.source = src.entity_id AND src.country_name IS NOT NULL";
       //dosql(everypolitician_nationalities, "everypolitician_nationalities");

        ////////////////////////////////////// 
        ///////   gb_hmt_sanctions  /////////
        ///////////////////////////////////// 
        let gb_hmt_sanctions_table= "insert into sanction_list (name) SELECT source FROM aml.gb_hmt_sanctions limit 1;"
       //dosql(gb_hmt_sanctions_table, "created!" );
       
        let gb_hmt_sanctions  = " insert into info ( title, lastName, source, type, summary,  program, name , firstName, second_name, third_name ) "
        + "Select title, last_name, id, type, summary, program, name, first_name, second_name, third_name  FROM gb_hmt_sanctions ";
       //dosql(gb_hmt_sanctions , "info gb_hmt_sanctions ");

        let gb_hmt_sanctions_addresses = "insert into address (source,  country, country_code, postal_code, note  )  "
        + " SELECT entity_id, country_name, country_code, postal_code, text  FROM gb_hmt_sanctions_addresses ";
       //dosql(gb_hmt_sanctions_addresses, "gb_hmt_sanctions_addresses");

        let gb_hmt_sanctions_aliases = "insert into info (firstName, second_name, title, lastName,  source, third_name, name, type, alias )   "
        + " SELECT first_name, second_name, title, last_name, entity_id, third_name, name, type, 'yes'  FROM gb_hmt_sanctions_aliases";
       //dosql(gb_hmt_sanctions_aliases, "gb_hmt_sanctions_aliases");

        let gb_hmt_sanctions_birth_dates = "UPDATE info ,( SELECT entity_id, date FROM gb_hmt_sanctions_birth_dates ) AS src"
        +" SET info.birth_date = src.date"
        +" WHERE info.source = src.entity_id AND src.date IS NOT NULL"
       //dosql(gb_hmt_sanctions_birth_dates, "gb_hmt_sanctions_birth_dates");

        let gb_hmt_sanctions_birth_places = "UPDATE info ,( SELECT entity_id, country_name, country_code, place FROM gb_hmt_sanctions_birth_places ) AS src"
        +" SET info.birth_place = src.place"
        +" , info.country_code = src.country_code" ///TODO country codes??
        +" WHERE info.source = src.entity_id AND src.place IS NOT NULL"
        //dosql(gb_hmt_sanctions_birth_places, "gb_hmt_sanctions_birth_places");

        let gb_hmt_sanctions_identifiers = "UPDATE info ,( SELECT entity_id, country_name, country_code, type, number FROM gb_hmt_sanctions_identifiers) AS src"
          +" SET info.nationality = src.country_name"
          +" , info.nationality_code = src.country_code"
          +" , info.type = src.type"
          +" , info.number = src.number"
          +" WHERE info.source = src.entity_id AND src.country_name IS NOT NULL"
        //dosql(gb_hmt_sanctions_identifiers, "gb_hmt_sanctions_identifiers");

       let gb_hmt_sanctions_nationalities = "UPDATE info ,(SELECT entity_id, country_name, country_code FROM gb_hmt_sanctions_nationalities) AS src"
        +" SET info.nationality = src.country_name"
        +" , info.nationality_code = src.country_code"
        +" WHERE info.source = src.entity_id AND src.country_name IS NOT NULL";
       //dosql(gb_hmt_sanctions_nationalities, "gb_hmt_sanctions_nationalities");

       
        ////////////////////////////////////// 
        ////////////   Ineterpol /////////////
        ///////////////////////////////////// 
        let interpol_red_notices_table= "insert into sanction_list (name) SELECT source FROM aml.interpol_red_notices limit 1;"
       //dosql(interpol_red_notices_table, "created!")

        let interpol_red_notices = " insert into info ( firstName, lastName, source, type, summary,  program, url, gender, name  ) "
        + "Select first_name, last_name, id, type, summary, program, url, gender, name  FROM interpol_red_notices ";
       //dosql(interpol_red_notices , "interpol red notices");
         
        let interpol_red_notices_aliases = "insert into info (source, name, alias) "
        + " SELECT entity_id, name, 'yes'  FROM interpol_red_notices_aliases";
       //dosql(interpol_red_notices_aliases, "interpol red notices aliases");
       
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

      
       let interpol_red_notices_nationalities = "UPDATE info ,(SELECT entity_id, country_name, country_code FROM interpol_red_notices_nationalities) AS src"
       +" SET info.nationality = src.country_name"
       +" , info.nationality_code = src.country_code"
       +" WHERE info.source = src.entity_id AND src.country_name IS NOT NULL";
        //dosql(interpol_red_notices_nationalities, "interpol red notices nationalities");


       ///////////////////////////////////////////////
       //////////// kg_fiu_national //////////////////
       ///////////////////////////////////////////////
       let kg_fiu_national_table= "insert into sanction_list (name) SELECT source FROM aml.kg_fiu_national limit 1;"
      // dosql(kg_fiu_national_table, "created!")

       let kg_fiu_national = " insert into info ( firstName, lastName, second_name ,source, type, summary,  program,  name, listed_at) "
       + "Select first_name, last_name, second_name, id, type, summary, program,  name, listed_at  FROM kg_fiu_national ";
      // dosql(kg_fiu_national, "kg_fiu_national"); 
      
       let kg_fiu_national_aliases =  "insert into info (source, name, alias) "
       + " SELECT entity_id, name, 'yes'  FROM kg_fiu_national_aliases";
      // dosql(kg_fiu_national_aliases, "kg fiu national aliases");
      
       let kg_fiu_national_birth_dates = "UPDATE info ,( SELECT entity_id, date FROM kg_fiu_national_birth_dates ) AS src"
       +" SET info.birth_date = src.date"
       +" WHERE info.source = src.entity_id AND src.date IS NOT NULL"
      // dosql(kg_fiu_national_birth_dates, "kg fiu national birth dates")
    
  });

  app.get('/info2', (request, response) => { 
   
       //////////////////////////////////////////////////
       ///////////// ua_sdfm_blacklist //////////////////
       /////////////////////////////////////////////////
       let ua_sdfm_blacklist_table= "insert into sanction_list (name) SELECT source FROM aml.ua_sdfm_blacklist limit 1;"
      //dosql_dml1(ua_sdfm_blacklist_table, "created!")

       let ua_sdfm_blacklist = " insert into info (firstName, lastName, second_name , third_name, source, type, summary, program, url, name, title) "
       + "Select first_name, last_name, second_name, third_name ,id, type, summary, program, url, name, title  FROM ua_sdfm_blacklist ";
       //dosql_dml1(ua_sdfm_blacklist, "ua sdfm blacklist"); 

       let ua_sdfm_blacklist_addresses = "insert into address (source,  country, country_code, postal_code, note  )  "
       + " SELECT entity_id, country_name, country_code, postal_code, text  FROM ua_sdfm_blacklist_addresses";
       //dosql_dml1(ua_sdfm_blacklist_addresses, "ua sdfm blacklist addresses");

       // TODO change name type to TEXT in info table
       let ua_sdfm_blacklist_aliases =  "insert into info (source, name, alias) "
       + " SELECT entity_id, name, 'yes'  FROM ua_sdfm_blacklist_aliases";
       ////dosql_dml1(ua_sdfm_blacklist_aliases, "ua sdfm blacklist aliases");
      
      let ua_sdfm_blacklist_birth_dates = "UPDATE info ,( SELECT entity_id, date FROM ua_sdfm_blacklist_birth_dates ) AS src"
      +" SET info.birth_date = src.date"
      +" WHERE info.source = src.entity_id  AND src.date IS NOT NULL"
      //dosql_dml1(ua_sdfm_blacklist_birth_dates, "ua sdfm blacklist birth dates");
     
      let ua_sdfm_blacklist_birth_places = "UPDATE info ,( SELECT entity_id, place FROM ua_sdfm_blacklist_birth_places) AS src"
      +" SET info.birth_place = src.place"
      // +" , info.country_code = src.country_code" ///TODO country codes??
      +" WHERE info.source = src.entity_id  AND src.place IS NOT NULL"
       //dosql_dml1(ua_sdfm_blacklist_birth_places, "ua sdfm blacklist birth places")

      let ua_sdfm_blacklist_identifiers = "UPDATE info ,( SELECT entity_id, description, country_name, country_code, type, number FROM ua_sdfm_blacklist_identifiers) AS src"
      +" SET info.nationality = src.country_name"
      +" , info.nationality_code = src.country_code"
      +" , info.type = src.type"
      +" , info.number = src.number"
      +" WHERE info.source = src.entity_id  AND src.country_name IS NOT NULL";
       //dosql_dml1(ua_sdfm_blacklist_identifiers, "ua sdfm blacklist identifiers");
    
      let ua_sdfm_blacklist_nationalities =  "UPDATE info ,(SELECT entity_id, country_name, country_code FROM ua_sdfm_blacklist_nationalities) AS src"
      +" SET info.nationality = src.country_name"
      +" , info.nationality_code = src.country_code"
      +" WHERE info.source = src.entity_id  AND src.country_name IS NOT NULL";
       //dosql_dml1(ua_sdfm_blacklist_nationalities, "ua sdfm blacklist nationalities")
   
      //////////////////////////////
      ////// un_sc_sanctions //////
      /////////////////////////////
      let un_sc_sanctions_table= "insert into sanction_list (name) SELECT source FROM aml.un_sc_sanctions limit 1;"
    //dosql_dml1(un_sc_sanctions_table, "created!")
       /// TODO updated_at from this table not consider 

      let un_sc_sanctions = " insert into info (firstName,  second_name , third_name, source, type, summary, program, listed_at,  name, title) "
      + "Select first_name, second_name, third_name ,id, type, summary, program, listed_at,   name, title  FROM un_sc_sanctions  ";
      //dosql_dml1(un_sc_sanctions, "un sc sanctions")

     let un_sc_sanctions_addresses = "insert into address (source,  country, country_code, note, street, city, region  )  "
     + " SELECT entity_id, country_name, country_code, note, street, city, region  FROM un_sc_sanctions_addresses";
     //dosql_dml1(un_sc_sanctions_addresses, "un sc sanctions addresses")
     
     let un_sc_sanctions_aliases =  "insert into info (source, name, quality, alias) "
     + " SELECT entity_id, name, quality, 'yes'  FROM un_sc_sanctions_aliases";
     //dosql_dml1(un_sc_sanctions_aliases, "un_sc_sanctions_aliases");

     let un_sc_sanctions_birth_dates = "UPDATE info ,( SELECT entity_id, date, quality FROM un_sc_sanctions_birth_dates) AS src"
     +" SET info.birth_date = src.date"
     +" , info.quality = src.quality"
     +" WHERE info.source = src.entity_id AND src.date IS NOT NULL "
     //dosql_dml1(un_sc_sanctions_birth_dates, "un_sc_sanctions_birth_dates")

     let un_sc_sanctions_birth_places = "UPDATE info ,( SELECT entity_id, place, country_name, country_code FROM un_sc_sanctions_birth_places) AS src"
     +" SET info.birth_place = src.place"
     +" , info.nationality = src.country_code" ///TODO country codes??
     +" , info.nationality_code = src.country_code"
     +" WHERE info.source = src.entity_id AND src.place IS NOT NULL"
     //dosql_dml1(un_sc_sanctions_birth_places, "un sc sanctions birth places");
    
     let un_sc_sanctions_identifiers = "UPDATE info ,( SELECT entity_id, description, country_name, country_code, type, number, issued_at FROM un_sc_sanctions_identifiers) AS src"
     +" SET info.nationality = src.country_name"
     +" , info.nationality_code = src.country_code"
     +" , info.type = src.type"
     +" , info.number = src.number"
     +" , info.listed_at = src.issued_at"
     +" , info.description = src.description"
     +" WHERE info.source = src.entity_id AND src.country_name IS NOT NULL";
     //dosql_dml1(un_sc_sanctions_identifiers, "un_sc_sanctions_identifiers")

     let un_sc_sanctions_nationalities =  "UPDATE info ,(SELECT entity_id, country_name, country_code FROM un_sc_sanctions_nationalities) AS src"
     +" SET info.nationality = src.country_name"
     +" , info.nationality_code = src.country_code"
     +" WHERE info.source = src.entity_id AND src.country_name IS NOT NULL";
     //dosql_dml1(un_sc_sanctions_nationalities, "un sc sanctions nationalities");

      //////////////////////////////
      ////// us_bis_denied /////////
      /////////////////////////////

      let us_bis_denied_table= "insert into sanction_list (name) SELECT source FROM aml.us_bis_denied limit 1;"
    //dosql_dml1(us_bis_denied_table, "created!")

      let us_bis_denied = " insert into info ( source, type, summary, program, listed_at,  name) "
      + "Select id, type, summary, program, updated_at, name FROM us_bis_denied";
      //dosql_dml1(us_bis_denied , "us_bis_denied")

      let us_bis_denied_addresses = "insert into address (source,  country, country_code, street, postal_code, city, region  )  "
      + " SELECT entity_id, country_name, country_code, street, postal_code, city, region  FROM us_bis_denied_addresses";
      //dosql_dml1(us_bis_denied_addresses, "us_bis_denied_addresses");
    })

      let us_cia_world_leaders = "UPDATE info ,( SELECT id, type, program, url, updated_at, name FROM us_cia_world_leaders) AS src"
      +" SET info.name = src.name"
      +" , info.type = src.type"
      +" , info.program = src.program"
      +" , info.url = src.url"
      +" , info.listed_at = src.updated_at"
      +" WHERE info.source = src.id AND src.name IS NOT NULL";
       //dosql_dml1(us_cia_world_leaders, "us cia world leaders")
     
      let us_cia_world_leaders_nationalities =  "UPDATE info ,(SELECT entity_id, country_name, country_code FROM us_cia_world_leaders_nationalities) AS src"
      +" SET info.nationality = src.country_name"
      +" , info.nationality_code = src.country_code"
      +" WHERE info.source = src.entity_id AND src.country_name IS NOT NULL";
       //dosql_dml1(us_cia_world_leaders_nationalities, "us cia world leaders nationalities")
      
      /////////////////////////////
      ///////// us_ofac //////////
      ////////////////////////////

      let us_ofac_table= "insert into sanction_list (name) SELECT source FROM aml.us_ofac limit 1;"
    //dosql_dml1(us_ofac_table, "created!")

      let us_ofac = "insert into info (  source, type, summary, program, listed_at, name) "
      + "Select id, type, summary, program, updated_at, name FROM us_ofac";
      //dosql_dml1(us_ofac, "us_ofac")
    
      let us_ofac_addresses = "insert into address (source,  country, country_code, street, street_2, city)"
      + " SELECT entity_id, country_name, country_code, street, street_2, city  FROM us_ofac_addresses ";
      //dosql_dml1(us_ofac_addresses, "us ofac addresses")

      let us_ofac_aliases =  "insert into info (source, lastName, quality, type, name, firstName, alias) "
      + " SELECT entity_id, last_name, quality, type, name, first_name, 'yes'  FROM us_ofac_aliases";
      //dosql_dml1(us_ofac_aliases, "us ofac aliases")

      let us_ofac_birth_dates = "UPDATE info ,( SELECT entity_id, date, quality FROM us_ofac_birth_dates) AS src"
      +" SET info.birth_date = src.date"
      +" , info.quality = src.quality" ///TODO country codes??
      +" WHERE info.source = src.entity_id AND src.date IS NOT NULL"
      //dosql_dml1(us_ofac_birth_dates, "us ofac birth dates")
      
      let us_ofac_birth_places = "UPDATE info ,( SELECT entity_id, place, quality FROM us_ofac_birth_places) AS src"
      +" SET info.birth_place = src.place"
      +" , info.quality = src.quality"
      +" WHERE info.source = src.entity_id AND src.place IS NOT NULL"
      //dosql_dml1(us_ofac_birth_places, "us ofac birth places")

      let us_ofac_identifiers = "UPDATE info ,( SELECT entity_id, description, country_name, country_code, type, number FROM us_ofac_identifiers) AS src"
      +" SET info.nationality = src.country_name"
      +" , info.nationality_code = src.country_code"
      +" , info.type = src.type"
      +" , info.number = src.number"
      +" , info.description = src.description"
      +" WHERE info.source = src.entity_id AND src.country_name IS NOT NULL";
      //dosql_dml1(us_ofac_identifiers, "us ofac identifiers")


      //////////////////////////////////////
      /////// worldbank_debarred ///////////
      /////////////////////////////////////

     
      let worldbank_debarred_table= "insert into sanction_list (name) SELECT source FROM aml.worldbank_debarred limit 1;"
    //dosql_dml1(worldbank_debarred_table, "created!")
      
      let worldbank_debarred = "insert into info (  source, program, listed_at, name, url)"
      + "Select id, program, updated_at, name, url FROM worldbank_debarred ";
      //dosql_dml1(worldbank_debarred , "worldbank debarred ")

      let worldbank_debarred_addresses = "insert into address (source,  country, country_code, note)"
      + " SELECT entity_id, country_name, country_code, text  FROM worldbank_debarred_addresses";
      //dosql_dml1(worldbank_debarred_addresses, "worldbank debarred addresses")

      let worldbank_debarred_aliases = "insert into info (source, name, alias) "
      + " SELECT entity_id, name, 'yes' FROM worldbank_debarred_aliases";
      //dosql_dml1(worldbank_debarred_aliases, "worldbank debarred aliases")

      let worldbank_debarred_nationalities = "UPDATE info ,(SELECT entity_id, country_name, country_code FROM worldbank_debarred_nationalities) AS src"
      +" SET info.nationality = src.country_name"
      +" , info.nationality_code = src.country_code"
      +" WHERE info.source = src.entity_id AND src.country_name IS NOT NULL";
      //dosql_dml1(worldbank_debarred_nationalities, "worldbank debarred nationalities")

      
     

  app.listen(
    process.env.PORT  || 3000, ()=>console.log('!')
  )





