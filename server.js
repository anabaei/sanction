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
  
  

  
 
  /////////////////////////////////////////// source /////////////////////////////////////////////
 ///////////////////////////////////////////////////////////////////////////////////////////////////

  function dosql(table, message)
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
 


////////// TEST
  app.get('/sanction_list', (request, response) => { 

    // let update_alias = "update aml_pro.info ,(select name, source,id from aml_pro.sanction_list) as src set aml_pro.info.sanction_id = src.id"
    // + " where  aml_pro.info.source =  src.source  ";
    // dosql(update_alias, "update sanction_list forieng keys");


    let update_sanction_info = " insert into aml_pro.info_sanction (sanction_list_id,info_id) "
    + " select t.id, b.id from aml_pro.sanction_list t inner join aml_pro.info b on  b.source = t.source; "
    dosql(update_sanction_info, " update_sanction_info ");
 
  });
   
  
  ////////// Allow to parse bodies in json //////////
  ///////////////////////////////////////////////////
  app.get('/aliases', (request, response) => { 

    // var a = "select count(*) from aml_pro.info;"
    // dosql(a, "aa")

    let update_alias = "update aml_pro.info ,(select id, source from aml_pro.info_cluster where alias = 0) as src set aml_pro.info.parent = src.id where aml_pro.info.source = aml_pro.src.source AND aml_pro.info.alias = 1 ";
    dosql(update_alias, "update alias");
   
    // var selection = "UPDATE info ,( Select source, id from aml.info where aml.alias = 'yes' ) AS src"
    // +" SET info.birth_date = src.id"
    // +" WHERE info.source = src.entity_id AND src.date IS NOT NULL"

   // var selection = "select source from aml.info where aml.alias = 'yes' SELECT * FROM aml.info where  source = 'everypolitician.dd6909de-898c-4e2d-8c28-f89a967398b3'' 

      // var jsonResponse = {};
      // var  b = "select * from info"
      // var jsonResponse =  dosql_dmllll(b, "jsonResponse")
    
      //  return JSON.stringify(jsonResponse)
   
       //return json.create_info;
        response.send("created") 
      })



   
    //////////////////////////////////////////// CREAT //////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
      app.get('/create', (request, response) => { 
       
        var drop_sanction = "DROP TABLE IF EXISTS sanction_list";
        var drop_address = "DROP TABLE IF EXISTS address";
        var drop_info_santion = "DROP TABLE IF EXISTS info_sanction";
        var drop_info_cluster = "DROP TABLE IF EXISTS info_cluster";
        var drop_info = "DROP TABLE IF EXISTS info";
        
        dosql_sanction(drop_info, "drop info");
        dosql_sanction(drop_address, "drop address");
        dosql_sanction(drop_info_santion, "drop info santion");
        dosql_sanction(drop_sanction, "drop sanction");
        dosql_sanction(drop_info_cluster, "drop info cluster");
        
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
        +", sanction_id VARCHAR(255)"
        +", alias boolean DEFAULT false"
        +", parent VARCHAR(255), PRIMARY KEY (ID) )";
        dosql_sanction(create_info, "created info");

        ///////// INFO  Cluster ///////////
        var create_info_cluster = " CREATE TABLE info_cluster (ID int NOT NULL AUTO_INCREMENT, name Text, "
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
        +", sanction_id VARCHAR(255)"
        +", alias boolean DEFAULT false"
        +", parent VARCHAR(255), PRIMARY KEY (ID) )";
        dosql_sanction(create_info_cluster, "created info cluster");
        
        

        ///////// Address ///////////
        var create_address = " CREATE TABLE address (ID int NOT NULL AUTO_INCREMENT, source VARCHAR(255) UNIQUE, info_id INT, "
        +"country VARCHAR(255), "
        +"city VARCHAR(255), "
        +"street VARCHAR(255), "
        +"postal_code VARCHAR(255), "
        +"country_code VARCHAR(255), "
        +"region VARCHAR(255), "
        +"note Text, "
        +"street_2 VARCHAR(255), PRIMARY KEY (ID))";
        dosql_sanction(create_address, "created address");
      
        ///////// Info-Sanction ///////////
        var create_info_sanction = " CREATE TABLE info_sanction (ID int NOT NULL AUTO_INCREMENT, sanction_list_id INT, "
        +"info_id INT, PRIMARY KEY (ID) )";
        dosql_sanction(create_info_sanction, "created info sanction");

        ///////// sanction_list ///////////
        var sanction_list = " CREATE TABLE sanction_list (ID int NOT NULL AUTO_INCREMENT, name VARCHAR(255) UNIQUE, source VARCHAR(255), PRIMARY KEY (ID, name)) ";
        dosql_sanction(sanction_list , " Created sanctionist");
        response.send(`created!`);

        
  })


