var DBController = require("../DBController");

let sql = `
    CREATE TABLE IF NOT EXISTS codes(
        current_blob BLOB,
        roomId INT,
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
        last_updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (roomId) REFERENCES rooms(id)
    );
`
let alterCodeTable = (update_blob, room_id) => {
    let myPromise = new Promise((myResolve, myReject) => {
        DBController.con.query(sql, (err, result) => {
            if (err) {
                myReject(err);
            }
            else {
                let updateSql = `
                    UPDATE codes
                    SET current_blob='${update_blob}'
                    where roomId='${room_id}';
                `;

                DBController.con.query(updateSql, (err, result) => {
                    if (err) {
                        myReject(err);
                    }
                    else {
                        myResolve('Update');
                    }
                })
            }
        });
    })

    return myPromise;
}
let createCodeTable = (current_blob, room_id) => {
    let myPromise = new Promise((myResolve, myReject) => {
        DBController.con.query(sql, (err, result) => {
            if (err) {
                myReject(err);
            }
            else {
                let insertSql = `
                        Insert Into codes(current_blob,roomId) 
                        VALUES('${current_blob}','${room_id}');
                    `;
                DBController.con.query(insertSql, (err, result) => {
                    if (err) {
                        myReject(err);
                    }
                    else {
                        myResolve('Inserted');
                    }
                })
            }
        });
    })
    return myPromise;
}


module.exports = {
    createCodeTable,
    alterCodeTable
};