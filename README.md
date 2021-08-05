# LoadApp Server Serverless

### Requirements

 - Java
 - nodeJS / npm
 - AWS SDK
 - Serverless
### First-time setup for local development

```
$ npm i
$ npm run dbinstall
$ serverless dynamodb migrate --stage local
```
### Run server

```
$ npm start
```

then run on browser `http://localhost:8069/local`.