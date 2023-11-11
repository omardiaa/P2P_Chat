//Imports
const jwt = require('jsonwebtoken');
const { User } = require('./User')
const { SECRET_KEY } = require('../config/constants')
const express = require('express');
const authenticationRouter = express.Router();

//Routes

authenticationRouter.post('/register', register)
authenticationRouter.post('/login', login)

//Controllers

function register (req, res) {
    const { username, password } = req.body;
    if(User.find_by_username(username)){
      res.status(409).json({error: 'User already exists'})
    }else{
      new User(username, password)
      res.status(200).json({message: 'User registered successfully!'});
    }
};

function login (req, res) {
    const { username, password } = req.body;
  
    const user = User.find_by_username_and_password(username, password)
  
    if (!user) {
      res.status(401).json({ message: 'Authentication failed' });
      return;
    }
  
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '100h' });
  
    res.json({ token });
};

//Helpers

const authenticate = (token) => {

}

module.exports = {authenticationRouter}