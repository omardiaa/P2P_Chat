// Imports
const jwt = require('jsonwebtoken');
const { User } = require('./User')
const { SECRET_KEY } = require('../config/constants')

const express = require('express');
const connectionRouter = express.Router();

//Routes

connectionRouter.post('/heartbeat', heartbeat);
connectionRouter.post('/get_offer', get_offer);
connectionRouter.post('/connect_to_peer', connect_to_peer);

//Controllers
function heartbeat (req, res) {
    const { token, offer } = req.body
    if(token == null) res.status(401).json({ message: 'Authentication failed; Token is missing' });
    
    const user_info = jwt.verify(token, SECRET_KEY);
    const user = User.find_by_id(user_info.id)

    user.update_status(true)
    user.update_offer(offer)

    const answers = user.get_answers()
    user.answers = []
    res.json({answers: answers})
}

function get_offer (req, res) {
    const { token, username } = req.body;
    const user = User.find_by_username(username)
    const offer = user.get_offer();

    res.json({offer: offer});
};

function connect_to_peer (req, res) {
    const { token, username, answer } = req.body;
    const user = User.find_by_username(username)

    if(user.is_alive()){
        user.push_answer(answer)
        res.status(200).json({message: 'User is notified'});
    }else{
        res.status(404).json({message: 'User is not available'});
    }
};

module.exports = {connectionRouter}