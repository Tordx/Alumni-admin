//NOTE:You must create new interface for each data that has different data types

//this interface is use in personaldata
//if you have any additions add comment
export interface name {
  firstname: string,
  middlename: string,
  lastname: string,
  suffix: string,

}
//---->personaldata use when pulling user's personal information<-----
//---->data usage in header navigation bar, login, and profile<------
export interface personaldata {

  uid: string,
  name: string,
  fullname: name,
  birthdate: string,
  civilstatus: string,
  contactnumber: string,
  email: string,
  social: string,
  age: string,
  sex: string,
  address: string,
  sy: string,

}

//---> education use when pulling user's educational information <---- //
//this data can also be seen by the admin, but are only limited to them and the user //

export interface educationdata {

  uid: string,
  school: string,
  schoolid: string,
  sy: string,
  highered: boolean,
  course: string,
  exam: boolean,
  topnotcher: boolean,
  rank: string,

}

//work history, where user is currently working at, and this data is use by employmentdata history//
//this data can also be seen by the admin, but are only limited to them and the user //

interface historydetails {

  uid: string,
  work: string,
  yearstart: string,
  yearend: string,
  current: boolean,
}

// this uses the above details
//this data can also be seen by the admin, but are only limited to them and the user //

export interface employmentdata {
 
  uid: string,
  employee: string,
  currentwork: string,
  salary: string,
  history: historydetails,

}

//login data can only be use in login and change auth
//passwords are encrypted, please do not expose

export interface logindata {

  uid: string,
  username: string,
  password: string,
  newpassword: string,
  confirmpassword: string,
  type: string,
  
}

//this is for alumni status
// adds new data if ever user attends last year's alumni home coming

export interface statusdata {
  status: string[],
  uid: string,
}

//chilren use in app.tsx only, to nest components for login auth

export interface children {
  children: any | null
}

//postdata used in data.tsx to show admin posts

export interface postdata {
  id: string,
  uid: string,
  time: Date,
  photo: any,
  text: string,
  active: boolean,
  type: string,
  school: string,
}

export interface id {
  uid: string,
  update: string,
  date: {
    seconds: number;
    nanoseconds: number;
  }
}

export interface idprocessed {
  uid: string,
  update: string,
  formattedDate: string,
}

export interface admindata {
  uid: string,
  photoURL: string,
  displayName: string,
  email: string,
  school: string,
}

