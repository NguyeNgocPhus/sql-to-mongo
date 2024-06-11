module.exports = {
    sqlConnectionString: "Server=172.23.90.56,1433;Database=SSO_Center_DB_28_4;User Id=sa;Password=123@123a; TrustServerCertificate=True;Encrypt=false;",// Insert your connection string here.
    partialConnectionString: "Server=172.23.90.56,1433;Database=[DB_Partial];User Id=sa;Password=123@123a; TrustServerCertificate=True;Encrypt=false;", 
    mongoConnectionString: "mongodb://172.23.90.55:27017", // This puts the resulting database in MongoDB running on your local PC.
    skip_table: [ // Add the tables here that you don't want to replicate to MongoDB.

    // "AccessLog",
    // "AccessPermissionLog",
    // "AgentGroup",
    // "AgentGroupUser",
    // "BaseAppAccessLog",
    // "BlackList",
    // "Categories",
    // "Channels",
    // "ConfigData",
    // "ConfigSystemRole",
    // "Device",
    // "EmailTemplateFields",
    // "EmailTemplateSystemTypes",
    // "EmailTemplates",
    // "ExceptionBlackList",
    // "Menus",
    // "PackageServiceChannel",
    // "RolePortal",
    // "Roles",
    // "RoleUsers",
    // "TemplateClone",
    // "TimeGroup",
    // "TimeGroupTimeList",
    // "TwoFAConfig",
    // "UnitChannels",
    // "UserDevice",
    // "Users",
    // "BlackListSubdomain",
    // "Units",
    
    ],
    skip_db: [ // Add the tables here that you don't want to replicate to MongoDB.
            "DB_C247_STANDARD",
          "SSO_Center_DB_28_4",
             "Test1",
            "TicketReservations",
            "SSO_Center_Domain",
               "IdentityServer4",
              "TicketReservations","BCC01","BCC01_Recording","BCC01_V2","BCC02","BCC02_V2","BCC03_Recording","BCC03_V2"
    
    ],
};