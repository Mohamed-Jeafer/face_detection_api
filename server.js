const env = require('dotenv').config()
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt-nodejs')

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const { DATABASE_URL, PORT } = process.env
const db = knex({
    client: 'pg',
    connectionString: DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const app = express();
app.use(bodyParser.json());
app.use(cors());


app.get('/users', (req, res) => {
    db.select('*').from('users').then(allusers => res.json(allusers))
});

app.get('/', (req, res) => { res.send("The Server is working") });
app.post('/signin', signin.handleSignin(db, bcrypt));
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) });
app.put('/image', (req, res) => { image.handleImage(req, res, db) });
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) });

app.listen(PORT, () =>
    console.log(`app is running on port ${PORT}`)
);