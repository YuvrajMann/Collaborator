var DBController = require("../DBController");

let sql=`
    CREATE TABLE IF NOT EXISTS codes(
        current_blob BLOB,
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
        roomId INT,
        last_updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        last_updated_by INT,
        FOREIGN KEY (last_updated_by) REFERENCES users(id),
        FOREIGN KEY (roomId) REFERENCES rooms(id)
    );
`

let createCodeTable=(current_blob,last_updated_by,room_id)=>{
        let myPromise = new Promise((myResolve, myReject)=>{
            DBController.con.query(sql, (err, result) => {
                if (err) {
                    myReject(err);
                } 
                else {
                    let insertSql=`
                        Insert Into codes(current_blob,last_updated_by,roomId) 
                        VALUES('${current_blob}','${last_updated_by}','${room_id}');
                    `;
                    DBController.con.query(insertSql, (err, result) => {
                        if(err){
                            myReject(err);                            
                        }
                        else{
                            myResolve('Inserted'); 
                        }
                    })
                }
            });
    })
    return myPromise;
}


module.exports={
    createCodeTable
};