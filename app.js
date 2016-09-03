var builder = require('botbuilder');


var restify = require('restify');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: '35b8673a-31f6-4225-8051-cc689e2e5b1c',
    appPassword: 'sog1nbscmCy14ahCNrfjuL1'
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());


var connector = new builder.ConsoleConnector().listen();

var bot = new  builder.UniversalBot(connector);
var intents = new builder.IntentDialog();
bot.dialog('/', intents);


intents.matches(/^\s*change\s*name\s*/i,[
  	function(session){
		session.beginDialog('/profile');
	},
	function(session,results){
		session.send('Ok....Change your name to %s',session.userData.name);
	}


]);

intents.onDefault([
function(session,args,next){
	if(!session.userData.name){
      		session.beginDialog('/profile');
	}
	else{
		next();
	}
},
function(session,result){
   session.send("Hello %s", session.userData.name);
}


]);

bot.dialog('/profile',[function(session){
	builder.Prompts.text(session,'Hi! What is your name?');
},
function(session , results){
   session.userData.name = results.response;
   session.endDialog();
}
]);


