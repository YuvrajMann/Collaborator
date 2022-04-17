var DBController = require("../DBController");

let sql=`
    CREATE TABLE IF NOT EXISTS chats(
        chat_blob VARCHAR(255),
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        sendTime VARCHAR(255),
        roomId INT,
        chat_owner INT,
        FOREIGN KEY (chat_owner) REFERENCES users(id),
        FOREIGN KEY (roomId) REFERENCES rooms(id)
    );
`

let createChatTable=(chat_blob,sendTime,room_id,chat_owner)=>{
        let myPromise = new Promise((myResolve, myReject)=>{
            DBController.con.query(sql, (err, result) => {
                if (err) {
                    myReject(err);
                } 
                else {
                    let insertSql=`
                        Insert Into chats(chat_blob,sendTime,roomId,chat_owner) 
                        VALUES('${chat_blob}','${sendTime}','${room_id}','${chat_owner}');
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
    createChatTable
};