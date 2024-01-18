import { CircularProgress } from '@mui/material'
import { fetchdata } from '../../firebase/function'
import React, { useEffect } from 'react'
import Card from 'screens/components/global/card'
import Data from 'screens/contents/data'
import Post from 'screens/contents/post'
import { postdata } from 'types/interfaces'

type Props = {}

export default function Activities({}: Props) {

  const [data, setdata] = React.useState<postdata[]>([])
  const [visible, setvisible] = React.useState(false)
  const [loading, setloading] = React.useState(true)
  const [selectedschool, setselectedschool] = React.useState('KNHS')
  const schools = ['KNHS', 'SCNHS']
  React.useEffect(() => {
   
    getdata()
  },[selectedschool])

  const getdata = async() => {

    const result: postdata[] = await fetchdata('post') || [];
    const filterResult = result.filter((item) => item.type == 'activities' && item.active === true && item.school === selectedschool)
    setdata(filterResult)
    console.log(filterResult)
    setloading(false)
  }

  const selectSchool = (item: string) => {
    setselectedschool(item)
  }

  return (
    <div className='container'>
        <img draggable = {false} src="https://i.imgur.com/mzylrqX.png" alt="Your Image"/>
      <div className="image-overlay">
        <div style = {{position: 'absolute', top: '13%'}}>
        <div className='school-select-container'>
          {schools && schools.map((item, index) => 
            <a
              onClick={() => selectSchool(item)}
              className={selectedschool === item ? 'school-select' : 'unselected'}
              key={index}>{item} </a>
          )}
        </div>
        {data ? data.map((item, index) => (<Data callback={getdata} data={item} />)) : <CircularProgress />}

        </div>
      </div>

      {!loading ? 
        <Post
          callback={getdata}
          type = 'activities'
          isModalVisible = {visible} 
          visible={() => setvisible(true)} 
          closeModal={() => setvisible(false)} 
          setVisible = {setvisible}
          />
      :
      <CircularProgress />
      }     
      </div>
  )
}