import { faChevronRight, faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons'
import { AuthContext } from 'auth'
import React, { useContext, useState } from 'react'
import Card from 'screens/components/global/card'
import { LoginFields, Select, TextField } from 'screens/components/global/fields'
import { personaldata, postdata } from 'types/interfaces'
import {addDoc, collection} from '@firebase/firestore'
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
    if (form[0].email !== '' || form[0].name !== '' || selectedschool !== '' || form[0].sex !== '') {
			const id = generateRandomKey(25);
			const userRef = collection(db, 'user');
        try {
            await createUserWithEmailAndPassword(auth, form[0].email, temppassword).then(async() => {
                await addDoc(userRef, {
                    uid: id,
                    name: form[0].name,
                    email: form[0].email,
                    sex: form[0].sex,
                    school: selectedschool,

            });
                alert(`Successfully added new account`);
                setselectedschool('KNHS')
                setform([
                    {
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
            }).catch(() => {
                alert('something went wrong')
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
                                    title='Full Name'
                                    type  ='text'
                                    icon = {faUser}
                                    disabled = {false}
                                    onChange={(e) => setform((prev) => [
                                        {
                                        ...prev[0],
                                        name: e.target.value,
                                        },
                                    ])}
                                    placeholder= 'first name, middle name, last name' 
                                    value= {form[0].name} 
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