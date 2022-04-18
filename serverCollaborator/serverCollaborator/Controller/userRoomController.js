var DBController = require("../DBController");

let sql=`
    CREATE TABLE IF NOT EXISTS usersRooms (
       user_id INT,
       room_id INT,
       FOREIGN KEY (user_id) REFERENCES users(id),
       FOREIGN KEY (room_id) REFERENCES rooms(id),
       PRIMARY KEY (user_id, room_id)
    );
`

let createUserRoomTable=(user_id,room_id)=>{
        let myPromise = new Promise((myResolve, myReject)=>{
            DBController.con.query(sql, (err, result) => {
                if (err) {
                    myReject(err);
                } 
                else {
                    let insertSql=`
                        Insert Into usersRooms(user_id,room_id) VALUES('${user_id}','${room_id}');
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
            }  
        );
    })
    return myPromise;
}


module.exports={
    createUserRoomTable
};