
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors  from 'cors';
import mongoose from 'mongoose';
import { create, getUser,getAllUsers, depositMoney, withdrawMoney } from './dal.js';

const app = express();

// When in Dev: serve static files from public directory
// app.use(express.static('public'));
app.use(cors());

// Test API
app.get('/api/test', function (req, res) {
  res.send('it works');
});

// Create user account
app.get('/api/account/create/:uid/:firstname/:lastname/:email', function (req, res) {
  create(req.params.uid,req.params.firstname,req.params.lastname,req.params.email)
    .then((newUser) => {
      console.log(`Inserted new user into the db... ${JSON.stringify(newUser)}`);
      res.send(newUser);
    })
    .catch((err) => {
      console.error(err);
    })
});

// Get one user
app.get('/api/account/:uid', function (req, res) {
  getUser(req.params.uid)
    .then((user) => {
      //console.log(`got the user here... ${JSON.stringify(user)}`);
      res.send(user);
    })
    .catch((err) => {
      console.error(err);
    })
});

// Get all users
app.get('/api/allUsers', function (req, res) {
  getAllUsers() // Replace with your function to retrieve all users
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Internal server error');
    });
});



// Deposit Money
app.get('/api/account/deposit/:balance/:amount/:uid', function (req, res) {
  depositMoney(req.params.balance, req.params.amount, req.params.uid)
    .then((data) => {
      console.log(`got this back... ${data}`); // works!
      res.send(data);
    })
    .catch((err) => {
      console.error(err);
    })
});

// Withdraw Money
app.get('/api/account/withdraw/:balance/:amount/:uid', function (req, res) {
  withdrawMoney(req.params.balance, req.params.amount, req.params.uid)
    .then((data) => {
      console.log(`got this back... ${data}`); // works!
      res.send(data);
    })
    .catch((err) => {
      console.error(err);
    })
});

// Connect to MongoDB Atlas
const uri = process.env.MONGOURL;
mongoose.connect(uri)
  .then(() => {
    // do stuff
    console.log('Connected to MongoDB!');
    const port = process.env.PORT ;
    app.listen(port);
    console.log('Server listening on port: ' + port);
  })
  .catch((error) => {
    console.log(error)
  });