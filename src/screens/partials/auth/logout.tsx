import { AuthContext } from 'auth'
import { signOut } from 'firebase/auth'
import React, { useContext } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { auth } from '../../../firebase/index';
type Props = {}

export default function Logout({}: Props) {


    const {currentUser} = useContext(AuthContext)
    const navigate = useNavigate()
    React.useEffect(() => {
        checkUser()
    },[])
    const checkUser = async() => {

        if (currentUser === null) {
            return <Navigate to="/login" />;
        } else {
            try {
                await signOut(auth).then(() => {
                navigate('/login')
                alert("User signed out successfully.");
                })
            } catch (error) {
                console.error("Error signing out:", error);
            }
        }
      
    }

  return (
    <div>logout</div>
  )
}