'use strict';

const
    bodyParser = require('body-parser'),
    config = require('./config'),
    express = require('express'),
    crypto = require('crypto'),
    request = require('request');

var app = express();
app.set('port', process.env.PORT || 5000);
app.use(bodyParser.json({ verify: verifyRequestSignature }));

var userStates = {};

// App Secret can be retrieved from the App Dashboard
const APP_SECRET = config['appSecret'];

// Arbitrary value used to validate a webhook
const VALIDATION_TOKEN = config['validationToken'];

// Generate a page access token for your page from the App Dashboard
const PAGE_ACCESS_TOKEN = config['pageAccessToken'];

if (!(APP_SECRET && VALIDATION_TOKEN && PAGE_ACCESS_TOKEN)) {
    console.error("Missing config values");
    process.exit(1);
}

/*
* Use your own validation token. Check that the token used in the Webhook
* setup is the same token used here.
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
 * Verify that the callback came from Facebook. Using the App Secret from
 * the App Dashboard, we can verify the signature that is sent with each
 * callback in the x-hub-signature field, located in the header.
 *
 * https://developers.facebook.com/docs/graph-api/webhooks#setup
 *
 */
function verifyRequestSignature(req, res, buf) {
    var signature = req.headers["x-hub-signature"];

    if (!signature) {
        // For testing, let's log an error. In production, you should throw an
        // error.
        console.error("Couldn't validate the signature.");
    } else {
        var elements = signature.split('=');
        var method = elements[0];
        var signatureHash = elements[1];

        var expectedHash = crypto.createHmac('sha1', APP_SECRET)
            .update(buf)
            .digest('hex');

        if (signatureHash != expectedHash) {
            throw new Error("Couldn't validate the request signature.");
        }
    }
}

/*
 * All callbacks for Messenger are POST-ed. They will be sent to the same
 * webhook. Be sure to subscribe your app to your page to receive callbacks
 * for your page.
 * https://developers.facebook.com/docs/messenger-platform/product-overview/setup#subscribe_app
 *
 */
app.post('/webhook', function (req, res) {
    var data = req.body;

    // Make sure this is a page subscription
    if (data.object == 'page' && data.entry) {
        // Iterate over each entry

        console.log(data);

        // There may be multiple if batched
        data.entry.forEach(function (pageEntry) {
            // Iterate over each messaging event
            pageEntry.messaging.forEach(function (messagingEvent) {
                if (messagingEvent.message) {
                    receivedMessage(messagingEvent);
                } else if (messagingEvent.delivery) {
                    receivedDeliveryConfirmation(messagingEvent);
                } else if (messagingEvent.postback) {
                    receivedPostback(messagingEvent);
                } else if (messagingEvent.read) {
                    receivedMessageRead(messagingEvent);
                } else if (messagingEvent.optin) {
                    receivedOptin(messagingEvent)
                } else {
                    console.log("Webhook received unknown messagingEvent: ", messagingEvent);
                }
            });
        });

        // Assume all went well.
        //
        // You must send back a 200, within 20 seconds, to let us know you've
        // successfully received the callback. Otherwise, the request will time out.
        res.sendStatus(200);
    }
});

function receivedMessage(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfMessage = event.timestamp;
    var message = event.message.text;

    console.log("Received message for user %d and page %d at %d with message:",
        senderID, recipientID, timeOfMessage);
    console.log(JSON.stringify(message));

    //get user state
    var state = userStates[senderID] || 0;

    switch (state) {

        //process state
        //Estado inicial
        case 0:
            sendTextMessage(senderID, "Olá... É um prazer falar com você.");
            setTimeout(() => sendQuickReply(senderID), 3000);
            userStates[senderID] = "menu";
            break;

        case 'menu':

            if (message == "Produtos" || message == "PRODUTOS") {
                sendGenericMessage(senderID);
                userStates[senderID] = "produtos";
            }
            else {
                //reengajamento
                if (message == "Endereco" || message == "ENDERECO" || message == "Endereço") {
                    sendTextMessage(senderID, "Separei o endereço de todas as nossas lojas físicas.");
                    sendTextMessage(senderID, "Belo Horizonte: Rua Paraíba 1400, Savassi. Telefone: (31) 3349-0000\n\nSão Paulo: Rua das Minas 1889, Moema. Telefone: (11) 2349-0000");
                    sendTextMessage(senderID, "Estamos aguardando sua visita...");
                }
                else if (message == "Troca" || message == "POLITICA_TROCA" || message == "Política de troca") {
                    sendTextMessage(senderID, "Você pode trocar qualquer peça com a nota fiscal em até 30 dias.\n\nObs.: A peça deve estar etiquetada!");
                }
                else if (message == "Desconto" || message == "Descontos" || message == "DESCONTO") {
                    sendTextMessage(senderID, "Excelente notícia, temos uma promoção imperdível!!! | Eu ouvi desconto? É pra já!!!");
                    sendTextMessage(senderID, "Na compra de 2 peças você tem 50% desconto na mais barata! Basta utilizar o código abaixo:");
                    sendTextMessage(senderID, "#DESCONTODOCHATBOT")
                }
                setTimeout(() => sendQuickReply(senderID), 3000);
            }
            break;
        case "produtos":

            //produto 1
            if (message == "1" || message == "primeiro" || message == "PRODUTO_1") {
                sendTextMessage(senderID, "Oculus Rift, excelente escolha...");
                sendImageMessage(senderID, "https://cdn.attackofthefanboy.com/wp-content/uploads/2015/09/Oculus-Rift-Price.jpg")
            }
            //produto 2
            if (message == "2" || message == "segundo" || message == "PRODUTO_2") {
                sendTextMessage(senderID, "Você escolheu oculus touch...");
                sendImageMessage(senderID, "https://images.techhive.com/images/article/2015/09/oculus-touch-100616983-large.jpg")
            }

            setTimeout(() => sendQuickReply(senderID), 5000);
            userStates[senderID] = "menu";
            break;

        default:
            sendTextMessage(senderID, "Desculpe não consegui entender...");
            userStates[senderID] = "menu";
            break;
    }
}

