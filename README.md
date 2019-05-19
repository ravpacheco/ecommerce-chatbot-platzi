# ecommerce-chatbot-platzi
Projeto de um assistente virtual para e-commerce

Unidade 3 aula 2 - Como diferenciar um tipo de conteúdo recebido?

Esse código possui as seguintes funcionalidades:

* Adiciona o código necessário para manusear qualquer tipo de evento de webhook.
* Adiciona o método `receiveMessage`para tratar apenas eventos do tipo `message` vindos de páginas do Facebook

## Configurando

Clone esse branch em sua máquina e execute os seguintes comandos:

1. Acessar o diretório **src**

`cd src`

2. Abra o arquivo **app.js** e defina as constantes **VALIDATION_TOKEN** e **APP_SECRET**

## Executando

Execute a API criada rodando o comando abaixo:

`npm start`

## Desafio 

Altere o código do método `receiveMessage` para diferenciar mensagens de texto e de medias recebidas pelo bot. 

## Testando o funcionamento

1. Acesse a página vinculada a sua aplicação e envie uma mensagem.

2. Se todo o processo anterior foi executado corretamente você verá no console as mensagens recebidas por sua aplicação.
