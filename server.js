const env = require('dotenv').config()
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt-nodejs')
const profile = require('./controllers/profile');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const image = require('./controllers/image');

const { PORT, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env
const db = knex({
    client: 'pg',
    connection: {
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME
    }
});

const app = express();
app.use(bodyParser.json());
app.use(cors())


app.get('/users', (req, res) => {
    db.select('*').from('users').then(allusers => res.json(allusers))
})

app.post('/signin', signin.signInHandler(db, bcrypt))

app.post('/register', (req, res) => { register.registerHandler(req, res, db, bcrypt) })

app.get('/profile/:id', (req, res) => { profile.profileHandler(req, res, db) })

app.put('/image', (req, res) => { image.imageHandler(req, res, db) })

app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })

app.listen(PORT, () =>
    console.log(`app is running on port ${PORT}`)
)