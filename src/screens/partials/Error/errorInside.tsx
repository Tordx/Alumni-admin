import { AuthContext } from 'auth'
import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

type Props = {}

function ErrorInside({}: Props) {
    const {currentUser} = useContext(AuthContext)
    const navigate = useNavigate()

  return (
    <div className='errorwrapper'>
        <img width={250} height={250} src={require('../../../assets/Error.png')} className='error-logo' /> 
        <h1 style = {{color: '#2F5288', fontFamily: 'Montserrat', fontWeight: 'bold', fontSize: 35, textAlign: 'center'}}>YOU ARE DEEP BENEATH THE BLUE</h1>
        {currentUser == null ? (<button onClick={() => navigate('/login')}>Login</button>) : (<button onClick={() => navigate('/alumni/news')}>Go to News</button>)}
    </div>
  )
}

export default ErrorInside