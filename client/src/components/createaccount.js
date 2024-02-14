import React, { useState, useContext, useEffect } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context';
import Card from './card';

function CreateAccount() {
  return (
    <main className="container form">
      <Card header="Register" body={<CreateAccountForm />} />
    </main>
  );
}

function CreateAccountForm() {
  const context = useContext(AppContext);
  const { currentUser, setCurrentUser, firebaseApp } = context;
  const auth = getAuth(firebaseApp);

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    type: 'user', // Set the default value to 'user'
  });
  

  const [fieldErrors, setFieldErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      setSuccessMessage(`Logged in as ${currentUser.email}`);
    }
  }, [currentUser]);

  const validateForm = () => {
    const { firstName, lastName, email, password } = formData;
    const errors = {};

    if (!firstName) {
      errors.firstName = 'First Name is required.';
    }

    if (!lastName) {
      errors.lastName = 'Last Name is required.';
    }

    if (!email) {
      errors.email = 'Email is required.';
    } else if (!isValidEmail(email)) {
      errors.email = 'Invalid email format.';
    }

    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long.';
    }

    return errors;
  };

 // ... (other code)

const handleFormSubmit = async (e) => {
  e.preventDefault();
  setErrorMessage('');

  const { firstName, lastName, email, password } = formData;
  const fieldValidationErrors = validateForm();

  if (Object.keys(fieldValidationErrors).length > 0) {
    setFieldErrors(fieldValidationErrors);
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    const uid = userCredential.user.uid;
    await axios.get(
      `http://localhost:3001/api/account/create/${uid}/${firstName}/${lastName}/${email}`
    );

    setCurrentUser(userCredential.user);
    setSuccessMessage('Account created successfully.');

    setTimeout(() => {
      navigate('/');
    }, 2000);
  } catch (error) {
    console.error('Error:', error);
    setErrorMessage('An error occurred while creating the account.');
  }
};



 
const handleInputChange = (e) => {
  const { name, value } = e.target;
  let newValue = value;

  // Check if the input field is one of the "Name" fields (firstName or lastName)
  if (name === "firstName" || name === "lastName") {
    // Use a regular expression to allow only alphabetic characters
    newValue = value.replace(/[^A-Za-z]/g, "");
  }

  setFormData({ ...formData, [name]: newValue });
  // Clear the error message for the field when it's being edited
  setFieldErrors({ ...fieldErrors, [name]: '' });
};
  const isValidEmail = (email) => {
    // You can implement a regular expression or use a library like 'validator' to validate email format.
    // Here's a simple regex-based validation:
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  return (
    <>
      {successMessage ? (
        <div className="alert success">{successMessage}</div>
      ) : (
        <form>
          <div className="form-group">
            <input
              type="input"
              name="firstName"
              className="form-control"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleInputChange}
            />
            {fieldErrors.firstName && (
              <div className="error-message">{fieldErrors.firstName}</div>
            )}
          </div>

          <div className="form-group">
            <input
              type="input"
              name="lastName"
              className="form-control"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
            />
            {fieldErrors.lastName && (
              <div className="error-message">{fieldErrors.lastName}</div>
            )}
          </div>

          <div className="form-group">
            <input
              type="input"
              name="email"
              className="form-control"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
            />
            {fieldErrors.email && (
              <div className="error-message">{fieldErrors.email}</div>
            )}
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
            />
            {fieldErrors.password && (
              <div className="error-message">{fieldErrors.password}</div>
            )}
          </div>

          <div className="input-group flex-end">
            <button type="submit" className="btn btn-dark" onClick={handleFormSubmit}>
              Create Account
            </button>
          </div>
          {errorMessage && <div className="alert error">{errorMessage}</div>}
        </form>
      )}
    </>
  );
}

export default CreateAccount;