function receivedMessage2(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfMessage = event.timestamp;
    var message = event.message;

    console.log("Received message for user %d and page %d at %d with message:",
        senderID, recipientID, timeOfMessage);
    console.log(JSON.stringify(message));

    var isEcho = message.is_echo;
    var messageId = message.mid;
    var appId = message.app_id;
    var metadata = message.metadata;

    // You may get a text or attachment but not both
    var messageText = message.text;
    var messageAttachments = message.attachments;
    var quickReply = message.quick_reply;

    if (isEcho) {
        // Just logging message echoes to console
        console.log("Received echo for message %s and app %d with metadata %s",
            messageId, appId, metadata);
        return;
    } else if (quickReply) {
        var quickReplyPayload = quickReply.payload;
        console.log("Quick reply for message %s with payload %s",
            messageId, quickReplyPayload);

        sendTextMessage(senderID, "Quick reply tapped");
        return;
    }

    if (messageText) {

        // If we receive a text message, check to see if it matches any special
        // keywords and send back the corresponding example. Otherwise, just echo
        // the text we received.
        switch (messageText.replace(/[^\w\s]/gi, '').trim().toLowerCase()) {

            case 'image':
                requiresServerURL(sendImageMessage, [senderID]);
                break;

            case 'gif':
                requiresServerURL(sendGifMessage, [senderID]);
                break;

            case 'audio':
                requiresServerURL(sendAudioMessage, [senderID]);
                break;

            case 'video':
                requiresServerURL(sendVideoMessage, [senderID]);
                break;

            case 'file':
                requiresServerURL(sendFileMessage, [senderID]);
                break;

            case 'button':
                sendButtonMessage(senderID);
                break;

            case 'generic':
                requiresServerURL(sendGenericMessage, [senderID]);
                break;

            case 'quick reply':
                sendQuickReply(senderID);
                break;

            case 'typing on':
                sendTypingOn(senderID);
                break;

            case 'typing off':
                sendTypingOff(senderID);
                break;

            default:
                sendTextMessage(senderID, messageText);
        }
    } else if (messageAttachments) {
        sendTextMessage(senderID, "Message with attachment received");
    }
}

function receivedOptin(event) {
    var ref = event.optin.ref;
    var user_ref = event.optin.user_ref;
    var messageData;
    //produto 1
    if (ref == "PRODUTO_1") {
        messageData = {
            recipient: {
                user_ref: user_ref
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
    }
    //produto 2
    else if (ref == "PRODUTO_2") {
        messageData = {
            recipient: {
                user_ref: user_ref
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
    }
    else {
        messageData = {
            "recipient": {
                "user_ref": user_ref
            },
            "message": {
                "text": "hello, world!"
            }
        };
    }

    callSendAPI(messageData);

    console.log("Received optin", ref);
}

/*
 * Message Read Event
 *
 * This event is called when a previously-sent message has been read.
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-read
 *
 */
function receivedMessageRead(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;

    // All messages before watermark (a timestamp) or sequence have been seen.
    var watermark = event.read.watermark;
    var sequenceNumber = event.read.seq;

    console.log("Received message read event for watermark %d and sequence " +
        "number %d", watermark, sequenceNumber);
}

/*
 * Delivery Confirmation Event
 *
 * This event is sent to confirm the delivery of a message. Read more about
 * these fields at https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-delivered
 *
 */
function receivedDeliveryConfirmation(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var delivery = event.delivery;
    var messageIDs = delivery.mids;
    var watermark = delivery.watermark;
    var sequenceNumber = delivery.seq;

    if (messageIDs) {
        messageIDs.forEach(function (messageID) {
            console.log("Received delivery confirmation for message ID: %s",
                messageID);
        });
    }

    console.log("All message before %d were delivered.", watermark);
}

/*
 * Postback Event
 *
 * This event is called when a postback is tapped on a Structured Message.
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/postback-received
 *
 */
function receivedPostback(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfPostback = event.timestamp;

    // The 'payload' param is a developer-defined field which is set in a postback
    // button for Structured Messages.
    var payload = event.postback.payload;

    console.log("Received postback for user %d and page %d with payload '%s' " +
        "at %d", senderID, recipientID, payload, timeOfPostback);

    //produto 1
    if (payload == "PRODUTO_1") {
        sendTextMessage(senderID, "Oculus Rift, excelente escolha...");
        sendImageMessage(senderID, "https://cdn.attackofthefanboy.com/wp-content/uploads/2015/09/Oculus-Rift-Price.jpg")
    }
    //produto 2
    if (payload == "PRODUTO_2") {
        sendTextMessage(senderID, "Você escolheu oculus touch...");
        sendImageMessage(senderID, "https://images.techhive.com/images/article/2015/09/oculus-touch-100616983-large.jpg")
    }

    setTimeout(() => sendQuickReply(senderID), 5000);
    userStates[senderID] = "menu";
}

/*
 * Send a text message using the Send API.
 *
 */
function sendTextMessage(recipientId, messageText) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: messageText,
            metadata: "DEVELOPER_DEFINED_METADATA"
        }
    };

    callSendAPI(messageData);
}

/*
 * Send an image using the Send API.
 *
 */
function sendImageMessage(recipientId, url) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "image",
                payload: {
                    url: url
                }
            }
        }
    };

    callSendAPI(messageData);
}

