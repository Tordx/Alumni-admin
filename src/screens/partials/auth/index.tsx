import { collection, getDocs } from '@firebase/firestore';
import { auth, db } from '../../../firebase';
import React, { useContext, useEffect, useState } from 'react'
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from 'react-router-dom';
import '../styles/auth.css'
import { AuthContext } from 'auth';
import { logindata } from 'types/interfaces';
import { LoginFields } from 'screens/components/global/fields';
import { faLock, faUser } from '@fortawesome/free-solid-svg-icons';
export default function Login({}) {

  const [loginemail, setloginEmail] = useState('');
  const [loginpassword, setloginPassword] = useState('');
  const { currentUser } = useContext(AuthContext);
  const [toast, settoast] = useState('');
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const getUserData = async () => {
   try {
 
     const querySnapshot = await getDocs(collection(db, 'user'));
     querySnapshot.forEach((doc: any) => {
       // console.log(doc.id, ' => ', doc.data());
     });
   } catch (error) {
     console.log(error);
     console.log('Error getting user documents: ', error);
   }
 };
 
 getUserData();
   if(currentUser != null){
     navigate("/alumni/analytics");
   }
   }, [currentUser]);

   const checkStatus = async (e: any) => {
    e.preventDefault()
    seterror(false)
    setloading(true)
    settoast('checking email...')
    const querySnapshot = await getDocs(collection(db, "user"));
    const userData: logindata[] = [];
  
    querySnapshot.forEach((doc) => {
      if (doc.data().email === loginemail) {
        userData.push({
            uid: doc.data().uid,
            username: doc.data().username,
            password: doc.data().password,
            newpassword: doc.data().newpassword,
            confirmpassword: doc.data().confirmpassword,
            type: doc.data().type,
            
        });
      }
    });
    
    if (userData.length > 0) {
      settoast('verifying credentials...')
      const isAdmin = userData.some((user) => user.type === "admin");
      console.log(isAdmin);
      if (isAdmin) {
        const email = loginemail;
        const password = loginpassword;
        settoast('logging in...')
        await signInWithEmailAndPassword(auth, email, password).then(() => {
          setloading(false)
          navigate("/alumni/analytics")
        }).catch((error: any) => {
          console.log(error)
          if(error == 'FirebaseError: Firebase: Error (auth/invalid-login-credentials).'){
          settoast('email and password did not matched.')
          seterror(true)
        }
        })
      } else {
        settoast('The provided email used in a non-admin account')
        seterror(true)
      }
    } else {
      settoast('email provided have no account with us')
      seterror(true)
    }
  }

  const handleKeyPress = (event: any) => {
    if (event.key === 'Enter') {
      console.log(event)
      checkStatus(event);
    }
  };

  return (
    <div draggable = {false} className="container">
      <img draggable = {false} src="https://i.imgur.com/mzylrqX.png" alt="Your Image"/>
      <div className="image-overlay">
        <div className='login-box'>
          {/* <span className='image-container'>
            <img className='logo' src ='https://i.imgur.com/4ywrjZF.png' />
            <img className='logo'  src='https://i.imgur.com/5CH306W.png'/>
          </span> */}
          <h1>Admin Login</h1>
          <LoginFields 
            title = 'email address'
            icon = {faUser}
            value={loginemail}
            placeholder='email address'
            disabled = {false}
            onChange={(e) => setloginEmail(e.target.value)} 
            onKeyDown={(e) => handleKeyPress(e)}
          />
          <LoginFields 
            title = 'password'
            type  ='password'
            icon = {faLock}
            value={loginpassword}
            placeholder='password'
            disabled = {false}
            onChange={(e) => setloginPassword(e.target.value)} 
            onKeyDown={(e) => handleKeyPress(e)}
          />
          <a>Forgot password?</a>
          <button  onClick={checkStatus}>Login</button>
          {loading && <p style={{color: error ? 'red' : 'black', fontSize: 12, textAlign: 'center'}}>{toast}</p>}
        </div>
      </div>
    </div>
  )
}