import {getDocs,collection} from '@firebase/firestore'
import { db } from '..';
import { admindata, educationdata, employmentdata, id, personaldata, postdata, statusdata } from '../../types/interfaces';
import { emaildata } from 'screens/home/activities';


export const generateRandomKey = (length: number) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const fetchdata = async(data: string) => {
  try {
    const querySnapshot = await getDocs(collection(db, data));
    const thisdata: postdata[] = []
    querySnapshot.forEach((doc) => {
      if(doc.data().active === true)
      thisdata.push({
        uid: doc.data().uid,
        id: doc.data().id,
        time: doc.data().time,
        photo: doc.data().photo,
        text: doc.data().text,
        active: doc.data().active,
        type: doc.data().type,
        school: doc.data().school
      })
    })

    return thisdata;

  } catch(error){
    console.log(error)
  }
  }

  export const fetchadmindata = async(uid: string) => {
    try {
      const querySnapshot = await getDocs(collection(db, 'user'));
        const thisdata: admindata[] = []
        querySnapshot.forEach((doc) => {
          if(doc.data().uid === uid)
          thisdata.push({
          uid: doc.data().uid,
          photoURL: doc.data().photoURL,
          displayName: doc.data().displayName,
          email: doc.data().email,
          school: doc.data().school,
          })
        })
        return thisdata
    } catch (error) {
      throw error;
    }
  }

  export const fetchpersonaldata = async(uid: string,) => {
    try {
      const querySnapshot = await getDocs(collection(db, 'user'));
      const thisdata: personaldata[] = []
      querySnapshot.forEach((doc) => {
        if(doc.data().uid === uid)
        thisdata.push({
          fullname: doc.data().fullname,
          uid: doc.data().uid,
          name: doc.data().name,
          birthdate: doc.data().birthdate,
          civilstatus: doc.data().civilstatus,
          contactnumber: doc.data().contactnumber,
          email: doc.data().email,
          social: doc.data().social,
          age: doc.data().age,
          sex: doc.data().sex,
          address: doc.data().address,
          sy: doc.data().sy,
          school: doc.data().school
        })
      })
  
      return thisdata;
  
    } catch(error){
      console.log(error)
    }
  }

  export const fetcheducation = async(uid: string,) => {
    try {
      const querySnapshot = await getDocs(collection(db, 'user'));
      const thisdata: educationdata[] = []
      querySnapshot.forEach((doc) => {
        if(doc.data().uid === uid)
        thisdata.push({
          uid: doc.data().uid,
          school: doc.data().school,
          schoolid: doc.data().schoolid,
          sy: doc.data().sy,
          highered: doc.data().highered,
          course: doc.data().course,
          exam: doc.data().exam,
          topnotcher: doc.data().topnotcher,
          rank: doc.data().rank,
        })
      })
  
      return thisdata;
  
    } catch(error){
      console.log(error)
    }
  }

  export const fetchemployment = async(uid: string) => {

    try {

      const querySnapshot = await getDocs(collection(db, 'user'));
      const thisdata: employmentdata[] = []
      querySnapshot.forEach((doc) => {
        if(doc.data().uid === uid)
          thisdata.push({
          uid: doc.data().uid,
          employee: doc.data().employee,
          currentwork: doc.data().current,
          salary: doc.data().salary,
          history: doc.data().uid, 
          school: doc.data().school
        })
      })
      return thisdata
      
    } catch(error) {
      throw error
    }

  }

  export const fetchstatus = async(uid: string,) => {
    try {
      const querySnapshot = await getDocs(collection(db, 'user'));
      const thisdata: statusdata[] = []
      querySnapshot.forEach((doc) => {
        if(doc.data().uid === uid)
        thisdata.push({
          uid: doc.data().uid,
          status: doc.data().status,
        
        })
      })
  
      return thisdata;
  
    } catch(error){
      console.log(error)
    }
  }

  export const fetchsalary = async() => {
  
    try {

      const querySnapshot = await getDocs(collection(db, 'user'));
      const thisdata: employmentdata[] = []
      querySnapshot.forEach((doc) => {
          thisdata.push({
          uid: doc.data().uid,
          employee: doc.data().employee,
          currentwork: doc.data().current,
          salary: doc.data().salary,
          history: doc.data().uid, 
          school: doc.data().school
        })
      })
      return thisdata
      
    } catch(error) {
      throw error
    }
  }

  export const fetchallemployment = async() => {

    try {

      const querySnapshot = await getDocs(collection(db, 'user'));
      const thisdata: employmentdata[] = []
      querySnapshot.forEach((doc) => {
          thisdata.push({
          uid: doc.data().uid,
          employee: doc.data().employee,
          currentwork: doc.data().current,
          salary: doc.data().salary,
          history: doc.data().history, 
          school: doc.data().school
        })
      })
      return thisdata
      
    } catch(error) {
      throw error
    }

  }
  
  export const fetchalleducation = async() => {
    try {
      const querySnapshot = await getDocs(collection(db, 'user'));
      const thisdata: educationdata[] = []
      querySnapshot.forEach((doc) => {
        thisdata.push({
          uid: doc.data().uid,
          school: doc.data().school,
          schoolid: doc.data().schoolid,
          sy: doc.data().sy,
          highered: doc.data().highered,
          course: doc.data().course,
          exam: doc.data().exam,
          topnotcher: doc.data().topnotcher,
          rank: doc.data().rank,
        })
      })
  
      return thisdata;
  
    } catch(error){
      console.log(error)
    }
  }
  

  export const fetchallpersonalinfo = async() => {
    try {
      const querySnapshot = await getDocs(collection(db, 'user'));
      const thisdata: personaldata[] = []
      querySnapshot.forEach((doc) => {
        thisdata.push({
          fullname: doc.data().fullname,
          uid: doc.data().uid,
          name: doc.data().name,
          birthdate: doc.data().birthdate,
          civilstatus: doc.data().civilstatus,
          contactnumber: doc.data().contactnumber,
          email: doc.data().email,
          social: doc.data().social,
          age: doc.data().age,
          sex: doc.data().sex,
          address: doc.data().address,
          sy: doc.data().sy,
          school: doc.data().school
        })
      })
  
      return thisdata;
  
    } catch(error){
      console.log(error)
    }
  }

  export const fetchupdate = async() => {
    try {
      const querySnapshot = await getDocs(collection(db, 'updates'));
      const thisdata: id[] = []
      querySnapshot.forEach((doc) => {
        thisdata.push({
          uid: doc.data().uid,
          update: doc.data().update,
          date: doc.data().date,
        })
      })
  
      return thisdata;
  
    } catch(error){
      console.log(error)
    }
    }

    export const fetchnewsletter = async(data: string) => {
      try {
        const querySnapshot = await getDocs(collection(db, data));
        const thisdata: emaildata[] = []
        querySnapshot.forEach((doc) => {
          thisdata.push({
            uid: doc.data().uid,
            email: doc.data().email,
            contact: doc.data().contact
          })
        })
    
        return thisdata;
    
      } catch(error){
        console.log(error)
      }
      }
    