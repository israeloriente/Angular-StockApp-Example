var parse = require("./parse-service");
var mail = require("./email-service");


//                                      @@@@@@@@@@@@@@@@@@@@ USER @@@@@@@@@@@@@@@@@@@@
Parse.Cloud.define("userIsAdm", async (request) => { return await parse.userIsAdm(request)});
Parse.Cloud.define("createUser", async (request) => { return await parse.createUser(request)});
Parse.Cloud.define("destroyUser", async (request) => { return await parse.destroyUser(request)});

//                                      @@@@@@@@@@@@@@@@@@@@ EMAIL SERVICE @@@@@@@@@@@@@@@@@@@@
Parse.Cloud.define("reportFromStudent", async (request) => { return await mail.reportFromStudent(request)});
Parse.Cloud.define("reportFromCooperator", async (request) => { return await mail.reportFromCooperator(request)});


//                                      @@@@@@@@@@@@@@@@@@@@ EVENTS HOOKS @@@@@@@@@@@@@@@@@@@@
// Define User ACL
Parse.Cloud.beforeSave(Parse.User, (request) => {
    const ACL = new Parse.ACL();
    ACL.setRoleWriteAccess('Admin', true);
    ACL.setRoleReadAccess('Admin', true);
    request.object.setACL(ACL);
});

// Define Product ACL
Parse.Cloud.beforeSave("Product", (request) => {
    if (!request.user && !request.master) throw new Error( 'no_session');
    const ACL = new Parse.ACL();
    ACL.setRoleReadAccess('Admin', true);
    ACL.setRoleWriteAccess('Admin', true);
    ACL.setPublicReadAccess(true);
    request.object.setACL(ACL);
});
// Define Mail ACL
Parse.Cloud.beforeSave("Mail", (request) => {
    if (!request.user && !request.master) throw new Error( 'no_session');
    const ACL = new Parse.ACL();
    ACL.setRoleReadAccess('Admin', true);
    ACL.setRoleWriteAccess('Admin', true);
    request.object.setACL(ACL);
});