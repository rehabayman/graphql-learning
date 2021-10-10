const mongoose = require("mongoose");
const database = process.env.DATABASE || "graphql-demo-app";
const databaseHost = process.env.DB_HOST;
const databasePort = process.env.DB_PORT;


const connect = () => {
    mongoose.connect(
        `mongodb://${databaseHost}:${databasePort}/${database}`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        },
        (err) => {
            if (!err) {
                console.log(`connected to MongoDB on port: ${databasePort}`);
            } else {
                console.log(err);
            }
        }
    );
}

module.exports = { connect };