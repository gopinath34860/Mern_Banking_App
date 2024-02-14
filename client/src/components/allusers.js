import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AppContext } from '../context';
import Card from './card';
import formatCurrency from '../utils/formatCurrency';

function Home() {
  const context = useContext(AppContext);
  const { currentUser } = context;

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (currentUser) {
          const response = await axios.get('http://localhost:3001/api/allUsers');
          setUsers(response.data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentUser]);

  return (
    <main id="dashboard">
      <div className="container">
        {loading ? (
          <p>Loading...</p>
        ) : currentUser ? (
          <div>
            <h1>All Users</h1>
            {users.length > 0 ? (
              users.map((user) => (
                <Card key={user.id} header="Account Description" body={<UserDashboard userData={user} />} />
              ))
            ) : (
              <p>No users found.</p>
            )}
          </div>
        ) : (
          <p>
            Welcome to Best Bank! Please <Link to="/login">log in</Link>.
          </p>
        )}
      </div>
    </main>
  );
}

const UserDashboard = ({ userData }) => {
  const formattedCreatedAt = userData.createdAt
    ? new Date(userData.createdAt).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })
    : 'N/A';

  const formattedUpdatedAt = userData.updatedAt
    ? new Date(userData.updatedAt).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })
    : 'N/A';

  return (
    <>
      <p>Hi, {userData.firstname} {userData.lastname || '!'}</p>
      <p>Email: {userData.email}</p>
      <p>Balance: {formatCurrency(userData.balance)}</p>
      <p>Created At: {formattedCreatedAt}</p>
      <p>Updated At: {formattedUpdatedAt}</p>
      <p>Type: {userData.type || 'N/A'}</p>
    </>
  );
};


export default Home;