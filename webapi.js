
var express = require('express');
var http = require('http');
var url = require('url')
var app = express();
const querystring = require('querystring');

var options = {
  host: 'tmweb.pacebus.com',
        path: '/TMWebWatch/LiveADADepartureTimes'
};


function LiveScheduleData(){
    this.lastUpdateAt = new Date();
    this.Schedule = new Array();
}

function ScheduleData(){
  this.ExpectedAt = new Date();
  this.ScheduledAt = new Date();
}




app.get('/v1/pace/master/routes',function(request,response){

  var getRouteCallback = function (err, data){
    console.log('getRouteCallback');
    if(!err){
         //response.write();

         var rx = new RegExp(/<a\s*class="adalink"\s*title="(.*?)"\s*href="\?r=(\d+)">(.*?)<\/a>/img);
         var match, params={} ;
         while (match = rx.exec(data)) {
              params[match[3]] = match[2];
          }
          response.setHeader('Content-Type','application-json');
         response.end(JSON.stringify(params));
    }
    
   
  }
  
  
  doHTTPRequest(options,getRouteCallback);
  
});


app.get('/v1/pace/master/directions',function(request,response){

 var processResult = function(err,data){

      var rx = new RegExp(/<a\s*class="adalink"\s*title="(.*?)"\s*href="(.*?)">(.*?)<\/a>/img);  //?r=10&amp;d=2

      var match, params={} ;
         while (match = rx.exec(data)) {
            params[match[3]] = match[2].replace("r=","route=").replace("d=","direction=");
          }
          response.setHeader('Content-Type','application-json');
         response.end(JSON.stringify(params));

      
      //console.log(data);
      //response.end(data);
    }
  
  var directionRequest = {
    host: 'tmweb.pacebus.com',
    path:'/TMWebWatch/LiveADADepartureTimes?r={0}'
  };
  //<a class="adalink" title="East" href="?r=8&amp;d=1">East</a>
    var url_parts = url.parse(request.url, true);
    var query = url_parts.query;
    var queryKV = querystring.parse(query);
    console.log(request.url);
    console.log(query["route"]);
    console.log(queryKV);
    directionRequest.path = directionRequest.path.replace("{0}", query["route"]);
    console.log(JSON.stringify(directionRequest));
    doHTTPRequest(directionRequest,processResult);

});


app.get('/v1/pace/master/stops',function(request,response){

 var processResult = function(err,data){

      var rx = new RegExp(/<a\s*class="adalink"\s*title="(.*?)"\s*href="(.*?)">(.*?)<\/a>/img);  //?r=10&amp;d=2

      var match, params={} ;
         while (match = rx.exec(data)) {
            params[match[3]] = match[2].replace("r=","route=").replace("d=","direction=").replace("s=","stop=");
          }
          response.setHeader('Content-Type','application-json');
         response.end(JSON.stringify(params));

      
      //console.log(data);
      //response.end(data);
    };
  
  var directionRequest = {
    host: 'tmweb.pacebus.com',
    path:'/TMWebWatch/LiveADADepartureTimes?r={0}&d={1}'
  };
  //<a class="adalink" title="East" href="?r=8&amp;d=1">East</a>
    var url_parts = url.parse(request.url, true);
    var query = url_parts.query;
    var queryKV = querystring.parse(query);
    console.log(request.url);
    console.log(query["route"]);
    console.log(queryKV);
    directionRequest.path = directionRequest.path.replace("{0}", query["route"]).replace("{1}",query["direction"]);
    console.log(JSON.stringify(directionRequest));
    doHTTPRequest(directionRequest,processResult);

});


app.get('/v1/pace/live/schedule',function(request,response){

    var processResult = function(err,data){
      var match, params={} ;
      var returnData = new LiveScheduleData();
      var schdData;

       //get the schedules
      var rx = new RegExp(/<a\s*class="adatime"\s*title="(\d+:\d+)">((.|\r|\n)*?)<p\s*class="stopLabel">(.*?)<\/p>/img);  //?r=10&amp;d=2  /<a\s*class="adatime"\s*title="\d+:\d+">(\d+:\d+)<\/a>/img
      //<a\s*class="adatime"\s*title="(\d+:\d+)>((.|\r|\n)*?)<p\s*class="stopLabel">(.*?)<\/p>
      
         while (match = rx.exec(data)) {
            schdData = new ScheduleData();
            schdData.ExpectedAt = match[1]
            schdData.ScheduledAt = match[4]
           // params[match[0]] = match[1];
           console.log(schdData);
           returnData.Schedule.push(schdData)
          }
          
      //get when the data was last updated
      var rx1 = new RegExp(/<a\s*class="ada"\s*title="Times last updated(.*?)">/img);
      match = rx1.exec(data);
      returnData.lastUpdateAt = match[1];


     
          response.setHeader('Content-Type','application-json');
         response.end(JSON.stringify(returnData));

      
      //console.log(data);
      //response.end(data);
    };
  
  var directionRequest = {
    host: 'tmweb.pacebus.com',
    path:'/TMWebWatch/LiveADADepartureTimes?r={0}&d={1}&s={2}'
  };
  //<a class="adalink" title="East" href="?r=8&amp;d=1">East</a>
    var url_parts = url.parse(request.url, true);
    var query = url_parts.query;
    var queryKV = querystring.parse(query);
    console.log(request.url);
    console.log(query["route"]);
    console.log(queryKV);
    directionRequest.path = directionRequest.path.replace("{0}", query["route"]).replace("{1}",query["direction"]).replace("{2}",query["stop"]);
    console.log(JSON.stringify(directionRequest));
    doHTTPRequest(directionRequest,processResult);

});



var server = app.listen(process.env.PORT || 4567, function(err,data){ console.log('listening to port 4567');});






var doHTTPRequest  = function(options, _callback) {
 callback = function(response) {
  var str = '';

  //another chunk of data has been recieved, so append it to `str`
  response.on('data', function (chunk) {
    str += chunk;
  });

  //the whole response has been recieved, so we just print it out here
  response.on('end', function () {
      console.log(str);
      _callback(void(0),str);
  });

}
http.request(options, callback).end();
};


////////////////////




// var getRouteList = function (options, _callback){
// console.log('getRouteList');
// callback = function(response) {
//   var str = '';

//   //another chunk of data has been recieved, so append it to `str`
//   response.on('data', function (chunk) {
//     str += chunk;
//   });

//   //the whole response has been recieved, so we just print it out here
//   response.on('end', function () {
//     console.log(str);
//     _callback(void(0),str);
//   });

// }
//   http.request(options, callback).end();
// };