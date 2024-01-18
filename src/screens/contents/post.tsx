import { faChevronRight, faLock } from '@fortawesome/free-solid-svg-icons'
import { AuthContext } from 'auth'
import React, { useContext, useState } from 'react'
import Card from 'screens/components/global/card'
import { LoginFields, Select, TextField } from 'screens/components/global/fields'
import { postdata } from 'types/interfaces'
import {addDoc, collection, doc, setDoc} from '@firebase/firestore'
import { db, storage } from '../../firebase/index'
import { generateRandomKey } from '../../firebase/function'
import { uploadBytes, getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

type Props = {
		closeModal: (e: any) => void,
    isModalVisible: boolean,
		visible: (e: any) => void,
		type: string,
		callback: () => void
		setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}



function Post({isModalVisible, visible, closeModal, type, callback, setVisible}: Props) {

		const {currentUser} = useContext(AuthContext)
		const [form, setform] = useState<postdata[]>(
			[
				{
					id: '',
					uid: currentUser?.uid || '',
					time: new Date(),
					photo: [],
					text: '',
					active: true,
					type: '',
					school: 'KNHS'
				}
			]
		);


	const submit = async () => {
    if (form[0].text !== '') {
      try {
			const id = generateRandomKey(25);
			const formRef = doc(db, 'post', id);
			const storageRef = ref(storage, 'images/' + form[0].photo.name);
       if(form[0].photo != null){
				await uploadBytes(storageRef, form[0].photo);
    			const imageUrl = await getDownloadURL(storageRef);
							await setDoc(formRef, {
								id: id,
								uid: form[0].uid,
								time: form[0].time,
								photo: imageUrl,
								text: form[0].text,
								active: true,
								type: type,
								school: form[0].school,
						});
						alert(`Successfully added ${type} post`);
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
				setVisible(false)
			} else {
        	await setDoc(formRef, {
						id: id,
						uid: form[0].uid,
						time: form[0].time,
						photo: '',
						text: form[0].text,
						active: true,
						type: type,
						school: form[0].school,
				});

					alert(`Successfully added ${type} post`);
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
				}
				callback()
				setVisible(false)
      } catch (error) {
        console.error('Error adding post:', error);
        // Handle the error appropriately
      }
    } else {
      alert("You can't post without a description");
    }
  };

    if(!isModalVisible){
        return (
					<button className='post-button' onClick={visible}>Create Post</button>
        )
    } else {

        return (
            <div className='post-modal'>
							<Card className='form-wrapper post'>
								<div className='form-container'>
								<h1>Create Post</h1>
								<Select
									placeholder='Select a school'
									value={form[0].school}
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
									type='file'
									title='Upload a photo'
									placeholder='select photo'
									value= {''}
									onChange={(e) => {
										const file = e.target.files[0]
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
									<p>Selected file: {form[0]?.photo?.name}</p>
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
						</div>
        )
    }
}

export default Post