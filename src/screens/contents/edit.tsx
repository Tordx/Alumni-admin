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

type Props = {
		closeModal: (e: any) => void,
        rawdata: postdata,
		callback: () => void
}



function Edit({rawdata, closeModal, callback}: Props) {

        const data = rawdata;
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
		console.log(form[0].id)
      try {
			const id = generateRandomKey(25);
			const postId = form[0].id || id; // Use form[0].id if available, otherwise generate a new ID

			const formRef = doc(db, 'post', postId);
			console.log(formRef)
       if(form[0].photo != ''){
				const formData = new FormData();
					formData.append("image", form[0].photo); 
					const myHeaders = new Headers();
					myHeaders.append("Authorization", "Client-ID 5bfea368cb77e30"); 

					const requestOptions: any = {
							method: 'POST',
							headers: myHeaders,
							body: formData,
							redirect: 'follow'
					};
					try {
						const response = await fetch("https://api.imgur.com/3/image", requestOptions);
						const result = await response.json();
						if(!result.success) {
							alert('Something went wrong while uploading image, do not include image yet.')
							return
						}
						console.log(result);
							await updateDoc(formRef, {
								id: form[0].photo,
								uid: form[0].uid,
								time: form[0].time,
								photo: result?.url || null,
								text: form[0].text,
								active: true,
								type: form[0].type,
								school: form[0].school,
						});
						alert(`Successfully edited post`);
						callback()
					} catch (error) {
							console.error('Error uploading image to Imgur:', error);
					}
			} else {
        await updateDoc(formRef, {
						id: form[0].id,
						uid: form[0].uid,
						time: form[0].time,
						photo: '',
						text: form[0].text,
						active: true,
						type: form[0].type,
						school: form[0].school,
				});

					alert(`Successfully edited post`);
					callback()
				}
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
													photo: null,
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

export default Edit