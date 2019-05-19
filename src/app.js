
//Criando uma API em Node.JS
'use strict';

//Inicializando variáveis necessárias
const
    bodyParser = require('body-parser'),
    express = require('express'),
    crypto = require('crypto'),
    request = require('request');

//Configurando o Express
var app = express();
app.set('port', process.env.PORT || 5000);
app.use(bodyParser.json({ verify: verifyRequestSignature }));

var VALIDATION_TOKEN = "<cole aqui seu validation token>";
var APP_SECRET = "<cole aqui seu app secret>";

/*
 * Endpoint GET que será utilizado pelo Facebook para validação do seu TOKEN. 
 * Lembre-se de utilizar no código o mesmo token cadastrado na sua aplicação do Facebook.
 */
app.get('/webhook', function (req, res) {
    if (req.query['hub.mode'] === 'subscribe' &&
        req.query['hub.verify_token'] === VALIDATION_TOKEN) {
        console.log("Validating webhook");

        res.status(200).send(req.query['hub.challenge']);
    } else {
        console.error("Failed validation. Make sure the validation tokens match.");
        res.sendStatus(403);
    }
});

/*
 * Função que verifica se a requisição que está chegando em sua aplicação vem realmente do Facebook.
 * O codigo utilizado verifica se a assinatura do request foi feita utilizando o APP_SECRET da sua aplicação.
 *
 * https://developers.facebook.com/docs/graph-api/webhooks#setup
 *
 */
function verifyRequestSignature(req, res, buf) {
    var signature = req.headers["x-hub-signature"];

    if (!signature) {
        // Todo request que não possuir assinatura deve ser descartado!
        console.error("Request não possui cabeçalho com a assinatura");
    } else {
        var elements = signature.split('=');
        var method = elements[0];
        var signatureHash = elements[1];

        var expectedHash = crypto.createHmac('sha1', APP_SECRET)
            .update(buf)
            .digest('hex');

        if (signatureHash != expectedHash) {
            // Todo request que possuir assinatura inválida deve ser descartado!
            throw new Error("Validação de assinatura inválida.");
        }
    }
}

//Endpoint da API capaz de receber requisições HTTP do método POST
app.post('/webhook', function (req, res) {
    var data = req.body;


    // Garantindo que o evento de Webhook é de uma página
    if (data.object == 'page' && data.entry) {

        // A API do Facebook pode mandar mais de um evento na mesma requisição. Por isso é preciso iterar em todos eles
        data.entry.forEach(function (pageEntry) {
            // Em um evento de webhook podem existir várias mensagens. Por isso é preciso iterar em cada uma delas.
            pageEntry.messaging.forEach(function (messagingEvent) {
                if (messagingEvent.message) {
                    receivedMessage(messagingEvent);
                }
            });
        });

        res.sendStatus(200);
    }
});

//Processa um evento de Webhook to tipo messages
function receivedMessage(event) {
    //adicione aqui um código para tratar a chegada de diferentes tipos de mensagem
    console.log('Evento de Webhook recebido: ', JSON.stringify(event));
}

// Startando o servidor
app.listen(app.get('port'), function () {
    console.log('API executando na porta:', app.get('port'));
});

module.exports = app;