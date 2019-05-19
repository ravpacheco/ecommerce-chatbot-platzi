'use strict';

//Inicializando dependencias necessárias
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
var PAGE_ACCESS_TOKEN = "<cole aqui seu page access token>";

var userStates = {};

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
    var attachments = event.message.attachments;
    var text = event.message.text;
    var senderID = event.sender.id;

    var currentState = userStates[senderID] || 0;

    text = text.toLowerCase();
    console.log(text);

    switch (currentState) {

        //Usuário nunca conversou
        case 0:
            console.log("Usuário saindo do estado '0' para o estado 'menu'");
            userStates[senderID] = 'menu';
            break;

        //usuário está no estado Menu
        case "menu":
            if (text == 'troca') {
                console.log("Usuário escolheu a opção 'troca' e continua no estado 'menu'");
                userStates[senderID] = 'menu';
            } else if (text == 'endereco') {
                console.log("Usuário escolheu a opção 'endereco' e continua no estado 'menu'");
                userStates[senderID] = 'menu';
            } else if (text == 'desconto') {
                console.log("Usuário  escolheu a opção 'desconto' e continua no estado 'menu'");
                userStates[senderID] = 'menu';
            } else if (text == 'produtos') {
                console.log("Usuário saindo do estado 'menu' para o estado 'produtos'");
                userStates[senderID] = 'produtos';
            } else {
                console.log("Usuário continua no estado 'menu'");
                userStates[senderID] = 'menu';
            }
            break;

        //usuário está no estado Menu
        case "produtos":
            if (text == 'produto1') {
                console.log("Usuário escolheu o produto 1 e está saindo do estado 'produtos' para o estado 'menu'");
                userStates[senderID] = 'menu';
            } else if (text == 'produto2') {
                console.log("Usuário escolheu o produto 2 e está saindo do estado 'produtos' para o estado 'menu'");
                userStates[senderID] = 'menu';
            }
            break;
    }
}

//Envia mensagens do tipo generic template (carrossel)
function sendCarrosselMessage(recipientId) {

    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    elements: [{
                        title: "rift",
                        subtitle: "Next-generation virtual reality",
                        item_url: "https://www.oculus.com/en-us/rift/",
                        image_url: "https://cdn.attackofthefanboy.com/wp-content/uploads/2015/09/Oculus-Rift-Price.jpg",
                        buttons: [{
                            type: "web_url",
                            url: "https://www.oculus.com/en-us/rift/",
                            title: "Comprar"
                        }, {
                            type: "postback",
                            title: "Saiba mais",
                            payload: "PRODUTO_1"
                        }],
                    }, {
                        title: "touch",
                        subtitle: "Your Hands, Now in VR",
                        item_url: "https://www.oculus.com/en-us/touch/",
                        image_url: "https://images.techhive.com/images/article/2015/09/oculus-touch-100616983-large.jpg",
                        buttons: [{
                            type: "web_url",
                            url: "https://www.oculus.com/en-us/touch/",
                            title: "Comprar"
                        }, {
                            type: "postback",
                            title: "Saiba mais",
                            payload: "PRODUTO_2"
                        }]
                    }]
                }
            }
        }
    };

    callSendAPI(messageData);
}

//Envia mensagens de media (image, audio, video, file)
function sendMediaMessage(recipientId, mediaType, mediaURL) {

    var messageData = {
        "recipient": {
            "id": recipientId
        },
        "message": {
            "attachment": {
                "type": mediaType,
                "payload": {
                    "url": mediaURL,
                    "is_reusable": true
                }
            }
        }
    }

    callSendAPI(messageData);
}

//Envia um quickreply para o usuário indicado no parâmetro `recipientId`
function sendQuickReplyMessage(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        "message": {
            "text": "Isto é um quick reply",
            "quick_replies": [
                {
                    "content_type": "text",
                    "title": "Opção 1",
                    "payload": "Opção 1",
                },
                {
                    "content_type": "text",
                    "title": "Opção 2",
                    "payload": "Opção 2",
                    "image_url": "http://aux.iconspalace.com/uploads/1658460238.png"
                },
                {
                    "content_type": "user_email"
                }
            ]
        }
    };

    callSendAPI(messageData);
}

//Envia um texto (text) para o usuário indicado no parâmetro `recipientId`
function sendTextMessage(recipientId, text) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: text,
            metadata: "DEVELOPER_DEFINED_METADATA"
        }
    };

    callSendAPI(messageData);
}

function callSendAPI(messageData) {
    request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: messageData

    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.error("Mensagem enviada com sucesso");
        } else {
            console.error("Falha ao enviar mensagem", response.statusCode, response.statusMessage, body.error);
        }
    });
}

// Startando o servidor
app.listen(app.get('port'), function () {
    console.log('API executando na porta:', app.get('port'));
});

module.exports = app;