/*
 * Send a Gif using the Send API.
 *
 */
function sendGifMessage(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "image",
                payload: {
                    url: SERVER_URL + "/assets/instagram_logo.gif"
                }
            }
        }
    };

    callSendAPI(messageData);
}

/*
 * Send audio using the Send API.
 *
 */
function sendAudioMessage(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "audio",
                payload: {
                    url: SERVER_URL + "/assets/sample.mp3"
                }
            }
        }
    };

    callSendAPI(messageData);
}

/*
 * Send a video using the Send API.
 *
 */
function sendVideoMessage(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "video",
                payload: {
                    url: SERVER_URL + "/assets/allofus480.mov"
                }
            }
        }
    };

    callSendAPI(messageData);
}

/*
 * Send a file using the Send API.
 *
 */
function sendFileMessage(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "file",
                payload: {
                    url: SERVER_URL + "/assets/test.txt"
                }
            }
        }
    };

    callSendAPI(messageData);
}

/*
 * Send a button message using the Send API.
 *
 */
function sendButtonMessage(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: "This is test text",
                    buttons: [{
                        type: "web_url",
                        url: "https://www.oculus.com/en-us/rift/",
                        title: "Open Web URL"
                    }, {
                        type: "postback",
                        title: "Trigger Postback",
                        payload: "DEVELOPER_DEFINED_PAYLOAD"
                    }, {
                        type: "phone_number",
                        title: "Call Phone Number",
                        payload: "+16505551234"
                    }]
                }
            }
        }
    };

    callSendAPI(messageData);
}

/*
 * Send a Structured Message (Generic Message type) using the Send API.
 *
 */
function sendGenericMessage(recipientId) {
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


/*
 * Send a message with Quick Reply buttons.
 *
 */
function sendQuickReply(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: "Em que posso lhe ajudar? Clique em uma das opções abaixo 👇",
            quick_replies: [
                {
                    "content_type": "text",
                    "title": "Política de troca",
                    "payload": "POLITICA_TROCA"
                },
                {
                    "content_type": "text",
                    "title": "Descontos",
                    "payload": "DESCONTO"
                },
                {
                    "content_type": "text",
                    "title": "Produtos",
                    "payload": "PRODUTOS"
                },
                {
                    "content_type": "text",
                    "title": "Endereço",
                    "payload": "ENDERECO"
                }
            ]
        }
    };

    callSendAPI(messageData);
}

/*
 * Turn typing indicator on
 *
 */
function sendTypingOn(recipientId) {
    console.log("Turning typing indicator on");

    var messageData = {
        recipient: {
            id: recipientId
        },
        sender_action: "typing_on"
    };

    callSendAPI(messageData);
}

/*
 * Turn typing indicator off
 *
 */
function sendTypingOff(recipientId) {
    console.log("Turning typing indicator off");

    var messageData = {
        recipient: {
            id: recipientId
        },
        sender_action: "typing_off"
    };

    callSendAPI(messageData);
}

/*
 * Call the Send API. The message data goes in the body. If successful, we'll
 * get the message id in a response
 *
 */
function callSendAPI(messageData) {
    request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: messageData

    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var recipientId = body.recipient_id;
            var messageId = body.message_id;

            if (messageId) {
                console.log("Successfully sent message with id %s to recipient %s",
                    messageId, recipientId);
            } else {
                console.log("Successfully called Send API for recipient %s",
                    recipientId);
            }
        } else {
            console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
        }
    });
}

// Start server
// Webhooks must be available via SSL with a certificate signed by a valid
// certificate authority.
app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});

module.exports = app;