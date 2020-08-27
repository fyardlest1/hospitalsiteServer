const express = require('express');
const bodyParser = require('body-parser');
const hospitalsRouter = require('./routes/hospitals');

const app = express();

app.use('/api/hospitals', hospitalsRouter);


app.listen(5000);