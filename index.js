var express = require('express');
var bodyParser = require('body-parser');s

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

var coletas = [
	{qtd: 'Fusca', hora : 10000.0},
	{qtd: 'Opala', hora : 20000.0}]; 

app.get('/', function(req, res){
	res.type('text/HTML');
	res.send('<html> <body> <p>Api de Consulta de coletas</p> </body> </html>');
});

app.get('/rotas', function(req, res){
	res.type('application/json');
	res.statusCode = 200;
	res.json(coletas);
});

app.get('/rotas/:id', function(req, res){
	res.type('application/json');
	res.statusCode = 200;
	res.json(coletas);
});

app.get('/clientes', function(req, res){
	res.type('application/json');
	res.statusCode = 200;
	res.json(coletas);
});

app.get('/clientes/:id', function(req, res){
	res.type('application/json');
	res.statusCode = 200;
	res.json(coletas);
});

app.get('/coletas', function(req, res){
	res.type('application/json');
	res.statusCode = 200;
	res.json(coletas);
});

app.get('/coletas/:id', function(req, res){
	res.type('application/json');
	res.statusCode = 200;
	res.json(coletas);
});

function getDados()