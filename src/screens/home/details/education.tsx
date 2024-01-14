import { faCalendarAlt, faChevronDown, faChevronLeft, faChevronRight, faIdCard, faLock, faRankingStar, faSchool } from '@fortawesome/free-solid-svg-icons'
import { AuthContext } from 'auth'
import React from 'react'
import Card from 'screens/components/global/card'
import { LoginFields, Select } from 'screens/components/global/fields'
import Form from 'screens/contents/table-buttons'
import { educationdata, logindata } from 'types/interfaces'
import {updateDoc, doc, addDoc, collection} from '@firebase/firestore'
import { auth, db } from '../../../firebase/index'
import { User, updatePassword } from 'firebase/auth'
import { fetcheducation, generateRandomKey } from '../../../firebase/function'
type Props = {}

export default function Education({}: Props) {
    const {currentUser} = React.useContext(AuthContext)
    const [form, setform] = React.useState<educationdata[]>([
      { 
        uid: '',
        school: '',
        schoolid: '',
        sy: '',
        highered: false,
        course: '',
        exam: false,
        topnotcher: false,
        rank: '',
      }
    ])

    React.useEffect(() => {

      fetchdata()

    },[])

    const fetchdata = async() => {
      const result: educationdata[] = await fetcheducation(currentUser?.uid || '') || []
        setform([{ 
          uid: result[0].uid,
          school: result[0].school,
          schoolid: result[0].schoolid,
          sy: result[0].sy,
          highered: result[0].highered,
          course: result[0].course,
          exam: result[0].exam,
          topnotcher: result[0].topnotcher,
          rank: result[0].rank,
        }])
    }

    // const dispatchunit = async (incidentID: string, responded: boolean) => {
    //   isLoading(true)
    //   if(!responded){
    //   try {
  
    //     const incidentDocRef = doc(db, 'incident', incidentID);
        
    //     await updateDoc(incidentDocRef, {
    //       responded: true,
    //     }).then(() => {
    //       isLoading(false)
    //       isSuccess(true)
    //     })
        
    //     console.log('Document successfully updated.');
    //   } catch (error) {
    //     isLoading(false)
    //     console.error('Error updating document:', error);
    //   }} else if(responded){
    //       return
    //   }
    // };

    const updateeducation = async () => {

      const {uid, school, schoolid, sy,highered, course, exam, topnotcher, rank } = form[0]
      const randomID = generateRandomKey(25)
      if(!school && !schoolid && !sy){ 
          alert('Confirm your new password')
      } else {
        try {
          const educationRef = doc(db, 'user', currentUser?.uid || '');
            await updateDoc(educationRef, {
              school: school,
              schoolid: schoolid,
              sy: sy,
              highered: highered,
              course: course,
              exam: exam,
              topnotcher: topnotcher,
              rank: rank,
            }).then(() => {
              alert('Educational Information succesfully updated')
              setform([
                { 
                  uid: '',
                  school: '',
                  schoolid: '',
                  sy: '',
                  highered: false,
                  course: '',
                  exam: false,
                  topnotcher: false,
                  rank: '',
                }
            ])
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

            <h1>Educational Details</h1>
                <Select
                    selection={['Kalamansig NHS', 'Santa Maria NHS']}
                    title = 'Did You pursue higher Education'
                    icon = {faChevronRight}
                    onChange={(e) => {
                      setform((prev) => [
                      {
                        ...prev[0],
                        school: e.target.value,
                      },
                      ])}
                    }
                    placeholder= 'Select SHS Graduated' 
                    value= {form[0].school} 
                />
                <LoginFields
                    title='ID Number*'
                    icon = {faIdCard}
                    disabled = {false}
                    onChange={(e) => setform((prev) => [
                        {
                          ...prev[0],
                          schoolid: e.target.value,
                        },
                      ])}
                    placeholder= 'ID number' 
                    value= {form[0].schoolid} 
                />
                <LoginFields
                    title = 'Batch/Year Graduated'
                    icon = {faCalendarAlt}
                    disabled = {false}
                    onChange={(e) => setform((prev) => [
                        {
                          ...prev[0],
                          sy: e.target.value,
                        },
                      ])}
                    placeholder= 'Enter your Batch/Year Graduated' 
                    value= {form[0].sy} 
                />
                <Select
                    selection={['Yes', 'No']}
                    title = 'Did You pursue higher Education'
                    icon = {faChevronRight}
                    onChange={(e) => {
                      const selected = e.target.value == 'Yes' ? true: false
                      setform((prev) => [
                      {
                        ...prev[0],
                        highered: selected,
                      },
                      ])}
                    }
                    placeholder= 'Yes or No' 
                    value= {form[0].highered ? 'Yes' : 'No'} 
                />
                <LoginFields
                    title = 'Course'
                    icon = {faSchool}
                    disabled = {false}
                    onChange={(e) => setform((prev) => [
                        {
                          ...prev[0],
                          course: e.target.value,
                        },
                      ])}
                    placeholder= 'Enter your Course' 
                    value= {form[0].course} 
                />
                <Select
                    selection={['Yes', 'No']}
                    title = 'Did you take any Professional Exam?'
                    icon = {faChevronRight}
                    onChange={(e) => {
                      const selected = e.target.value == 'Yes' ? true: false
                      setform((prev) => [
                      {
                        ...prev[0],
                        exam: selected,
                      },
                      ])}
                    }
                    placeholder= 'Yes or No' 
                    value= {form[0].exam ? 'Yes' : 'No'} 
                />
                <Select
                    selection={['Yes', 'No']}
                    title = 'Are you a Top Notcher'
                    icon = {faChevronRight}
                    onChange={(e) => {
                      const selected = e.target.value == 'Yes' ? true: false
                      setform((prev) => [
                      {
                        ...prev[0],
                        topnotcher: selected,
                      },
                      ])}
                    }
                    placeholder= 'Yes or No' 
                    value= {form[0].topnotcher ? 'Yes' : 'No'} 
                />
                
                <LoginFields
                    title = 'Top Notcher Rank'
                    icon = {faRankingStar}
                    disabled = {false}
                    onChange={(e) => setform((prev) => [
                        {
                          ...prev[0],
                          rank: e.target.value,
                        },
                      ])}
                    placeholder= 'Enter Rank' 
                    value= {form[0].rank} 
                />
                <button onClick = {updateeducation} style = {{marginTop: 20}}>
                      Update
                </button>
            </div>
        </Card>
      </div>
    </div>
  )
}