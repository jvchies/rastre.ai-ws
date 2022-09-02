var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');

app.use(express.static('public'));
// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Avoid CORS problem for client app: npm install cors --save
const cors = require('cors')
var corsOptions = {
	origin: 'http://localhost:8100', // specific address, avoiding malicious requests
	optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}
app.use(cors(corsOptions))

app.get('/codigo2', function (req, res) {
   // const {codigo = 0} = req.query || [];
   console.log('cheamo');
   res.status(200).json({
      message: 'chegamo rapá!', codigo
   })
});

app.get('/rastreio', function (req, res) {
   fs.readFile(__dirname + "/dados.json", function (err, data) {
      res.end(data);
   });
});

app.post('/rastreio', function (req, res) {
   console.log('gravando dados do usuário');
   const usrData = req.body;
   // console.log(usrData);
   fs.writeFile(__dirname + "/dados.json",
      JSON.stringify(usrData), function (err) { 
      });
   res.end("{ \"msg\": \"OK\" }");
}); 

const { rastrearEncomendas } = require('correios-brasil');
app.get('/codigo', function (req, res) {
   console.log(JSON.stringify(req.params));
   const {codigo = 0} = req.query || [];
   rastrearEncomendas([codigo]).then(response => {
      console.log('consultando código de rastreio: ', res.status(200).json({
         listaEventos: response[0].eventos || []
      }));
   });
});


var server = app.listen(3000, function () {

   var host = server.address().address;
   var port = server.address().port;

   console.log("Server running", host, port);

});
