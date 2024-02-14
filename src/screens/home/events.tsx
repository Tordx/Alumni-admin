import { fetchadmindata, fetchdata, fetcheducation, fetchnewsletter, fetchpersonaldata } from '../../firebase/function'
import React, { useContext, useState } from 'react'
import { admindata, educationdata, logindata, personaldata, postdata } from '../../types/interfaces'
import Data from 'screens/contents/data'
import Post from 'screens/contents/post'
import { CircularProgress } from '@mui/material'
import { emaildata } from './activities'
import { AuthContext } from 'auth'

type Props = {}

export default function Events({}: Props) {

  const [data, setdata] = React.useState<postdata[]>([])
  const [loading, setloading] = React.useState<boolean>(false)
  const [visible, setvisible] = React.useState<boolean>(false)
  const [email, setemail] = React.useState<string[]>([])
  const [contact, setcontact] = React.useState<number[]>([])
  const [userSchool, setuserschool] = useState<string>('')
  const {currentUser} = useContext(AuthContext)
  React.useEffect(() => {
   
    getdata()
  },[])
  const getdata = async() => {
    setloading(true)
    const fetchuser: admindata[] = await fetchadmindata(currentUser?.uid || '') || [];
    const userschool = fetchuser[0].school
    const result: postdata[] = await fetchdata('post') || [];
    const filterResult = result.filter((item) => item.type == 'events' && item.active === true && item.school === userschool)
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
        {data ? data.map((item, index) => (<Data callback={getdata} data = {item} />)): <CircularProgress />}
        </div>
      </div>
      {!loading &&
        <Post
          type = 'events'
          callback={getdata}
          isModalVisible = {visible} 
          visible={() => setvisible(true)} 
          closeModal={() => setvisible(false)} 
          setVisible = {setvisible}
          email={email}
          contacts={contact}
          school= {userSchool}
          />
      }     
  </div>
  )
}