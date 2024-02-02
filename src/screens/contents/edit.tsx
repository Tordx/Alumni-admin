import { faChevronRight, faLock } from '@fortawesome/free-solid-svg-icons'
import { AuthContext } from 'auth'
import React, { useContext, useState } from 'react'
import Card from 'screens/components/global/card'
import { LoginFields, Select, TextField } from 'screens/components/global/fields'
import { postdata } from 'types/interfaces'
import {addDoc, collection, updateDoc, doc} from '@firebase/firestore'
import { db, storage } from '../../firebase/index'
import { generateRandomKey } from '../../firebase/function'
import { uploadBytes, getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import Modal from 'screens/components/global/modal'

type Props = {
		closeModal: (e: any) => void,
        rawdata: postdata,
		callback: () => void
}



function Edit({rawdata, closeModal, callback}: Props) {

        const data = rawdata;
		console.log(data)
		const [modalOpen, setModalOpen] = useState(false)
		const openModal = () => setModalOpen(true);
		const closeModalImage = () => setModalOpen(false);
		const {currentUser} = useContext(AuthContext)
		const [form, setform] = useState<postdata[]>(
			[
				{
					id: data.id,
					uid: data.uid,
					time: new Date(),
					photo: data.photo,
					text: data.text,
					active: data.active,
					type: data.type,
					school: data.school,
				}
			]
		);


		const submit = async () => {
			if (form[0].text !== '') {
			  try {
					const id = generateRandomKey(25);
					const formRef = doc(db, 'post', form[0].id);
					const storageRef = ref(storage, 'images/' + form[0].photo.name);
			   if(form[0].photo != ''){
						await uploadBytes(storageRef, form[0].photo);
						const imageUrl = await getDownloadURL(storageRef);
									await updateDoc(formRef, {
										id: form[0].id,
										uid: form[0].uid,
										time: form[0].time,
										photo: imageUrl,
										text: form[0].text,
										active: true,
										school: form[0].school,
								});
								alert(`Successfully edited post`);
								setform([
									{
										id: '',
										uid: currentUser?.uid || '',
										time: new Date(),
										photo: null,
										text: '',
										active: true,
										type: '',
										school: 'KNHS',
									},
								]);
						callback()
					} else {
					await updateDoc(formRef, {
								id: form[0].id,
								uid: form[0].uid,
								time: form[0].time,
								photo: '',
								text: form[0].text,
								active: true,
								school: form[0].school,
						});
		
							alert(`Successfully edited post`);
							setform([
								{
								id: id,
								uid: form[0].uid,
								time: form[0].time,
								photo: form[0].photo,
								text: form[0].text,
								active: true,
								type: form[0].type,
								school: form[0].school,
								},
							]);
						}
						callback()
			  } catch (error) {
				console.error('Error adding post:', error);
				// Handle the error appropriately
			  }
			} else {
			  alert("You can't post without a description");
			}
		  };
        return (
			<div className="modal-overlay" >
							<Card className='form-wrapper post'>
								<div className='form-container'>
								<h1>Edit Post</h1>
								
								<LoginFields
									type='file'
									title='Upload a photo'
									placeholder='select photo'
									value= {''}
									onChange={(e) => {
										const file = e.target.files[0]

										console.log(file)
										setform((prev) => [
									{
										...prev[0],
										photo: file,
									},
									])
								}}
									disabled = {false}

								/>
								{form[0]?.photo != '' && (
									<>
									{typeof form[0]?.photo === 'string' ? <p onClick={openModal}>View photo</p> : <p>{form[0].photo?.name}</p>}
									<a style = {{color: 'red'}}onClick={() => setform((prev) => [
												{
													...prev[0],
													photo: '',
												},
												])}>X</a>
									</>
								)}
										<TextField
												title='description'
												icon = {faLock}
												disabled = {false}
												onChange={(e) => {  
													
													setform((prev) => [
												{
													...prev[0],
													text: e.target.value,
												},
												])}}
												placeholder= 'write something here' 
												value= {form[0].text} 
										/>
										<div className='close-open'>
											<button className='button-background' onClick = {closeModal} style = {{marginTop: 20}}>
													Close
											</button>
											<button onClick = {submit} style = {{marginTop: 20}}>
													Post
											</button>
										</div>
										<br/>
								</div>
								
						</Card>
						<Modal  isOpen={modalOpen} onClose={closeModalImage} imageSrc={form[0].photo?.name || form[0].photo}/>

						</div>
        )
}

export default Edit