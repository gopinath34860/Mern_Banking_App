/*************************************************************************
 * Data Extraction Layer
 ************************************************************************/
import mongoose from 'mongoose';
const { Schema } = mongoose;

// Define user schema
const userSchema = new Schema({
  _id: {
    type: String,
    required: true
  },
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  balance: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Function: Create new user
async function create(uid, firstname, lastname, email) {
  try {
    const newUser = await User.create({
      _id: uid,
      firstname: firstname,
      lastname:  lastname,
      email:  email,
      balance: 0,
      type:"user"

    });
    return newUser;
  } 
  catch (error) {
    throw error;
  }
};

// Function: Get user data
async function getUser(uid) {
  try {
    const user = await User.findById(uid);
    return user;
  } 
  catch (error) {
    throw error;
  }
};

// Function: Get all users
async function getAllUsers() {
  try {
    const users = await User.find(); // Use a suitable method to retrieve all users from your database
    return users;
  } 
  catch (error) {
    throw error;
  }
};


// Function: Make a deposit
async function depositMoney(balance, amount,uid) {
  try {
    //const user = await User.findById(uid);
    //return user;
    let newBalance = Number(balance) + Number(amount);
    let newUser = User.findByIdAndUpdate( uid, { balance: newBalance } );
    return newUser;
  } 
  catch (error) {
    throw error;
  }
};

// Function: Make a withdraw
async function withdrawMoney(balance, amount,uid) {
  try {
    //const user = await User.findById(uid);
    //return user;
    let newBalance = Number(balance) - Number(amount);
    let newUser = User.findByIdAndUpdate( uid, { balance: newBalance } );
    return newUser;
  } 
  catch (error) {
    throw error;
  }
};

export { create, getUser,getAllUsers, depositMoney, withdrawMoney };