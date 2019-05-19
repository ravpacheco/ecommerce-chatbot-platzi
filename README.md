# ecommerce-chatbot-platzi
Projeto de um assistente virtual para e-commerce

Unidade 2 aula 5 - Testando o recebimento de mensagens

Esse código possui as seguintes funcionalidades:

* Adiciona os métodos de segurança necessários para garantir que a comunicação está acontecendo entre a sua apliacação e a aplicação do Facebook
* Adiciona dois parâmetros necessários para validação da aplicação: **VALIDATION_TOKEN** e **APP_SECRET**
* Define um endpoint capaz de receber os eventos de webhook através de requisições HTTP do método POST
* Loga no console todas as mensagens recebidas
* Executa o servidor

## Configurando

Clone esse branch em sua máquina e execute os seguintes comandos:

1. Acessar o diretório **src**

`cd src`

2. Abra o arquivo **app.js** e defina as constantes **VALIDATION_TOKEN** e **APP_SECRET**

## Executando

Execute a API criada rodando o comando abaixo:

`npm start`

## Testando o funcionamento

1. Vá até o portal de desenvolvedores do Facebook, acesse sua aplicação configure os produtos **Webhook** e **Messenger** utilizando a URL do tunel e o VALIDATION_TOKEN definido anteriormente.

2. Acesse a página vinculada a sua aplicação e envie uma mensagem.

3. Se todo o processo anterior foi executado corretamente você verá no console as mensagens recebidas por sua aplicação.
