# ecommerce-chatbot-platzi
Projeto de um assistente virtual para e-commerce

Use esse projeto como exemplo de criação de um chatbot simples e como utilizar o Checkbox Plugin do Facebook.

## Configurando

Clone esse branch em sua máquina e execute os seguintes comandos:

1. Acessar o diretório **src**

`cd src/web`

2. Instale as dependências do projeto através do comando abaixo

`npm install`

3. Acesse o arquivo `app.js` e configure as constantes **VALIDATION_TOKEN**, **APP_SECRET**, **PAGE_ACCESS_TOKEN** de acordo com sua aplicação e sua página do Facebook.

4. Abra o arquivo `shop-single.html` e configure as constantes **appId**, **page_id**, **app_id** de acordo com sua aplicação e sua página no Facebook.

5. Hospede o site em algum host que possua SSL. Sugestão: _netlify.com_

6. Vá até as configurações da sua página e configure o domínio do seu site como um domínio Whitelisted.

7. Execute seu bot através do comando

`npm start`

## Testando o funcionamento

Abra a página no navegador, escolha um produto e veja se o plugin é renderizado corretamente.
Experimente também conversar com seu bot diretamente através da página no Facebook.