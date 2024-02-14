import { CircularProgress } from '@mui/material'
import { fetchadmindata, fetchdata, fetchnewsletter } from '../../firebase/function'
import React, { useContext, useEffect, useState } from 'react'
import Card from 'screens/components/global/card'
import Data from 'screens/contents/data'
import Post from 'screens/contents/post'
import { admindata, postdata } from 'types/interfaces'
import emailjs from '@emailjs/browser';
import { AuthContext } from 'auth'

type Props = {}

export interface emaildata {
  uid: string,
  email: string,
  contact: string,
}
export default function Activities({}: Props) {

  const [data, setdata] = React.useState<postdata[]>([])
  const [visible, setvisible] = React.useState(false)
  const [loading, setloading] = React.useState(true)
  const [email, setemail] = useState<string[]>([])
  const [contact, setcontact] = React.useState<number[]>([])
  const {currentUser} = useContext(AuthContext)
  const [userSchool, setuserschool] = useState<string>('')

  React.useEffect(() => {
   
    getdata()
  },[])

  const getdata = async() => {

    const fetchuser: admindata[] = await fetchadmindata(currentUser?.uid || '') || [];
    const userschool = fetchuser[0].school
    const result: postdata[] = await fetchdata('post') || [];
    const filterResult = result.filter((item) => item.type == 'activities' && item.active === true && item.school === userschool)
    const sortedResult = filterResult.sort((a: postdata, b: postdata) => {
      const getTime = (timestamp: any): number => {
          const dateObject = timestamp && timestamp.toDate();
          return dateObject ? dateObject.getTime() : 0;
      };
  
      const timeA = getTime(b.time);
      const timeB = getTime(a.time);
  
      return timeA - timeB;
    });
    setdata(sortedResult)
    setuserschool(userschool)
    console.log(filterResult)
    setloading(false)

    const emailresult: emaildata[] = await fetchnewsletter('newsletter') || [];

    // Filter and extract valid email addresses
    const filteredEmails: string[] = emailresult
      .filter((item) => item.email && item.email.includes('@')) // Remove items with empty or invalid email addresses
      .map((item) => item.email);
      const filteredContacts: number[] = emailresult
      .filter((item) => item.contact && item.contact.startsWith('0') && item.contact.length === 11)
      .map((item) => Number(`63${item.contact.substring(1)}`));

    setcontact(filteredContacts)
    console.log('Filtered Contacts:', filteredContacts)
    console.log('Filtered Emails: ', filteredEmails);
    setemail(filteredEmails)
  }

  return (
    <div className='container'>
        <img draggable = {false} src="https://i.imgur.com/mzylrqX.png" alt="Your Image"/>
      <div className="image-overlay">
        <div style = {{position: 'absolute', top: '13%'}}>
        {data ? data.map((item, index) => (<Data callback={getdata} data={item} />)) :<Card>
				<div className='data-container'><CircularProgress /> </div></Card>}

        </div>
      </div>

      {!loading &&
        <Post
          callback={getdata}
          type = 'activities'
          isModalVisible = {visible} 
          visible={() => setvisible(true)} 
          closeModal={() => setvisible(false)} 
          setVisible = {setvisible}
          email={email}
          contacts={contact}
          school={userSchool}
          />
      }     
      </div>
  )
}