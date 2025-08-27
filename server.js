const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./db');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
require('dotenv').config();

app.use(bodyParser.json());
app.use(passport.initialize());

passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const user = await db.userData.findOne({ username });
        if (user && await bcrypt.compare(password, user.password)) {
            return done(null, user);
        } else {
            return done(null, false, { message: 'Incorrect credentials.' });
        }
    } catch (err) { 
        return done(err);
    }
}));

app.get('/', passport.authenticate('local', { session: false }), async (req, res) => {
  try{
    const showData = await db.userData.find();
    res.send(showData);
  } catch(err){
    res.status(500).send('Error retrieving users.');
  }
});

app.post('/register', async(req, res) => {
  const { username, password } = req.body;
  try {
    const uniuqe = await db.userData.findOne({ username });
    if (uniuqe) {
      return res.status(400).send('Username already exists.');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new db.userData({ username, password: hashedPassword });
    await newUser.save();
    res.status(200).send('User registered successfully.');
  } catch (err) {
    res.status(500).send('Error registering new user.');
  }
});

const PORT = process.env.PORT || 3000;


app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});