///// insert into info (name,  source) SELECT name, entity_id  FROM au_dfat_sanctions_aliases  //

  app.get('/info0', (request, response) => { 

        
          ///// AU_DFAT sanction ////
          /////////////////////////// 
          let au_dfat_sanctions_table= "insert into aml_pro.sanction_list (name,source) SELECT source,id FROM aml.au_dfat_sanctions"
          + " ON DUPLICATE KEY update"
          + " aml_pro.sanction_list.source = aml_pro.sanction_list.source";
          dosql(au_dfat_sanctions_table, "au_dfat_sanctions inserted")

          ////// insert from au_drat_sanction into INFO table ////////
          let au_dfat_sanctions_cluster = "insert into aml_pro.info_cluster (name,  source, type, summary, program, url) "
          + " SELECT name, id,  type,  summary, program, url  FROM aml.au_dfat_sanctions ";
            dosql(au_dfat_sanctions_cluster, "clustered info");
  
          let au_dfat_sanctions = "insert into aml_pro.info (name,  source, type, summary, program, url) "
        + " SELECT name, id,  type,  summary, program, url  FROM aml.au_dfat_sanctions ";
          dosql(au_dfat_sanctions, "insert from au_dfat_sanctions");

        ///// insert from sanction address into address table ///////

        let au_dfat_address = "insert into aml_pro.address (source,  note)"
        + " SELECT entity_id, text FROM aml.au_dfat_sanctions_addresses "
        + "ON DUPLICATE KEY UPDATE"
        + " aml_pro.address.note = aml.au_dfat_sanctions_addresses.text";
        dosql(au_dfat_address, "insert from sanction address");
        //// Just add to that then we specifies aliases ////
        
        

        let au_dfat_sanctions_aliases_cluster  = "insert into aml_pro.info_cluster (name, source, alias)"
        + " SELECT name, entity_id, true FROM aml.au_dfat_sanctions_aliases ";
        dosql(au_dfat_sanctions_aliases_cluster , " info_cluster");

        let au_dfat_sanctions_aliases  = "insert into aml_pro.info(name, source, alias)"
        + " SELECT name, entity_id, true FROM aml.au_dfat_sanctions_aliases";
         dosql(au_dfat_sanctions_aliases , "au_dfat_sanctions_aliases");


         let update_alias = "update aml_pro.info ,(select id, source from aml_pro.info_cluster where alias = false) as src set aml_pro.info.parent = src.id where aml_pro.info.source = aml_pro.src.source";
         dosql(update_alias, "update alias");


        let birth_date = "UPDATE aml_pro.info ,( SELECT entity_id, date FROM aml.au_dfat_sanctions_birth_dates ) AS src"
        +" SET aml_pro.info.birth_date = src.date"
        +" WHERE aml_pro.info.source = src.entity_id AND src.date IS NOT NULL"
        dosql(birth_date , "info birth date updated");


        let birth_place = "UPDATE aml_pro.info ,( SELECT entity_id, place FROM aml.au_dfat_sanctions_birth_places bd ) AS src"
        +" SET aml_pro.info.birth_place = src.place"
        +" WHERE aml_pro.info.source = src.entity_id AND src.place IS NOT NULL"
        dosql(birth_place , "info birth place updated");


        let country = "UPDATE aml_pro.info ,( SELECT entity_id, country_name, country_code FROM aml.au_dfat_sanctions_nationalities) AS src"
        +" SET aml_pro.info.nationality = src.country_name"
        +" , aml_pro.info.nationality_code = src.country_code"
        +" WHERE aml_pro.info.source = src.entity_id AND src.country_name IS NOT NULL"
        dosql(country , "info country updated");


          /////////////////////////// 
          ///// ch_seco sanction/////
          /////////////////////////// 
          let ch_seco_sanctions_table= "insert into aml_pro.sanction_list (name, source) SELECT source,id FROM aml.ch_seco_sanctions ON DUPLICATE KEY UPDATE aml_pro.sanction_list.source = aml_pro.sanction_list.source";
        

          dosql(ch_seco_sanctions_table, "ch_seco_sanctions_table inserted")

          //// TODO function column has been removed due to error form ch_seco_sanctions tables 
          let ch_seco_sanctions = " insert into aml_pro.info (firstName,  lastName, fatherName ,source, type, summary, program, name) "
          + " SELECT first_name, last_name, father_name, id,  type,  summary, program,  name  FROM aml.ch_seco_sanctions";
           dosql(ch_seco_sanctions, "insert from ch_seco_sanctions");
        
          let ch_seco_sanctions_cluster = " insert into aml_pro.info_cluster (firstName,  lastName, fatherName ,source, type, summary, program, name) "
          + " SELECT first_name, last_name, father_name, id,  type,  summary, program,  name  FROM aml.ch_seco_sanctions";
          dosql(ch_seco_sanctions_cluster, "insert from ch_seco_sanctions cluster");
        
        

        let ch_seco_sanctions_addresses = " insert aml_pro.address (source,  note, street, street_2, postal_code, country, country_code, region  )  "
        + " SELECT entity_id, text, street, street_2, postal_code, country_name, country_code, region  FROM aml.ch_seco_sanctions_addresses "
        + " ON DUPLICATE KEY update"
        + "   aml_pro.address.note  = aml_pro.address.note ";
        dosql(ch_seco_sanctions_addresses, "insert from ch_seco_sanctions_addresses ");

        let ch_seco_sanctions_aliases  = "insert into aml_pro.info (firstName, lastName, fatherName, name, source , quality, title, second_name, third_name, alias)"
        + " SELECT first_name, last_name, father_name, name, entity_id, quality, title, second_name, third_name , true FROM aml.ch_seco_sanctions_aliases ";
        dosql(ch_seco_sanctions_aliases , " aliases inserted");

        let ch_seco_sanctions_aliases_cluster  = "insert into aml_pro.info_cluster (firstName, lastName, fatherName, name, source , quality, title, second_name, third_name, alias)"
        + " SELECT first_name, last_name, father_name, name, entity_id, quality, title, second_name, third_name , true FROM aml.ch_seco_sanctions_aliases ";
        dosql(ch_seco_sanctions_aliases_cluster  , " aliases cluster inserted");
      

        let ch_seco_birth_date = "UPDATE aml_pro.info ,( SELECT entity_id, date FROM aml.ch_seco_sanctions_birth_dates ) AS src"
        +" SET aml_pro.info.birth_date = src.date"
        +" WHERE aml_pro.info.source = src.entity_id AND src.date IS NOT NULL"
        dosql(ch_seco_birth_date , "info birth date updated from ch_seco_birth_date");


        let ch_seco_sanctions_birth_places = "UPDATE aml_pro.info ,( SELECT entity_id, place, quality FROM aml.ch_seco_sanctions_birth_places ) AS src"
        +" SET aml_pro.info.birth_place = src.place"
        +", aml_pro.info.quality = src.quality"
        +" WHERE aml_pro.info.source = src.entity_id AND src.place IS NOT NULL"
        dosql(ch_seco_sanctions_birth_places , "ch seco sanctions birth places ");

        let ch_seco_sanctions_identifiers = "UPDATE aml_pro.info ,( SELECT entity_id, country_name, country_code, type, description, number FROM aml.ch_seco_sanctions_identifiers) AS src"
        +" SET aml_pro.info.nationality = src.country_name"
        +" , aml_pro.info.nationality_code = src.country_code"
        +" , aml_pro.info.type = src.type"
        +" , aml_pro.info.description = src.description"
        +" , aml_pro.info.number = src.number"
        +" WHERE aml_pro.info.source = src.entity_id AND src.country_name IS NOT NULL"
        dosql(ch_seco_sanctions_identifiers, "ch_seco_sanctions_identifiers");

      });

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


  





