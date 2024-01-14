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
type Props = {
		closeModal: (e: any) => void,
    isModalVisible: boolean,
		visible: (e: any) => void,
		type: string,
}



function AddNewAccount({isModalVisible, visible, closeModal, type}: Props) {

		const {currentUser} = useContext(AuthContext);
        const [selectedschool, setselectedschool] = useState('');
        const [temppassword] = useState('summer@1234')
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
				}
			]
		);


	const submit = async () => {
    if (
        form[0].email !== '' || 
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
                        firstname: '',
                        middlename: '',
                        lastname: '',
                        suffix: '',
                    },
                    name: form[0].fullname.firstname + form[0].fullname.middlename + form[0].fullname.lastname + form[0].fullname?.suffix,
                    email: form[0].email,
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
        return
    } else {

        return (
            <div className='post-modal'>
							<Card className='form-wrapper post'>
								<div className='form-container'>
								<h1>Add New account</h1>
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