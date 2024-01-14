import React, { useContext, useEffect } from 'react'
import ErrorInside from './errorInside'
import { AuthContext } from 'auth'
import { Navigate } from 'react-router-dom'

type Props = {}

export default function Error({}: Props) {
    
  return (
    <div className='container'>
        <img draggable = {false} src="https://i.imgur.com/mzylrqX.png" alt="Your Image"/>
      <div style = {{justifyContent: 'center', alignItems: 'center'}} className="image-overlay">
        <ErrorInside/>
      </div>
    </div>
  )
}