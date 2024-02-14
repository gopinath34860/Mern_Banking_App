import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context';
import Card from './card';
import axios from 'axios';
import { Link } from "react-router-dom";
import formatCurrency from '../utils/formatCurrency';

function Home() {
  // App Context
  const context = useContext(AppContext);
  const { currentUser } = context;

  // load user data
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (currentUser) {
      // Get user data
      const uid = currentUser.uid;
      axios.get(`http://localhost:3001/api/account/${uid}`)
        .then(function (response) {
          // handle success
          setUserData(response.data);
          setLoading(false);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        });
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const formattedUpdatedAt = userData && new Date(userData.updatedAt).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' });
  const formattedCreatedAt = userData && new Date(userData.createdAt).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' });

  const UserDashboard = () => {
    return (
      <>
        {userData && (
          <>
            <p>Hi, {userData.firstname} {userData.lastname}!</p>
            <p>Email: {userData.email}</p>
            <p>Balance: {formatCurrency(userData.balance)}</p>
            <p>Created At: {formattedCreatedAt || 'N/A'}</p>
            <p>Updated At: {formattedUpdatedAt || 'N/A'}</p>
            <p>Account type: {userData.type}</p>
          </>
        )}
      </>
    );
  };

  return (
    <main id="dashboard">
      <div className="container">
        {loading ? (
          <p>loading...</p>
        ) : currentUser ? (
          <Card header="Account Description" body={<UserDashboard />} />
        ) : (
          <p>Welcome to Best Bank! Please <Link to="/login">log in</Link>.</p>
        )}
      </div>
    </main>
  );
  
}

export default Home;
