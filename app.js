var builder = require('botbuilder');

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


