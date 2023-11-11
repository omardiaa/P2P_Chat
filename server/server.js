const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); //To be deleted on production
const { User, userRouter} = require('./app/User')
const { authenticationRouter } = require('./app/Authentication')
const { connectionRouter } = require('./app/Connection')
const { HOST, PORT } = require('./config/constants')

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.listen(PORT, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});

app.use('/', userRouter)
app.use('/', authenticationRouter)
app.use('/', connectionRouter)

//Private Functions
setInterval(()=>{
    for (const user of global.users){
        if(Date.now() - user.get_updated_at() > 5000){
            user.update_status(false)
            user.update_offer("")
        }
    }
}, 5000)