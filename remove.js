const {MongoClient } = require('mongodb');
const config = require("./config.js");
// Replace the uri string with your MongoDB deployment's connection string.
const uri = config.mongoConnectionString;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    // Get the database and collection on which to run the operation
    const databasesList = await client.db().admin().listDatabases();
    databasesList.databases.forEach(async db => {
       
        if(db.name.includes("Partial_DB")){
            
            const database = client.db(db.name);
            await database.dropDatabase();
        }
      });

  } finally {
    
  }
}
run().catch(console.dir);