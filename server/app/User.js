const express = require('express');
const userRouter = express.Router();

userRouter.get('/', get_users)

//Controllers
function get_users(req, res) {
    res.send(JSON.stringify(users));
};

//Model 

next_id = 0;

class User {
    constructor(username, password) {
        this.id = next_id++
        this.username = username
        this.password = password
        this.alive = true
        this.updated_at = Date.now()
        this.offer = ""
        this.answers = []
        if(global.users){
            global.users.push(this)
        }else{
            global.users = [this]
        }
    }

    update_status(status) {
        this.alive = status
        this._update_updated_at()
    }

    update_offer(offer) {
        this.offer = offer
        this._update_updated_at()
    }
    
    get_answers() {
        return this.answers
    }
    
    get_offer() {
        return this.offer
    }

    get_updated_at() {
        return this.updated_at
    }

    push_answer(answer){
        this.answers.push(answer)
    }

    is_alive(){
        return this.alive
    }
    // Static Methods
    static find_by_id(id) {
        return global.users.find(user => user.id === id);
    }

    static find_by_username(username) {
        return global.users.find(user => user.username === username);
    }

    static find_by_username_and_password(username, password){
        return global.users.find(user => user.username === username && user.password === password);
    }

    // Private Methods
    _update_updated_at() {
        this.updated_at = Date.now()
    }
}

module.exports = { User, userRouter }