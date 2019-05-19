# ecommerce-chatbot-platzi
Projeto de um assistente virtual para e-commerce

Unidade 4 aula 4 - Adicionando conteúdos ao fluxo de conversa

Esse projeto possui o código necessário para alterar o estado dos usuários, criando assim uma máquina de estados. A partir deste comportamento o bot será capaz de enviar os conteúdos corretos de acordo com o estado de cada cliente.

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

Experimente adicionar novos estados e conteúdos ao seu chatbot. Ele pode entender sobre vários outros assuntos!

## Testando o funcionamento

1. Acesse a página vinculada a sua aplicação e envie diferentes mensagens para o bot. 

Se todo o processo de configuração foi feito com sucesso o bot deverá responder contextualmente de acordo com o estado atual do usuário.
