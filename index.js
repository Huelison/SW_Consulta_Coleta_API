var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var request = require('request');
var jwt = require('jsonwebtoken');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

var url_padrao = "https://teste-92e08.firebaseio.com/";
const JWT_PASSWORD = '@#$VeRyBaDP@ssW*rd';
var users = { admin: '@d!m', huelison: 'P@ssWord', Magnus: 'Chase' };

app.post('/login', bodyParser.json(), function (req, res) {
	console.log("Body Requisição:\n");
	console.log(req.body);
	if (!users[req.body.username] || users[req.body.username] !== req.body.password) {
		res.status(401).json({ error: 'Usuário ou senha inválido.' })
	} else {
		var token = jwt.sign({ username: req.body.username, permissao: 'admin' }, JWT_PASSWORD, { expiresIn: 3200 }); //tempo de validade pode ser colocado em '1h', '1d', ou 120 para 2 minutos, por exemplo

		res.status(200);
		res.json({token:token});
	}
});

app.get('/session', autenticacao, secao);
function secao(req, res) {
	console.log('hello');
	console.log("Autorizado.");
	res.data = {};
	res.type('application/json');
	res.statusCode = 200;
	res.json({user:req.data.username}); 
}

function autenticacao(req, res, next) {
	console.log("/session ", req.headers);
	var auth = req.headers.authorization;

	if (!auth || !auth.startsWith('Bearer')) {
		return res.status(401).json({ error: 'JWT Token Missing.' });
	} else {
		auth = auth.split('Bearer').pop().trim();
	}
	console.log(auth);
	jwt.verify(auth, JWT_PASSWORD, function (err, data) {
		if (err) {
			return res.status(401).json({ error: 'Not Authorized' });
		} else {
			console.log(data);
			req.data = data;
			next();
		}
	});
}

app.get('/', function (req, res) {
	res.type('text/HTML');
	res.send('<html> <body> <h1>Api de Consulta de coletas</H1> <H3>Serviços disponiveis</H3>'+
	'<p>- Consulta de Rotas</p>'+
	'<p>- Consulta de Clientes</p>'+
	'<p>- Consulta de Coletas</p></body> </html>');
});

app.get('/rotas', autenticacao, function (req, res) {
	getDados(url_padrao + 'rotas.json', res);
});

app.get('/rotas/:id', autenticacao, function (req, res) {
	var id = req.params.id;
	getDados(url_padrao + 'rotas/' + id + '.json', res);
});

app.get('/clientes', autenticacao, function (req, res) {
	getDados(url_padrao + 'clientes.json', res);
});

app.get('/clientes/:id', autenticacao, function (req, res) {
	var id = req.params.id;
	getDados(url_padrao + 'clientes/' + id + '.json', res);
});

app.get('/coletas', autenticacao, function (req, res) {
	getDados(url_padrao + 'Coletas.json', res);
});

app.get('/coletas/:id', autenticacao, function (req, res) {
	var id = req.params.id;
	getDados(url_padrao + 'Coletas/' + id + '.json', res);
});

//funcao quando tenta-se acessar uma rota inexistente
app.use(function (req, res) {
	res.statusCode = 501;
	res.status = 501;
	var erro = { error: 'Not Implemented' }
	res.json(erro);
});

function getDados(url, res) {
	request(url, function (error, response, body) {
		res.type('application/json');
		console.log('error:', error); // Print the error if one occurred
		console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
		console.log('body:', ""+body+''); // Print the HTML for the Google homepage.
		if (body == null || body =="null"){
		console.log("vazio")
			res.statusCode = 404; 
			var erro = { error: 'Not Found' }
			res.json(erro);
		} else {
		console.log("vazio1")
			res.statusCode = 200;
			res.send(body);
		}
	})
}
 

if (app.listen(8050))
	console.log("Up and running :)")