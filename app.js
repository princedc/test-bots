var http = require('http');


//The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
var options = {
  host: 'tmweb.pacebus.com',
        path: '/TMWebWatch/LiveADAArrivalTimes?r=44&d=1&s=7871'
};

  var str = '';
http.createServer(function (req, res) {
  
  
  res.writeHead(200, {
    'Content-Type': 'text/html',
    //'Content-Length': html.length,
    'Expires': new Date().toUTCString()
  });
callback = function(response) {
  var str = '';

  //another chunk of data has been recieved, so append it to `str`
  response.on('data', function (chunk) {
    str += chunk;
  });

  //the whole response has been recieved, so we just print it out here
  response.on('end', function () {
    var matchExpression = new RegExp(/<a class="adatime" title="\d+:\d+">(\d+:\d+)/m);
    var matchComponents = matchExpression.exec(str);
    //response.write(matchComponents[1]);
	res.end(matchComponents[1]);
  });



}

http.request(options, callback).end();


  
}).listen(process.env.PORT || 8080);





