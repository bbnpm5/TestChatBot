/*-----------------------------------------------------------------------------
A simple echo bot for the Microsoft Bot Framework. 
-----------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('botbuilder');
//var botbuilder_azure = require("botbuilder-azure");

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
    openIdMetadata: process.env.BotOpenIdMetadata 
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

/*----------------------------------------------------------------------------------------
* Bot Storage: This is a great spot to register the private state storage for your bot. 
* We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
* For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
* ---------------------------------------------------------------------------------------- */

//var tableName = 'botdata';
//var azureTableClient = new botbuilder_azure.AzureTableClient(tableName, process.env['AzureWebJobsStorage']);
//var tableStorage = new botbuilder_azure.AzureBotStorage({ gzipData: false }, azureTableClient);

// Create your bot with a function to receive messages from the user
var bot = new builder.UniversalBot(connector);
//bot.set('storage', tableStorage);

bot.dialog('/', [
    function (session) {
        if (session.message.text.toLowerCase() =="Hi".toLowerCase()) {
			session.beginDialog('getMenu', session.userData.profile);		
		}
        else if (session.message.text.toLowerCase() =="Yes Thanks".toLowerCase()){
            session.beginDialog('FurtherYesNo', session.userData.profile);
        }
        else if(session.message.text.toLowerCase()=="speter".toLowerCase()){
			session.send("Please provide the SAP System Id");
		}
		else if(session.message.text.toLowerCase()=="MOD".toLowerCase()){
			session.send("Please wait for a moment. I am working on your request");
			session.send("User: speter unlocked successfully!");
			session.beginDialog('LoginYesNo');
		}
		else if (session.message.text.toLowerCase()=="Costa Rica region".toLowerCase()){
			session.send("Sure, let me open the report. ");
			require("openurl").open("https://idb-yarvis-demo.azurewebsites.net/index.php/pending-invoices-4/")
			session.sendTyping();
    		setTimeout(function () {
        		session.send("Click here for download");
    		}, 3000);
			
		}
		else if (session.message.text.toLowerCase()=="Thanks. Send email to these contractuals to submit their invoices".toLowerCase()){
			session.send("You are welcome. The emails have been sent");
			session.beginDialog('FurtherYesNo');
		}
		else if (session.message.text.toLowerCase() =="Fund 1000, Cost Center 100000 and WBS XYZ".toLowerCase()){
			session.send("I have sent the report for the current period and YTD to your email address");
		}
		else if (session.message.text.toLowerCase()=="3 days - Jan 17th thru 19th".toLowerCase()){
			session.beginDialog('LeaveYesNo');
		}
		else if (session.message.text=="yes"){
			session.send("Great!");
			session.beginDialog('FurtherYesNo');
		}  
        else if ((session.message.text.toLowerCase()).includes(("thank").toLowerCase())){
			session.send("You are welcome. Can I help you with anything else?");  //session.message.text.toLowerCase()=="thanks".toLowerCase()
		}
		else if (session.message.text=="Yes"){			
			session.beginDialog('getMenu1', session.userData.profile);
		}
		else if (session.message.text.toLowerCase()=="No".toLowerCase()){
			session.send("Have a nice day");
		}
        else{
			var customMessage = new builder.Message(session)
			.text("Please enter proper keyword.")
			.textFormat("plain")
			.textLocale("en-us");
			session.send(customMessage);
		}
        
    },
    
]);

bot.dialog('getMenu', [
    function (session) {
        builder.Prompts.choice(session, "Hi Sam. How can I help you?", "HR Support|Unlock SAP User|My Commitments/Actuals and Budget|Portal banner update", { listStyle: builder.ListStyle.button });
    },
    function (session, results) {
        if (results.response.entity=="HR Support") {            
			session.beginDialog('getHRData');
        }
		else if (results.response.entity=="My Commitments/Actuals and Budget"){
			session.send("What is the Fund, Cost Center and WBS?");
			session.endDialog();
		}
		else if (results.response.entity=="Unlock SAP User"){
			session.send("Please provide your SAP User Id.");
			session.endDialog();
		}
		else {
            session.send("OK");
        }
		//session.endDialog();
    }
	
]);

bot.dialog('getMenu1', [
    function (session) {
        builder.Prompts.choice(session, "How can I help you?", "HR Support|Unlock SAP User|My Commitments/Actuals and Budget|Portal banner update", { listStyle: builder.ListStyle.button });
    },
    function (session, results) {
        if (results.response.entity=="HR Support") {            
            //session.send("What type of HR services you need?"); 
			session.beginDialog('getHRData');
        }
		else if (results.response.entity=="My Commitments/Actuals and Budget"){
			session.send("What is the Fund, Cost Center and WBS?");
			session.endDialog();
		}
		else if (results.response.entity=="Unlock SAP User"){
			session.send("Please provide your SAP User Id");
			session.endDialog();
		}
		else {
            session.send("OK");
        }
    }
	
]);

