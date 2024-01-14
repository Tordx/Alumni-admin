import React from 'react';
import { faAdd, faCalendar, faLock } from '@fortawesome/free-solid-svg-icons';
import Card from 'screens/components/global/card';
import { LoginFields } from 'screens/components/global/fields';
import { statusdata } from 'types/interfaces';
import { updateDoc, doc, addDoc, collection } from '@firebase/firestore';
import { auth, db } from '../../../firebase/index';
import { fetcheducation, fetchstatus, generateRandomKey } from '../../../firebase/function';
import { AuthContext } from 'auth';

type Props = {};

export default function Education({}: Props) {
  const { currentUser } = React.useContext(AuthContext);
  const [newstatus, setnewstatus] = React.useState('');
  const [form, setform] = React.useState<statusdata[]>([{ 
    uid: '', 
    status: [], 
  }]);

  React.useEffect(() => {
    fetchdata();
  },[]);

  const fetchdata = async() => {
    const result: statusdata[] = await fetchstatus(currentUser?.uid || '') || [];
    setform([{ 
      uid: result[0].uid,
      status: result[0].status || [], 
    }]);
  };

  const updateeducation = async () => {
    const { uid, status } = form[0];
    const randomID = generateRandomKey(25)
    if (!status) { 
        alert('Confirm your new password');
    } else {
      try {
        const educationRef = doc(db, 'user', currentUser?.uid || '');
        await updateDoc(educationRef, {
          uid: uid,
          status: status
        }).then(() => {
          alert('Updated Alumni Status successfully updated');
          setform([
            { 
              uid: uid,
              status: status,
            }
          ]);
        });
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

  const addNewStatus = () => {
    const statusExist = form[0].status.includes(newstatus)
    if(statusExist) {
      alert(`You already included ${newstatus}`)
    } else {
      setform((prev) => [
        {
          ...prev[0],
          status: [...prev[0].status, newstatus],
        },
      ]);
      setnewstatus(''); // Clear the new status input after adding
    };
  }

  return (
    <div className='container'>
      <img draggable={false} src="https://i.imgur.com/mzylrqX.png" alt="Your Image"/>
      <div className="image-overlay">
        <Card className='form-wrapper'>
          <div className='form-container'>
            <h1>Alumni Status</h1>
            {form[0].status && form[0].status.map((item, index) => (
              <LoginFields
                title='Attended'
                icon={faCalendar}
                disabled={true}
                onChange={() => {}}
                placeholder='Enter Alumni Status'
                value={item}
              />
            ))} 
            <LoginFields
              title='Did you join alumni before? If Yes, what year?'
              icon={faAdd}
              disabled={false}
              onChange={(e) => {setnewstatus(e.target.value)}}
              placeholder='Enter Alumni Status' 
              value={newstatus} 
            />
            <br/>
            <button onClick={addNewStatus}>add status</button>
            <button onClick={updateeducation} style={{marginTop: 20}}>
              Update
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
