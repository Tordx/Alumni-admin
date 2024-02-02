import { faCalendarDay, faChevronDown, faChevronLeft, faChevronRight, faGlobe, faLock, faMap, faMehBlank, faPhone, faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { AuthContext } from 'auth'
import React from 'react'
import Card from 'screens/components/global/card'
import { LoginFields, Select } from 'screens/components/global/fields'
import Form from 'screens/contents/table-buttons'
import { educationdata, logindata, personaldata } from 'types/interfaces'
import {updateDoc, doc, addDoc, collection} from '@firebase/firestore'
import { auth, db } from '../../../firebase/index'
import { User, updatePassword } from 'firebase/auth'
import { fetcheducation, fetchpersonaldata, generateRandomKey } from '../../../firebase/function'
type Props = {}

export default function Personal({}: Props) {
    const {currentUser} = React.useContext(AuthContext)
    const [form, setform] = React.useState<personaldata[]>([
      { 
        fullname: {
          firstname: '',
          middlename: '',
          lastname: '',
          suffix: '',
        },
        uid: '',
        name: '',
        birthdate: '',
        civilstatus: '',
        contactnumber: '',
        email: '',
        social: '',
        age: '',
        sex: '',
        address: '',
        sy: '',
      }
    ])

    React.useEffect(() => {

      fetchdata()

    },[])

    const fetchdata = async() => {
      const result: personaldata[] = await fetchpersonaldata(currentUser?.uid || '') || []
        setform([{
          fullname: {
            firstname: '',
            middlename: '',
            lastname: '',
            suffix: '',
         },
          uid: result[0].uid,
          name: result[0].name,
          birthdate: result[0].birthdate,
          civilstatus: result[0].civilstatus,
          contactnumber: result[0].contactnumber,
          email: result[0].email,
          social: result[0].social,
          address: result[0].address,
          sex: result[0].sex,
          age: result[0].age,
          sy: form[0].sy,
        }])
    }

    const updatepersonalinfo = async () => {

      const {uid, name, birthdate, civilstatus, contactnumber, email, social, age, sex, address} = form[0]
      const randomID = generateRandomKey(25)
      if(!name && !birthdate && !civilstatus){ 
          alert('Confirm your new password')
      } else {
        try {

          const personalRef = doc(db, 'user', currentUser?.uid || '');
            await updateDoc(personalRef, {
              uid: uid,
              name: name,
              birthdate: birthdate.toString(),
              age: age,
              address: address,
              sex: sex,
              civilstatus: civilstatus,
              contactnumber: contactnumber,
              email: email,
              social: social,
            }).then(() => {
              alert('Personal Information succesfully updated')
              setform([
                { 
                  fullname: {
                    firstname: '',
                    middlename: '',
                    lastname: '',
                    suffix: '',
                  },
                  uid: form[0].uid,
                  name: form[0].name,
                  birthdate: form[0].birthdate,
                  civilstatus: form[0].civilstatus,
                  contactnumber: form[0].contactnumber,
                  email: form[0].email,
                  social: form[0].social,
                  age: form[0].age,
                  sex: form[0].sex,
                  address: form[0].address,
                  sy: form[0].sy,
                }
              ])
            fetchdata()
        })
        const updatesCollection = collection(db, 'updates');
        await addDoc(updatesCollection, {
          uid: currentUser?.uid || '',
          update: randomID,
        });
        } catch (error) {
        console.error('Error updating document:', error);
        }
      } 
    };

  return (
    <div className='container'>
        <img draggable = {false} src="https://i.imgur.com/mzylrqX.png" alt="Your Image"/>
      <div className="image-overlay">
        <Card className='form-wrapper'>
            <div className='form-container'>

            <h1>Personal Details</h1>
                <LoginFields
                    title='Full Name'
                    icon = {faUserCircle}
                    disabled = {false}
                    onChange={(e) => setform((prev) => [
                        {
                          ...prev[0],
                          name: e.target.value,
                        },
                      ])}
                    placeholder= 'Enter your Full Name' 
                    value= {form[0].name} 
                />
                <LoginFields
                    
                    type = 'date'
                    title = 'Birth day'
                    disabled = {false}
                    onChange={(e) => {
                      const selectedDate = new Date(e.target.value);
                      const dateObject = new Date(selectedDate);
                      const formattedDate = (dateObject.getMonth() + 1).toString().padStart(2, '0') + '-' +
                                            dateObject.getDate().toString().padStart(2, '0') + '-' +
                                            dateObject.getFullYear();

                      console.log(formattedDate);
                      setform((prev) => [
                        {
                          ...prev[0],
                          birthdate: e.target.value
                        },
                      ])}}
                    placeholder= 'Enter your Birthdate' 
                    value= {form[0].birthdate} 
                />
                <LoginFields
                    title = 'Age'
                    icon = {faCalendarDay}
                    disabled = {false}
                    onChange={(e) => setform((prev) => [
                        {
                          ...prev[0],
                          age: e.target.value,
                        },
                      ])}
                    placeholder= 'Enter your Age' 
                    value= {form[0].age} 
                />
                <Select
                    selection={['Male', 'Female']}
                    title = 'Sex'
                    icon = {faChevronRight}
                    onChange={(e) => {
                      setform((prev) => [
                      {
                        ...prev[0],
                        sex: e.target.value,
                      },
                      ])}
                    }
                    placeholder= 'Select Sex' 
                    value= {form[0].sex} 
                />
                <Select
                    selection={['Single', 'Married', 'Divorce', 'Widow']}
                    title = 'Civil Status'
                    icon = {faChevronRight}
                    onChange={(e) => {
                      setform((prev) => [
                      {
                        ...prev[0],
                        civilstatus: e.target.value,
                      },
                      ])}
                    }
                    placeholder= 'Select Status' 
                    value= {form[0].civilstatus} 
                />
                <LoginFields
                    title = 'Address'
                    icon = {faMap}
                    disabled = {false}
                    onChange={(e) => setform((prev) => [
                        {
                          ...prev[0],
                          address: e.target.value,
                        },
                      ])}
                    placeholder= 'Enter your Address' 
                    value= {form[0].address} 
                />
                <LoginFields
                    title = 'Contact Number'
                    icon = {faPhone}
                    disabled = {false}
                    onChange={(e) => setform((prev) => [
                        {
                          ...prev[0],
                          contactnumber: e.target.value,
                        },
                      ])}
                    placeholder= 'Enter your Contact Number' 
                    value= {form[0].contactnumber} 
                />
                <LoginFields
                    title = 'Social Media(e.g.: Facebook, X, Instragram)'
                    icon = {faGlobe}
                    disabled = {false}
                    onChange={(e) => setform((prev) => [
                        {
                          ...prev[0],
                          social: e.target.value,
                        },
                      ])}
                    placeholder= 'Enter your Social Media' 
                    value= {form[0].social} 
                />
                <button onClick = {updatepersonalinfo} style = {{marginTop: 20}}>
                      Update
                </button>
            </div>
        </Card>
      </div>
    </div>
  )
}