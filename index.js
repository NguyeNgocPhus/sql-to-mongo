"use strict";

const mongodb = require('mongodb');
const sql = require('mssql');
const E = require('linq');

const config = require("./config.js");

//
// Replicate an entire SQL table to MongoDB.
//
async function replicateTable(tableName, targetDb, sqlPool, config) {
   

    const collection = targetDb.collection(tableName);

    const query = "select * from [" + tableName + "]";
    console.log("Executing query: " + query);
    const tableResult = await sqlPool.request().query(query);

    console.log("Got " + tableResult.recordset.length + " records from table " + tableName);

    if (tableResult.recordset.length === 0) {
        console.log('No records to transfer.');
        return;
    }


    const bulkRecordInsert = E.from(tableResult.recordset)
        .select(row => {
           
            
            if(row.Id !== undefined && row.Id !== null ){
                row._id = row["Id"] + "";
                delete row["Id"];
            }
            if(row.id !== undefined && row.id !== null ){
                row._id = row["id"] + "";
                delete row["id"];
            }
            if (row.UnitCode !== undefined && row.UnitCode !== null) {
                row.UnitCode = row.UnitCode.replace(".","");
            }
            if (row.CreatedBy !== undefined && row.CreatedBy !== null && !isNaN(row.CreatedBy)) {
                row.CreatedBy = row.CreatedBy + "";
            }
            if (row.Createdby !== undefined && row.Createdby !== null && !isNaN(row.Createdby)) {
                row.Createdby = row.Createdby + "";
            }
            if (row.UpdatedBy !== undefined && row.UpdatedBy !== null && !isNaN(row.UpdatedBy)) {
                row.UpdatedBy = row.UpdatedBy + "";
            }
            if (row.UnitId !== undefined && row.UnitId !== null && !isNaN(row.UnitId)) {
                row.UnitId = row.UnitId + "";
            }
            if (row.UnitChannelId !== undefined && row.UnitChannelId !== null && !isNaN(row.UnitChannelId)) {
                row.UnitChannelId = row.UnitChannelId + "";
            }
            if (row.UserChannelId !== undefined && row.UserChannelId !== null && !isNaN(row.UserChannelId)) {
                row.UserChannelId = row.UserChannelId + "";
            }
            if (row.UnitID !== undefined && row.UnitID !== null && !isNaN(row.UnitID)) {
                row.UnitID = row.UnitID + "";
            }
            if (row.UserId !== undefined && row.UserId !== null && !isNaN(row.UserId)) {
                row.UserId = row.UserId + "";
            }
            if (row.RoleId !== undefined && row.RoleId !== null && !isNaN(row.RoleId)) {
                row.RoleId = row.RoleId + "";
            }
            if (row.ChannelId !== undefined && row.ChannelId !== null && !isNaN(row.ChannelId)) {
                row.ChannelId = row.ChannelId + "";
            }
            if (row.DeviceId !== undefined && row.DeviceId !== null && !isNaN(row.DeviceId)) {
                row.DeviceId = row.DeviceId + "";
            }
            if (row.AgentGroupId !== undefined && row.AgentGroupId !== null && !isNaN(row.AgentGroupId)) {
                row.AgentGroupId = row.AgentGroupId + "";
            }
            if (row.BlackListId !== undefined && row.BlackListId !== null && !isNaN(row.BlackListId)) {
                row.BlackListId = row.BlackListId + "";
            }
            if (row.ParentId !== undefined && row.ParentId !== null && !isNaN(row.ParentId)) {
                row.ParentId = row.ParentId + "";
            }
            if (row.EmailTemplateTypeId !== undefined && row.EmailTemplateTypeId !== null && !isNaN(row.EmailTemplateTypeId)) {
                row.EmailTemplateTypeId = row.EmailTemplateTypeId + "";
            }
            if (row.TimeGroupId !== undefined && row.TimeGroupId !== null && !isNaN(row.TimeGroupId)) {
                row.TimeGroupId = row.TimeGroupId + "";
            }
            if (row.UserAdminId !== undefined && row.UserAdminId !== null && !isNaN(row.UserAdminId)) {
                row.UserAdminId = row.UserAdminId + "";
            }
            if (row.TemplateCloneId !== undefined && row.TemplateCloneId !== null && !isNaN(row.TemplateCloneId)) {
                row.TemplateCloneId = row.TemplateCloneId + "";
            }
            if (row.ChannelPackageId !== undefined && row.ChannelPackageId !== null && !isNaN(row.ChannelPackageId)) {
                row.ChannelPackageId = row.ChannelPackageId + "";
            }
            if (row.ReportToId !== undefined && row.ReportToId !== null && !isNaN(row.ReportToId)) {
                row.ReportToId = row.ReportToId + "";
            }
            if (row.ProfileId !== undefined && row.ProfileId !== null && !isNaN(row.ProfileId)) {
                row.ProfileId = row.ProfileId + "";
            }
            if (row.EmailTemplateSystemTypeId !== undefined && row.EmailTemplateSystemTypeId !== null && !isNaN(row.EmailTemplateSystemTypeId)) {
                row.EmailTemplateSystemTypeId = row.EmailTemplateSystemTypeId + "";
            }



            return {
                insertOne: {
                    document: row
                },
            }
        })
        .toArray();

    await collection.bulkWrite(bulkRecordInsert);
};


async function main() {

    
    

    const sqlPool = await sql.connect(config.sqlConnectionString);

    const listDb = await sqlPool.request().query("SELECT name FROM sys.databases WHERE database_id > 4");
    await sql.close();
    await sqlPool.close();



    for (const db of listDb.recordset) {
        try{
            let dbName = db.name;

            if(config.skip_db.some(x=> x == dbName)){
                continue;
            }
            const mongoClient = await mongodb.MongoClient.connect(config.mongoConnectionString);
            const targetDb = mongoClient.db(dbName.replace(".",""));
    
            const partialConnectionString = config.partialConnectionString.replace("[DB_Partial]", dbName);
            const partialSqlPool = await sql.connect(partialConnectionString);
    
    
            const tablesResult = await partialSqlPool.request().query(`SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE' and TABLE_NAME != '__EFMigrationsHistory'`);
            const tableNames = E.from(tablesResult.recordset)
                .select(row => row.TABLE_NAME)
                .where(tableName => config.skip_table.indexOf(tableName) === -1)
                .distinct()
                .toArray();
    
            console.log("Replicating SQL tables " + tableNames.join(', '));
           
            targetDb.dropDatabase();
            console.log("Drop database : " + targetDb);
            for (const tableName of tableNames) {
                 await replicateTable(tableName, targetDb, partialSqlPool, config);    
            }
    
    
            await sql.close();
            await partialSqlPool.close();
            await mongoClient.close();
        }catch{
            continue;
        }
        
    }

    

}

main()
    .then(() => {
        console.log('Done');
    })
    .catch(err => {
        console.error("Database replication errored out.");
        console.error(err);
    });

