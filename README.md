# ecommerce-chatbot-platzi
Projeto de um assistente virtual para e-commerce

Unidade 4 aula 3 - Definindo a máquina de estados do chatbot

Esse projeto possui o código necessário para alterar o estado atual dos usuários, criando assim uma máquina de estados. A partir deste comportamento o bot será capaz de responder perguntas contextuais de acordo com o estado de cada cliente.

## Configurando

Clone esse branch em sua máquina e execute os seguintes comandos:

1. Acessar o diretório **src**

`cd src`

2. Abra o arquivo **app.js** e defina as constantes **VALIDATION_TOKEN**, **APP_SECRET**, **PAGE_ACCESS_TOKEN**

## Executando

Execute a API criada rodando o comando abaixo:

`npm start`

## Desafio 

Analise todo o código e tenha certeza que entendeu tudo o que foi feito até o momento.

* Como salvar o estado atual de todos os usuários do bot
* Como movimentar o usuário entre diferentes estados
* Como analisar o estado atual do usuário para decidir qual conteúdo enviar

Experimente salvar o estado dos usuários de forma persistente. Use um banco de dados ao invés de um objeto em memória.

## Testando o funcionamento

1. Acesse a página vinculada a sua aplicação e envie diferentes mensagens para o bot. 

Se todo o processo de configuração foi feito com sucesso o bot deverá responder contextualmente de acordo com o estado atual do usuário.
