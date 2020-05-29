const database = require("mongoose");
database.set('useCreateIndex', true)

module.exports = function connectDB() {
    return new Promise((res, rej) => {
        database.connect("mongodb://127.0.0.1:27017/chat", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, (err) => {
            if(err) rej(err)
            else res()
        });
    });
}
