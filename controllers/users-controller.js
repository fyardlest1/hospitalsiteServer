const uuid = require('uuid');

const HttpError = require('../models/http-error');

const DUMMY_USERS = [
    {
        id: 'id1',
        name: 'Yayad La',
        email: 'yayad@yayad.net',
        password: 'password'
    },
    {
        id: 'id2',
        name: 'Yayad La',
        email: 'gouyad@yayad.net',
        password: 'password'
    }
];


const getUsers = (req, res, next) => {
    res.json({ users: DUMMY_USERS });
};

const signup = (req, res, next) => {
    const { name, email, password } = req.body;

    const userExist = DUMMY_USERS.find(uE => uE.email === email);
    if (userExist) {
        throw new HttpError(
          'Email already exist. Please try with another one or login by using your password', 422
        );
        // const err = new HttpError("Email already exist. Please try with another one or login by using your password", 422);
        // return next(err);
    }

    const createdUser = {
        id: uuid.v4(),
        name, // name: name
        email,
        password
    };

    DUMMY_USERS.push(createdUser);

    res.status(201).json({ user: createdUser });
};

const login = (req, res, next) => {
    const { email, password } = req.body;
    const userOk = DUMMY_USERS.find(u => u.email === email);

    if (!userOk || userOk.password !== password) {
        const err = new HttpError('Could not identify user.', 401);
        return next(err);
    }

    res.json({ message: "Welcome to your account." })
};




exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;