# ecommerce-chatbot-platzi
Projeto de um assistente virtual para e-commerce

Unidade 4 aula 5 - Testando o chatbot

Esse projeto possui o código corrigido em relação aos problemas de ordem de mensagem. Conforme estudado na aula 5 da unidade 4, o Facebook não garante a ordem de entrega das mensagens. Por isso é necessário controlar o disparo das mensagens do lado da aplicação. Uma estratégia simples para resolver este problema é utilizar a função `setTimeout` do Node.

## Configurando

Clone esse branch em sua máquina e execute os seguintes comandos:

1. Acessar o diretório **src**

`cd src`

2. Abra o arquivo **app.js** e defina as constantes **VALIDATION_TOKEN**, **APP_SECRET**, **PAGE_ACCESS_TOKEN**

## Executando

Execute a API criada rodando o comando abaixo:

`npm start`

## Testando o funcionamento

1. Acesse a página vinculada a sua aplicação e envie diferentes mensagens para o bot. 

Se todo o processo de configuração foi feito com sucesso o bot deverá responder com as mensagens na ordem correta.
