const express = require('express');
const bodyParser = require('body-parser');

const hospitalsRouter = require('./routes/hospitals');
const userRouter = require('./routes/users');

const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

app.use('/api/hospitals', hospitalsRouter);
app.use('/api/users', userRouter);

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    return next(error);
})

// Handling Errors Middleware using Express
app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occurred!' })
})


app.listen(5000);