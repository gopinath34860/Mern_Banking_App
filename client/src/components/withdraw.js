// import { useContext, useState, useEffect } from 'react';
// import { AppContext } from '../context';
// import Card from './card';
// import axios from 'axios';
// import formatCurrency from '../utils/formatCurrency';

// function Withdraw() {
//   const { currentUser } = useContext(AppContext);
//   const [amount, setAmount] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [reload, setReload] = useState(false);

//   useEffect(() => {
//     async function fetchData() {
//       if (!currentUser) {
//         setLoading(false);
//         return;
//       }

//       try {
//         const uid = currentUser.uid;
//         const response = await axios.get(`http://localhost:3001/api/account/${uid}`);
//         setUserData(response.data);
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setLoading(false);
//         setReload(false);
//       }
//     }

//     fetchData();
//   }, [currentUser, reload]);

//   async function handleWithdraw(e) {
//     e.preventDefault();
//     setErrorMessage('');
  
//     if (!amount) {
//       setErrorMessage('Withdrawal amount is required.');
//       return;
//     }
  
//     if (!currentUser) {
//       setErrorMessage('User is not logged in.');
//       return;
//     }
  
//     try {
//       const uid = currentUser.uid;
//       const response = await axios.get(`http://localhost:3001/api/account/${uid}`);
//       const userData = response.data;
  
//       const withdrawalAmount = parseFloat(amount);
  
//       if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
//         setErrorMessage('Invalid withdrawal amount.');
//         return;
//       }
  
//       if (withdrawalAmount > userData.balance) {
//         setErrorMessage('Insufficient balance for withdrawal.');
//         return;
//       }
  
//       const withdrawalResponse = await axios.get(
//         `http://localhost:3001/api/account/withdraw/${userData.balance}/${withdrawalAmount}/${uid}`
//       );
  
//       // Update the user's balance immediately
//       const updatedBalance = withdrawalResponse.data.balance;
//       setUserData({ ...userData, balance: updatedBalance });
  
//       // Clear the input
//      // Clear the input and trigger a reload if needed
//      setAmount('');
//      if (!reload) {
//        setReload(true);
//      }
//    } catch (error) {
//      console.error(error);
//      setErrorMessage('An error occurred while processing your Withdraw.');
//    }
//  }
  
  

//   return (
//     <main id="withdraw" className="container">
//       <h1>Withdraw</h1>
//       {loading ? <p>loading...</p> : (
//         currentUser ? (
//           <Card header="" body={
//             <form>
//               <div className="input-group">
//                 <div className="input-group-prepend">
//                   <span className="input-group-text" id="basic-addon1">₹</span>
//                 </div>
//                 <input
//                   type="number"
//                   className="form-control"
//                   placeholder="Amount"
//                   value={amount}
//                   onChange={(e) => setAmount(e.currentTarget.value)}
//                 />
//               </div>
//               <div className="form-footer">
//                 {userData && <span>Balance: {formatCurrency(userData.balance)}</span>}
//                 <button type="submit" className="btn btn-dark" onClick={handleWithdraw}>
//                   Withdraw
//                 </button>
//               </div>
//               {errorMessage && <div className="alert error">{errorMessage}</div>}
//             </form>
//           } />
//         ) : (
//           <>Please log in.</>
//         )
//       )}
//     </main>
//   );
// }

// export default Withdraw;



import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context';
import Card from './card';
import axios from 'axios';
import formatCurrency from '../utils/formatCurrency';

function Withdraw() {
  const { currentUser } = useContext(AppContext);
  const [amount, setAmount] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // New state for success message
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const uid = currentUser.uid;
        const response = await axios.get(`http://localhost:3001/api/account/${uid}`);
        setUserData(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
        setReload(false);
      }
    }

    fetchData();
  }, [currentUser, reload]);

  async function handleWithdraw(e) {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage(''); // Clear any previous success message

    if (!amount) {
      setErrorMessage('Withdrawal amount is required.');
      return;
    }

    if (!currentUser) {
      setErrorMessage('User is not logged in.');
      return;
    }

    try {
      const uid = currentUser.uid;
      const response = await axios.get(`http://localhost:3001/api/account/${uid}`);
      const userData = response.data;

      const withdrawalAmount = parseFloat(amount);

      if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
        setErrorMessage('Invalid withdrawal amount.');
        return;
      }

      if (withdrawalAmount > userData.balance) {
        setErrorMessage('Insufficient balance for withdrawal.');
        return;
      }

      const withdrawalResponse = await axios.get(
        `http://localhost:3001/api/account/withdraw/${userData.balance}/${withdrawalAmount}/${uid}`
      );

      // Update the user's balance immediately
      const updatedBalance = withdrawalResponse.data.balance;
      setUserData({ ...userData, balance: updatedBalance });

      // Display a success message
      setSuccessMessage('Withdraw Successful!');
      
      // Clear the input and trigger a reload if needed
      setAmount('');
      if (!reload) {
        setReload(true);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('An error occurred while processing your Withdraw.');
    }
  }

  return (
    <main id="withdraw" className="container">
      <h1>Withdraw</h1>
      {loading ? <p>loading...</p> : (
        currentUser ? (
          <Card header="" body={
            <form>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="basic-addon1">₹</span>
                </div>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.currentTarget.value)}
                />
              </div>
              <div className="form-footer">
                {userData && <span>Balance: {formatCurrency(userData.balance)}</span>}
                <button type="submit" className="btn btn-dark" onClick={handleWithdraw}>
                  Withdraw
                </button>
              </div>
              {errorMessage && <div className="alert error">{errorMessage}</div>}
              {successMessage && <div className="alert success">{successMessage}</div>} {/* Display the success message */}
            </form>
          } />
        ) : (
          <>Please log in.</>
        )
      )}
    </main>
  );
}

export default Withdraw;
