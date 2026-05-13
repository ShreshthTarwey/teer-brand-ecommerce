const jwt = require('jsonwebtoken');
const express = require('express')

const app = express();

app.get('/vodn', async function(){
    const accessToken = jwt.sign({
        _id = "Abc",
        isAdmin = "Admin",
        jwtSecret: process.env.JWT_SECRT,
        {expiresIn: 3d},
    });
});