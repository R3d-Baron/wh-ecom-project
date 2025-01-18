const mongoose = require("mongoose");
const mongoConfig = require("./index").Mongo;
mongoose.set("strictQuery", false);
mongoose.set("debug", process.env.APP_ENV == "development" ? true : false);


let url =
  process.env.APP_ENV == "development"
    ? `mongodb://` + mongoConfig.path + "/" + mongoConfig.dbName
    : "mongodb://" +
      mongoConfig.user +
      ":" +
      mongoConfig.pwd +
      "@" +
      mongoConfig.path +
      "/" +
      mongoConfig.dbName +
      "?retryWrites=true&w=majority";

let options = {
  // useNewUrlParser: true, // deprecated
  // useUnifiedTopology: true, // deprecated
  serverSelectionTimeoutMS: 50000, // Increase timeout to 50 seconds
  authSource: "admin", // Add this if authentication is against the 'admin' database
};

const connectDatabase = async () => {
    try {
        await mongoose.connect(url, options).then((data) => {
            if (process.env.APP_ENV == "development") {
                console.log(`mongodb://` + mongoConfig.path + "/" + mongoConfig.dbName);
            } else {
                console.log(`Mongodb connected with server: mongodb://${data.connection.host}:${data.connection.port}/${data.connection.name}`);
            }
        });
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        // process.exit(1);
    }
};

module.exports = connectDatabase;
