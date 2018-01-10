var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

var inMemoryStorage = new builder.MemoryBotStorage();

// This bot ensures user's profile is up to date.
var bot = new builder.UniversalBot(connector, [
    function (session) {
		console.log("its in session value is : ",session.message.text)
		var sleep = require('system-sleep');		
		if (session.message.text =="Hi") {
			greeting = " Hi. How can I help you?";
			session.send( greeting);			
		}
		else if (session.message.text =="I need some Self Services help"){
			session.send( "Sure, What type of Self Services help you need?");
			session.beginDialog('getSalesData', session.userData.profile);
			console.log("text is selected",session.message.text);
		}
		else if (session.message.text=="Change my address"){
			session.send("Sure, let me take you to the service page.");
			//sleep(10000);
			sleep(10*1000);
			require("openurl").open("https://portal.softtek.com")
		}
		else if (session.message.text=="thanks"){
			session.send("You are welcome!. Do you want any more help?");
		}
		else if (session.message.text=="Yes"){
			session.send("Ok, what type of Self Services help you need?");
			session.beginDialog('getSalesData', session.userData.profile);
		}
		else if (session.message.text=="No"){
			session.send("Thank you for using service!");
		}
		else if (session.message.text=="Show Costa Rica pending invoices"){
			session.send("Sure, let me open the report ");
		}
		else if (session.message.text=="Thanks. Send email to these contractuals to submit their invoices"){
			session.send("The emails have been sent");
		}
		else if (session.message.text =="Fund 1000, Cost Center 100000 and WBS XYZ"){
			session.send("I have sent the report for the current period and YTD to your email address.");
		}
		else if(session.message.text=="Speter"){
			session.send("Please provide the system id");
		}
		else if(session.message.text=="MOD"){
			session.send("Please wait for a moment. I am working on your request.");
			session.send("User: Speter unlocked successfully!");
		}
		else if (session.message.text=="Enter Leave for 3 days - Jan 17th thru 19th"){
			session.send("Please confirm that you want to apply for leave from 01-17-2017 to 01-19-2017?");
		}
		else if ("yes"){
			session.send("Done !");
		}
		else{
			var customMessage = new builder.Message(session)
			.text("Please enter proper keyword!")
			.textFormat("plain")
			.textLocale("en-us");
			session.send(customMessage);
		}
    }
	
]).set('storage', inMemoryStorage); // Register in-memory storage 

bot.dialog('getSalesData', [
    function (session) {
        builder.Prompts.choice(session, "Please select one of the options.", "HR Support|Unlock SAP User|Portal banner update|My Commitments/Actuals and Budget", { listStyle: builder.ListStyle.button });
    },
    function (session, results) {
		console.log("Enter in the results func : ",results.response.entity);
        if (results.response.entity=="HR Support") {
            var region = "ABCD";
            session.send("What type of HR services you need?"); 
			session.beginDialog('getHRData');
        }
		else if (results.response.entity=="My Commitments/Actuals and Budget"){
			session.send("What is the Fund, Cost Center and/or WBS?");
			session.endDialog();
		}
		else if (results.response.entity=="Unlock SAP User"){
			session.send("Please provide your user id");
			session.endDialog();
		}
		else {
            session.send("OK");
        }
		//session.endDialog();
    }
	
]);

bot.dialog('getHRData', [
    function (session) {
        builder.Prompts.choice(session, "Please select one of the options.", "Address Book|Benefits and Payments|Pending Invoices", { listStyle: builder.ListStyle.button });
    },
    function (session, results) {
		console.log("Enter in the results func : getHRData: ",results.response.entity);
        if (results.response.entity=="Address Book") {
            session.send("Do you want to change your own data or want to know the organization chart?"); 
			session.endDialog();
        }
		else if (results.response.entity=="Benefits and Payments"){
			session.send("What would like to know about Benefits and Payments");
			session.beginDialog('getBenefits');
		}
		else if(results.response.entity=="Pending Invoices"){
			session.send("Do you want company wide or region Specific?");
			session.endDialog();
		}
		else {
            session.send("OK");
        }
		//session.endDialog();
    }
	
]);

bot.dialog('getBenefits', [
    function (session) {
        builder.Prompts.choice(session, "Please select one of the options.", "Benefits Participation Overview|Salary Statement|Time & Leave Management|Retirement Benefits", { listStyle: builder.ListStyle.button });
    },
    function (session, results) {
		console.log("Enter in the results func: getBenefits : ",results.response.entity);
		var sleep = require('system-sleep');
        if (results.response.entity=="Benefits Participation Overview") {
            session.send("Let me pull that info"); 
			session.send("1. Medical Insurance Provider: Aetna \n2. Dental Insurance Provider: United Healthcare \n3. Vision Insurance Provider:e-Vision \n4. 401K Provider: Fidelity");
			session.send("Let me take you to the service page for more details.");
			sleep(10*1000);
			require("openurl").open("https://portal.softtek.com")
        }
		else if (results.response.entity=="Salary Statement"){
			session.send("Yes, let me open the Salary Statement Service Page");
			sleep(10*1000);
			require("openurl").open("https://portal.softtek.com")
		}
		else if (results.response.entity=="Time & Leave Management"){
			session.send("You have 5 days of leave quota.");
			//require("openurl").open("https://portal.softtek.com")
			session.endDialog();
		}
		/*else {
            session.send("OK");
        }*/
		//session.endDialog();
    }
	
]);