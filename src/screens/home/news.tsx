import { fetchdata, fetchnewsletter } from '../../firebase/function'
import React from 'react'
import { Header } from 'screens/components/gen/header'
import Navbarmenu from 'screens/components/gen/navigator/navbarmenu'
import { postdata } from '../../types/interfaces'
import Data from 'screens/contents/data'
import Post from 'screens/contents/post'
import { CircularProgress } from '@mui/material'
import { emaildata } from './activities'

type Props = {}

export default function News({}: Props) {
  const [data, setdata] = React.useState<postdata[]>([])
  const [loading, setloading] = React.useState<boolean>(false)
  const [visible, setvisible] = React.useState<boolean>(false)
  const [selectedschool, setselectedschool] = React.useState('KNHS')
  const [email, setemail] = React.useState<string[]>([])
  const [contact, setcontact] = React.useState<{ to: string }[]>([])

  const schools = ['KNHS', 'SCNHS']

  React.useEffect(() => {
   
    getdata()
  },[selectedschool])

  const getdata = async() => {
    setloading(true)
    const result: postdata[] = await fetchdata('post') || [];
    const filterResult = result.filter((item) => item.type == 'news' && item.active === true && item.school === selectedschool)
    setdata(filterResult)
    setloading(false)

    const emailresult: emaildata[] = await fetchnewsletter('newsletter') || [];

    // Filter and extract valid email addresses
    const filteredEmails: string[] = emailresult
      .filter((item) => item.email && item.email.includes('@')) // Remove items with empty or invalid email addresses
      .map((item) => item.email);
    const filteredContacts: { to: string }[] = emailresult
      .filter((item) => item.contact && item.contact.startsWith('0') && item.contact.length === 11)
      .map((item) => ({ to: item.contact }));

    setcontact(filteredContacts)
    console.log('Filtered Contacts:', filteredContacts)
    console.log('Filtered Emails: ', filteredEmails);
    setemail(filteredEmails)
  }

  const selectSchool = (item: string) => {
    setselectedschool(item)
  }


  return (
    <div className='container'>
    <img draggable = {false} src="https://i.imgur.com/mzylrqX.png" alt="Your Image"/>
      <div className="image-overlay">
        <div style = {{position: 'absolute', top: '13%'}}>
        <div className='school-select-container'>
          {schools && schools.map((item, index) => 
            <a
              onClick={() => selectSchool(item)}
              className={selectedschool === item ? 'school-select' : 'unselected'}
              key={index}>{item} </a>
          )}
        </div>
        {data ? data.map((item, index) => (<Data callback = {getdata} data = {item} />)): <CircularProgress />}
        </div>
      </div>
      {!loading && 
        <Post
          type = 'news'
          callback={getdata}
          isModalVisible = {visible} 
          visible={() => setvisible(true)} 
          closeModal={() => setvisible(false)} 
          setVisible = {setvisible}
          email={email}
          contacts={contact}
          />
      }     
  </div>
  )
}