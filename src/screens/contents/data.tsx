import { collection, getDocs, updateDoc, doc } from '@firebase/firestore'
import { db } from '../../firebase/index'
import React from 'react'
import Card from 'screens/components/global/card'
import { admindata, logindata, postdata } from 'types/interfaces'
import TimeAgo from 'react-timeago';
import './styles/contents.css'
import Modal from 'screens/components/global/modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDeleteLeft, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import Edit from './edit'
type Props = {

	data: postdata
	callback: () => void;

}


export default function Data({data,callback}: Props) {

	const [userdata, setuserdata] = React.useState<admindata[]>([])
	const [modalOpen, setModalOpen] = React.useState(false);
	const [edit, setedit] = React.useState(false)
	const [showDeleteAlert, setShowDeleteAlert] = React.useState(false); // State for delete confirmation alert

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

	React.useEffect(() => {
		getUserData()
	},[])

	const getUserData = async () => {
    const querySnapshot = await getDocs(collection(db, "user"));
    const userData: admindata[] = [];
  
    querySnapshot.forEach((doc) => {
      if (doc.data().uid === data.uid) {
        userData.push({
					uid: doc.data().uid,
					photoURL: doc.data().photoURL,
					displayName: doc.data().displayName,
					email: doc.data().email,
					school: doc.data().school
        });
				setuserdata(userData)
      }
    });

	}

	const formatEpochMilliseconds = (timestamp: any) => {
		const dateObject = timestamp && timestamp.toDate();
		return dateObject ? dateObject.getTime() : 0;
	};

	const deleteData = async () => {
		const formRef = doc(db, 'post', data.id);
		await updateDoc(formRef, {
		  active: false,
		});
		setShowDeleteAlert(false); // Close the delete confirmation alert
		callback(); // Trigger the callback function to refresh the data
		alert('Successfully deleted')
	  };

  return (
		<>
    {data && 
			<Card>
				<div className='data-container'>
					<div className='data-header'>
					<div className='floating-edit'> 
						<FontAwesomeIcon  
							style = {{marginLeft: 10, color: 'grey'}}
							onClick={() => setedit(true)} 
							icon = {faEdit}  
							cursor={'pointer'}
						/>
						<FontAwesomeIcon  
							style = {{marginLeft: 10, color: 'red'}}
							onClick={() => setShowDeleteAlert(true)}
							icon = {faTrash}  
							cursor={'pointer'}
						/>
					</div>
						<p>
							{userdata[0]?.displayName}
						</p>
						<TimeAgo style={{fontSize: 12, marginTop: -13, color: '#8FABD3'}} date = {formatEpochMilliseconds(data.time)} />
					</div>
					<div className='data-body'>
						<p>{data.text}</p>
						{data.photo && <img draggable = {false} onClick={openModal} style={{ cursor: 'pointer' }} src={data.photo} width={'95%'} height={200}/>}
					</div>
				</div>
    	</Card>
		}
		<Modal  isOpen={modalOpen} onClose={closeModal} imageSrc={data.photo}/>
		{edit && <Edit callback={() => callback()} closeModal={() => setedit(false)} rawdata={data} />}
		{/* Custom Delete Confirmation Alert */}
		{showDeleteAlert && (
        <div className="modal-overlay" >
		<Card className='form-wrapper post'>
			<div className='form-container'>
				<p>Are you sure you want to delete this data?</p>
				<button onClick={deleteData}>Yes</button>
				<br/>
				<button onClick={() => setShowDeleteAlert(false)}>No</button>
		  	</div>
		</Card>
        </div>
      )}
		</>
  )
}