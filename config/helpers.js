const MySqli = require("mysqli");

let conn = new Mysqli({
    Host: 'localhost', // IP/domain name 
    post: 3306, // port, default 3306 
    user: 'carlos', // username 
    passwd: '1234', // password 
    db: 'mega_shop'
});


let db = conn.emit(false, '');

module.exports = {
    database: db
};