require('@babel/register');
require('dotenv').config();
const express = require('express');

const serverConfig = require('./config/serverConfig');
const indexRouter = require('./routes/index.routes');
const checkUser = require('./middlewares/verifyJWT');

const app = express();
serverConfig(app);
app.use(checkUser);
app.use('/', indexRouter);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Сервер запустился на ${PORT}`);
});
