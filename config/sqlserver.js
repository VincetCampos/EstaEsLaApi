require('dotenv').config();

const dbServer = process.env.DB_SERVER; //|| "VINCET";
const user = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_NAME;


const config = {
    server: dbServer,
    user: user,
    password: password,
    database: database,
    options:{
        trustServerCertificate: true
    }
}

module.exports.config = config;