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
import emailjs from '@emailjs/browser';
var md5 = require('md5');

type Props = {
		closeModal: (e: any) => void,
    isModalVisible: boolean,
		visible: (e: any) => void,
		type: string,
		callback: () => void
		setVisible: React.Dispatch<React.SetStateAction<boolean>>;
		email: string[],
		contacts: number[]
		school: string,
}



function Post({isModalVisible, visible, closeModal, type, callback, setVisible, email, contacts, school}: Props) {

		const {currentUser} = useContext(AuthContext)
		const [form, setform] = useState<postdata[]>(
			[
				{
					id: '',
					uid: currentUser?.uid || '',
					time: new Date(),
					photo: '',
					text: '',
					active: true,
					type: '',
					school: school
				}
			]
		);

		React.useEffect(() => {
			console.log(contacts.join(','))
		},[])

		const getCurrentDay = () => {
			const currentHour = new Date().getHours();
			let greetingMessage = '';
		
			if (currentHour >= 0 && currentHour < 12) {
			  greetingMessage = 'Good Morning';
			} else if (currentHour >= 12 && currentHour < 17) {
			  greetingMessage = 'Good Afternoon';
			} else if (currentHour >= 17 && currentHour < 23) {
			  greetingMessage = 'Good Evening';
			}
			return greetingMessage
		  }
		  const sendNotification = async() => {
		   const result =  getCurrentDay();
		   email.forEach(async (emailaddress: string) => {
			emailjs.send('service_skjlv9o', 'template_9d5rn39', {
				to_email: emailaddress,
				to_name: result,
				message: `${form[0].text} ${form[0].photo || ''}`,
				from_name: `Alumni Tracking ${type}`,
			  }, 'Nec51TUKm1JwG-0kC')
				.then((result) => {
				  console.log(result.text);
				}, (error) => {
				  console.log(error.text);
				});
		   })
		 
		  }

		  const sendSms = async () => {
			const result = getCurrentDay()
			const apiKey = "g3p3m8ht";
			const appId = "lpoIXtmD";
			const apiPwd = "lc71fV4F";
			const url = 'https://api.onbuka.com/v3/sendSms';
			const timestamp = Math.floor(Date.now() / 1000);
			const sign = md5(apiKey + apiPwd +timestamp.toString());
			const number = contacts.join(',');
			console.log(sign)
			console.log(timestamp);
		  
			const payload = {
			  content: `${result}, New Alumni Tracking ${type.toLocaleUpperCase()} Update: \n ${form[0].text}`,
			  numbers: number,
			  appId: appId,
			  senderId: "Alumni Tracking"
			};
		  
			try {
			  const response = await fetch(url, {
				method: 'POST',
				headers: {
				  'Content-Type': 'application/json;charset=UTF-8',
				  'Api-Key': apiKey,
				  'Sign': sign,
				  'Timestamp': timestamp.toString()
				},
				body: JSON.stringify(payload)
			  })
			  const responseData = await response.json();
			  console.log(responseData);
			} catch (error) {
			  console.error(error);
			}
		  };
	
		//   const sendSms = async () => {
		// 	const result =  getCurrentDay();
		// 	const requestOptions: any = {
		// 	  method: 'POST',
		// 	  headers: {
		// 		'Authorization': 'App 94fdca68c0215d82d132321a5919101e-61d40cb6-0637-4cc7-9411-e743a3002876',
		// 		'Content-Type': 'application/json',
		// 		'Accept': 'application/json',
		// 	  },
		// 	  body: JSON.stringify({
		// 		messages: [
		// 		  {
		// 			destinations: contacts,
		// 			from: 'Alumni Tracking',
		// 			text: `${result} New Post from alumni Tracking ${type}. \n ${form[0].text}`,
		// 		  }
		// 		],
		// 	  }),
		// 	  redirect: 'follow',
		// 	};
	  
		// 	try {
		// 	  const response = await fetch("https://9l8j1y.api.infobip.com/sms/2/text/advanced", requestOptions);
		// 	  const result = await response.text();
		// 	  console.log(result);
		// 	} catch (error) {
		// 	  console.log('Error:', error);
		// 	}
		//   };
	  

	const submit = async () => {
    if (form[0].text !== '') {
      try {
			const id = generateRandomKey(25);
			const formRef = doc(db, 'post', id);
			const storageRef = ref(storage, 'images/' + form[0].photo.name);
			await sendNotification().then(async() => {

				await sendSms()
       		if(form[0].photo != ''){

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
								photo: '',
								text: '',
								active: true,
								type: '',
								school: school,
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
							photo: '',
							text: '',
							active: true,
							type: '',
							school: form[0].school,
						},
					]);
				}
				callback()
				setVisible(false)
			})
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