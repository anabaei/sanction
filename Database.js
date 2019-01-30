

////////////////////////// DATABASE /////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

const mysql = require('mysql');

class Database 
{
    
    constructor( config ) 
    {
        this.connection = mysql.createConnection( config );
        cnt=0;
    }
    query( sql, args ) 
    {
        return new Promise( ( resolve, reject ) => 
        {
            this.connection.query( sql, args, ( err, rows ) => 
            {
                if ( err )
                {
                    console.log("ERR= "+ err);
                    return reject( err );
                }
                    
                else {
                    console.log("------- "+cnt+" ---------");  
                    console.log(sql);
                  
                    resolve( rows );
                }    cnt++;
                
            });
        });
    }
    close() 
    {
        return new Promise( ( resolve, reject ) => 
        {
            this.connection.end( err => 
            {
                if ( err )
                    return reject( err );
                resolve();
            });
        } );
    }
}
module.exports = Database;
