import { faChevronRight, faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons'
import { AuthContext } from 'auth'
import React, { useContext, useState } from 'react'
import Card from 'screens/components/global/card'
import { LoginFields, Select, TextField } from 'screens/components/global/fields'
import { personaldata, postdata } from 'types/interfaces'
import {addDoc, collection, setDoc, doc} from '@firebase/firestore'
import { auth, db, storage } from '../../firebase/index'
import { generateRandomKey } from '../../firebase/function'
import { uploadBytes, getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import {createUserWithEmailAndPassword} from 'firebase/auth'
import Papa from 'papaparse';

type Props = {
		closeModal: (e: any) => void,
        isModalVisible: boolean,
		visible: (e: any) => void,
		type: string,
        callback: (e: string) => void
}



function AddNewAccount({isModalVisible, visible, closeModal, type, callback}: Props) {

		const {currentUser} = useContext(AuthContext);
        const [selectedschool, setselectedschool] = useState('');
        const [schoolid, setschoolid] = useState('');
        const [loading, setloading] = useState(false)
        const [temppassword] = useState('summer@1234')
        const [csvFile, setCsvFile] = useState<any>(null);
		const [form, setform] = useState<personaldata[]>(
			[
				{
                    fullname: {
                        firstname: '',
                        middlename: '',
                        lastname: '',
                        suffix: '',
                    },
					uid: '',
                    name: '',
                    birthdate:  '',
                    civilstatus:  '',
                    contactnumber:  '',
                    email:  '',
                    social:  '',
                    age:  '',
                    sex:  '',
                    address:  '',
                    sy: '',
				}
			]
		);

        const handleCsvFileChange = (e: any) => {
            if (e.target.files.length > 0) {
              setCsvFile(e.target.files[0]);
            } else {
              setCsvFile(null);
            }
          };

          const handleUploadButtonClick = async () => {
            try {
              const csvData: any = await new Promise((resolve) => {
                Papa.parse(csvFile, {
                  complete: (result) => resolve(result.data),
                  header: true,
                });
              });
          
              if (csvData.length === 0) {
                alert('CSV File empty');
                return;
              }
          
              console.log(csvData);
              callback('wtf');
              setloading(true)
              let completedIterations = 0;
              console.log(completedIterations)

              for (const row of csvData) {
                try {
                  const { email, firstname, middlename, lastname, suffix, sex, school, idnumber } = row;
          
                  const userCredential = await createUserWithEmailAndPassword(auth, email, idnumber + lastname);
                  const userId = userCredential.user.uid;
          
                  const userRef = doc(db, 'user', userId);
          
                  await setDoc(userRef, {
                    uid: userId,
                    fullname: {
                      firstname: firstname,
                      middlename: middlename,
                      lastname: lastname,
                      suffix: suffix,
                    },
                    username: lastname + idnumber,
                    schoolid: idnumber,
                    name: firstname + ' ' + middlename + ' ' + lastname + ' ' + suffix,
                    email: email || lastname + idnumber + '@' + lastname + idnumber + '.qwe',
                    sex: sex,
                    school: school,
                    type: 'alumni',
                  });
          
                    console.log(`Account created for ${email}`);
                    if (completedIterations !== csvData.length) {
                    console.log('bullshit right?');
                    console.log(completedIterations)
                    setloading(true)
                    callback('wtf');
                  }
                callback('wtf');
                setloading(true)
                completedIterations++;
                } catch (error) {
                  console.error('Error creating account:', error);
                  // Handle the error appropriately
                }
              }
          
              if (completedIterations === csvData.length) {
                console.log('All accounts created successfully');
                console.log('depungal')
                setloading(false)
                callback('uto');
              }
            } catch (error) {
              console.error('Error processing CSV file:', error);
              // Handle the error appropriately
            } finally {
            }
          };
          

	const submit = async () => {
    if (
        form[0].fullname.firstname !== '' || 
        form[0].fullname.middlename !== '' || 
        form[0].fullname.lastname || 
        selectedschool !== '' || 
        form[0].sex !== '') {
			const id = generateRandomKey(25);
        try {
            await createUserWithEmailAndPassword(auth, form[0].email, temppassword).then(async(res) => {
                
			const userRef = doc(db, 'user', res.user.uid);
                await setDoc(userRef, {
                    uid: res.user.uid,
                    fullname: {
                        firstname: form[0].fullname.firstname,
                        middlename: form[0].fullname.middlename,
                        lastname: form[0].fullname.lastname,
                        suffix: form[0].fullname.suffix,
                    },
                    username: form[0].fullname.lastname + schoolid,
                    name: form[0].fullname.firstname + form[0].fullname.middlename + form[0].fullname.lastname + form[0].fullname?.suffix,
                    email: form[0].email || form[0].fullname.lastname + schoolid + '@' + form[0].fullname.lastname + schoolid + '.qwe',
                    sex: form[0].sex,
                    school: selectedschool,
                    type: 'alumni'

            });
                alert(`Successfully added new account`);
                setselectedschool('KNHS')
                setform([
                    {
                        fullname: {
                            firstname: '',
                            middlename: '',
                            lastname: '',
                            suffix: '',}
                        ,
                        uid: '',
                        name: '',
                        birthdate:  '',
                        civilstatus:  '',
                        contactnumber:  '',
                        email:  '',
                        social:  '',
                        age:  '',
                        sex:  '',
                        address:  '',
                        sy: '',
                    },
                ]);
                visible(false)
            }).catch((error: any) => {
                console.log(error)
                alert('something went wrong' + error)
                
            })
         } catch (error) {
        console.error('Error adding post:', error);
        // Handle the error appropriately
      }
    } else {
      alert("All fields are required to fill");
    }
  };

    if(!isModalVisible){
        if(loading) {
            return (
                <div className='post-modal'>uploading</div>
            )
        } else {
            return
        }
    } else {

        return (
            <div className='post-modal'>
							<Card className='form-wrapper post'>
								<div className='form-container'>
								<h1>Add New account</h1>
                                <input
                                    type='file'
                                    accept='.csv'
                                    onChange={handleCsvFileChange}
                                    style={{ marginTop: '20px' }}
                                />
                                
                                {csvFile && (
                                    <button onClick={handleUploadButtonClick} style={{ marginTop: '20px' }}>
                                    Upload CSV and Create Accounts
                                    </button>
                                )}
								<Select
									placeholder='Select a school'
									value={selectedschool}
									onChange={(e) => {
										console.log(e.target.value)
										setform((prev) => [
									{
										...prev[0],
										school: e.target.value
									},
									])}}
									selection={['KNHS', 'SCNHS']}
									title = 'Select School'
									icon={faChevronRight}
								/>
								<LoginFields 
                                    title='First Name'
                                    type  ='text'
                                    icon = {faUser}
                                    disabled = {false}
                                    onChange={(e) => setform((prev) => [
                                    {
                                        ...prev[0],
                                        fullname: {
                                            ...prev[0].fullname,
                                            firstname: e.target.value,
                                        },
                                        },
                                    ])}
                                    placeholder= 'first name' 
                                    value= {form[0].fullname.firstname}

                                />
                                <LoginFields 
                                    title='Middle Name'
                                    type  ='text'
                                    icon = {faUser}
                                    disabled = {false}
                                    onChange={(e) => setform((prev) => [
                                    {
                                        ...prev[0],
                                        fullname: {
                                            ...prev[0].fullname,
                                            middlename: e.target.value,
                                        },
                                        },
                                    ])}
                                    placeholder= 'middle name' 
                                    value= {form[0].fullname.middlename}
                                    
                                />
                                <LoginFields 
                                    title='Last Name'
                                    type  ='text'
                                    icon = {faUser}
                                    disabled = {false}
                                    onChange={(e) => setform((prev) => [
                                        {
                                            ...prev[0],
                                            fullname: {
                                                ...prev[0].fullname,
                                                lastname: e.target.value,
                                            },
                                            },
                                        ])}
                                    placeholder= 'last name' 
                                    value= {form[0].fullname.lastname}
                                    
                                />
                                <LoginFields 
                                    title='Suffix'
                                    type  ='text'
                                    icon = {faUser}
                                    disabled = {false}
                                    onChange={(e) => setform((prev) => [
                                        {
                                            ...prev[0],
                                            fullname: {
                                                ...prev[0].fullname,
                                                suffix: e.target.value,
                                            },
                                            },
                                        ])}
                                    placeholder= 'suffix' 
                                    value= {form[0].fullname.suffix}
                                    
                                />
                                <LoginFields 
                                    title='Email Address*'
                                    type  ='email'
                                    icon = {faEnvelope}
                                    disabled = {false}
                                    onChange={(e) => setform((prev) => [
                                        {
                                        ...prev[0],
                                        email: e.target.value,
                                        },
                                    ])}
                                    placeholder= 'email address' 
                                    value= {form[0].email} 
                                />
                                <Select
									placeholder='Select Gender'
									value={form[0].sex}
									onChange={(e) => {
										console.log(e.target.value)
										setform((prev) => [
									{
										...prev[0],
										sex: e.target.value
									},
									])}}
									selection={['Male', 'Female']}
									title = 'Select Gender'
									icon={faChevronRight}
								/>
                                <LoginFields 
                                    title='School id*'
                                    type  ='text'
                                    icon = {faEnvelope}
                                    disabled = {false}
                                    onChange={(e) => setschoolid(e.target.value)}
                                    placeholder= 'school id' 
                                    value= {form[0].email} 
                                />
                                <LoginFields 
                                    title='Temporary Password'
                                    type  ='text'
                                    icon = {faEnvelope}
                                    disabled = {true}
                                    placeholder={temppassword}
                                    value= {temppassword} 
                                />
                                
										<div className='close-open'>
											<button className='button-background' onClick = {closeModal} style = {{marginTop: 20}}>
													Close
											</button>
											<button onClick = {submit} style = {{marginTop: 20}}>
													Create
											</button>
										</div>
										<br/>
								</div>
						</Card>
                        
						</div>
        )
    }
}

export default AddNewAccount