
//Criando uma API em Node.JS
'use strict';

//Inicializando variáveis necessárias
const
    bodyParser = require('body-parser'),
    express = require('express'),
    request = require('request');

//Configurando o Express
var app = express();
app.set('port', process.env.PORT || 5000);
app.use(bodyParser.json());

//Endpoint da API capaz de receber requisições HTTP do método GET
app.get('/webhook', function (req, res) {
    res.status(200).send("Hello World");
});

// Startando o servidor
app.listen(app.get('port'), function () {
    console.log('API executando na porta:', app.get('port'));
});

module.exports = app;