bot.dialog('getHRData', [
    function (session) {
        builder.Prompts.choice(session, "What kind of HR support do you need?", "Change Address|Benefits and Payments|Pending Invoices", { listStyle: builder.ListStyle.button });
    },
    function (session, results) {
		console.log("Enter in the results func : getHRData: ",results.response.entity);
        if (results.response.entity=="Change Address") {
            session.send("Sam, your address in the corporate records is:")
			session.send("Sam Peter")
			session.send("Fredsgatan 5\r\nPurto Madero\r\nMedelpad 17");
			session.send("Sweden - 84102"); 
			session.beginDialog('getAddressYesNo');
        }
		else if (results.response.entity=="Benefits and Payments"){
			session.beginDialog('getBenefits');
		}
		else if(results.response.entity=="Pending Invoices"){
			session.send("Do you want company wide or region Specific?");
			session.endDialog();
		}
		else {
            session.send("OK");
        }
    }
	
]);

bot.dialog('getBenefits', [
    function (session) {
        builder.Prompts.choice(session, "How can I help you?", "Benefits Participation Overview|Salary Statement|Time and Leave Management|Retirement Benefits", { listStyle: builder.ListStyle.button });
    },
    function (session, results) {
        if (results.response.entity=="Benefits Participation Overview") {
            session.send("Let me pull that info."); 
			session.send("1. Medical Insurance Provider: Aetna \n2. Dental Insurance Provider: United Healthcare \n3. Vision Insurance Provider:e-Vision \n4. 401K Provider: Fidelity");
			session.endDialog();
        }
		else if (results.response.entity=="Salary Statement"){
			session.send("Yes, let me open the Salary Statement Service Page.");
			session.endDialog();
		}
		else if (results.response.entity=="Time and Leave Management"){
			session.send("You have 5 days of quota left");			
			session.beginDialog('getLeave');			
		}
    }
	
]);

bot.dialog('getLeave', [
    function (session) {
        builder.Prompts.choice(session, "Do you want to apply for leave?", "Yes|No", { listStyle: builder.ListStyle.button });
    },
    function (session, results) {
        if (results.response.entity=="Yes") {
            session.send("Please provide the dates");
			session.endDialog(); 
        }
		else if (results.response.entity=="No"){
		    session.beginDialog('FurtherYesNo');			
		}
    }
	
]);

bot.dialog('getAddressYesNo', [
    function (session) {
        builder.Prompts.choice(session, "Do you want to change the address?", "Yes|No", { listStyle: builder.ListStyle.button });
    },
    function (session, results) {
		console.log("Enter in the results func: getBenefits : ",results.response.entity);
        if (results.response.entity=="Yes") {            
			session.send("Sure. Let me open the Address Change page for you so you can update it");
			require("openurl").open("https://idb-yarvis-demo.azurewebsites.net/index.php/address-change/")
			session.sendTyping();
    		setTimeout(function () {
        		session.send("Were you able to succesfully change the address?");
    		}, 3000);
									
			session.endDialog();
        }
		else if (results.response.entity=="No"){
			session.send("Have a nice day");
			session.endDialog();
		}		
    }	
]);

bot.dialog('FurtherYesNo', [
    function (session) {
        builder.Prompts.choice(session, "Do you want me to do anything else?", "Yes|No", { listStyle: builder.ListStyle.button });
    },
    function (session, results) {
		console.log("Enter in the results func: getBenefits : ",results.response.entity);
        if (results.response.entity=="Yes") {            						
			session.beginDialog('getMenu1');
        }
		else if (results.response.entity=="No"){
			session.send("Have a nice day");
			session.endDialog();
		}		
    }	
]);

bot.dialog('LeaveYesNo', [
    function (session) {
        builder.Prompts.choice(session, "Please confirm that you want to apply for leave from 01-17-2018 to 01-19-2018?", "Yes|No", { listStyle: builder.ListStyle.button });
    },
    function (session, results) {
        if (results.response.entity=="Yes") {            						
			session.send("Sam, your leave has been posted and forwarded to your manager");
			session.beginDialog('FurtherYesNo');
        }
		else if (results.response.entity=="No"){
			session.send("Have a nice day");
			session.endDialog();
		}		
    }	
]);

bot.dialog('LoginYesNo', [
    function (session) {
        builder.Prompts.choice(session, "Are you able to login?", "Yes|No", { listStyle: builder.ListStyle.button });
    },
    function (session, results) {
		console.log("Enter in the results func: getBenefits : ",results.response.entity);
        if (results.response.entity=="Yes") {            						
			session.beginDialog('FurtherYesNo');
        }
		else if (results.response.entity=="No"){
			session.send("Have a nice day");
			session.endDialog();
		}		
    }	
]);
