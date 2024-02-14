import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context';
import Card from './card';
import axios from 'axios';
import { Link } from "react-router-dom";

function Home() {
  // App Context
  const context = useContext(AppContext);
  const { currentUser } = context;

  // load user data
  const [userData, setUserData] = useState(null);
  const [loading, setLoading]   = useState(true);
  useEffect((userData) => {
    if (currentUser) {
      // Get user data
      console.log(`need to get uid... ${currentUser}`);
      const uid = currentUser.uid;
      console.log(`got uid... ${uid}`);
      axios.get(`http://localhost:3001/api/account/${uid}`)
        .then(function (response) {
          // handle success
          setUserData(response.data);
          console.log(`Homepage userData: ${JSON.stringify(userData)}`);
          setLoading(false);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
        .finally(function () {
          // always executed
        });
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const UserDashboard = () => {
    return (
      <>
        {userData && (
          <>
            <p>Hi, {userData.firstname}!</p>
            <h5>Welcome to our Best Bank</h5>
          </>
        )}
      </>
    )
  }

  return(
    <main id="dashboard">
      <div className="container">
        <h1>Best Bank</h1>
        <img className="banner" src="img/aaa.jpg" alt="Screenshot of Bank App"/>
        {loading &&
          <p>loading...</p>
        }
        {currentUser ? (
          <>
            <Card
            header="Account Dashboard"
            body={<UserDashboard/>}
            />
          </>
        ) : (
          <>
          <p><h1>Welcome to Best Bank</h1> Please <Link to="/login">log in</Link> to continue.</p>
          </>
        )
        }
      </div>
    </main>
  )

}

export default Home;