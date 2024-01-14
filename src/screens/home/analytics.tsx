import { fetchalleducation, fetchallpersonalinfo, fetchdata, fetcheducation, fetchemployment, fetchsalary, fetchupdate } from '../../firebase/function'
import React, { useState } from 'react'
import BoxChart from '../components/graphs/chart'
import { educationdata, employmentdata, id, personaldata } from '../../types/interfaces'
import Pie from 'screens/components/graphs/pie'
import Totals from 'screens/components/graphs/totals'
import TableButtons from 'screens/contents/table-buttons'
import PieBottom from 'screens/components/graphs/piebottom'
import AddNewAccount from 'screens/contents/addaccount'

type Props = {}

interface general {
  education: {
    examtaker: string[]
    topnotcher: string[]
  }
}

export const Analytics = (props: Props) => {
    const [visible, setvisible] = useState<boolean>(false)
    const [employed, setemployed] = useState<employmentdata[]>([]);
    const [unemployed, setunemployed] = useState<employmentdata[]>([])
    const [retired, setretired] = useState<employmentdata[]>([])
    const [single, setsingle] = useState<number>(0)
    const [married, setmarried] = useState<number>(0)
    const [widow, setwidow] = useState<number>(0)
    const [salary, setsalary] = useState<string[]>([])
    const [nonboardtaker, setnonboardtaker] = useState<educationdata[]>([])
    const [boardtaker, setboardtaker] = useState<educationdata[]>([])
    const [topnotcher, settopnotcher] = useState<educationdata[]>([])
    const [usercount, setusercount] = useState<educationdata[]>([])
    const [highered, sethighered] = useState<educationdata[]>([])
    const [nohighered, setnohighered] = useState<educationdata[]>([])
    const [na, setna] = useState<number>(0)
    const [updates, setupdates] = useState<id[]>([])
    React.useEffect(() => {
        const getdata = async() => {
          const result: employmentdata[] = await fetchsalary() || [];
          const salaries = result.map(item => item.salary);
          const employed = result.filter(item => item.employee === 'Employed' && 'Self-Employed')
          const unemployed = result.filter(item => item.employee === 'Unemployed')
          const retired = result.filter(item => item.employee === 'Retired')
          
          setemployed(employed)
          setunemployed(unemployed)
          setretired(retired)
          setsalary(salaries)

          const personalresult: personaldata[] = await fetchallpersonalinfo() || [];

          const single = personalresult.filter((item) => item.civilstatus === 'Single')
          const married = personalresult.filter(item => item.civilstatus === 'Married')
          const widow = personalresult.filter(item => item.civilstatus === 'W idow')
          setsingle(single.length)
          setmarried(married.length)
          setwidow(widow.length)          
          
          const updatesresult: id[] = await fetchupdate() || [];

          setupdates(updatesresult)

          const educationresult: educationdata[] = await fetchalleducation() || [];
          const board = educationresult.filter(item => item.exam === true)
          const nonboard = educationresult.filter(item => item.exam === false)

          const boardtopnotcher = educationresult.filter(item => item.topnotcher === true)

          setnonboardtaker(nonboard)
          setboardtaker(board)
          settopnotcher(boardtopnotcher)

          const higheredresult = educationresult.filter(item => item.highered  === true)
          const nohigheredresult = educationresult.filter(item => item.highered  == false)
          const applicableresult = higheredresult.length + nohigheredresult.length
          const notapplicable = Math.floor(educationresult.length - applicableresult )
          sethighered(higheredresult)
          setnohighered(nohigheredresult)
          setna(notapplicable)

          setusercount(educationresult)
        }
        getdata()
      },[])

  return (
    <div className='container'>
    <img draggable = {false} src="https://i.imgur.com/mzylrqX.png" alt="Your Image"/>
  <div className="image-overlay">
    <div style = {{position: 'absolute', top: '13%'}}>
      <div className='pie-analytics'>
        <BoxChart chartdata={salary}/>
        <TableButtons onClick={() => setvisible(true)} />
      </div>
    <div className='pie-analytics'>
      <div>
        <Totals count={usercount.length} title = 'Total No. of Alumni'/>
        <Totals count={updates.length} title = 'Updated their Profile'/>
      </div>
      <Pie
       labels = {['Board Taker', 'Non-board Taker']}
        datayes={boardtaker.length} 
        datano={nonboardtaker.length} 
        title='Total Board Takers'
      />
      <Pie
      labels = {['Top Notcher', 'Passers']}
        datayes = {topnotcher.length} 
        datano = {boardtaker.length} 
        title='Total Board Top Notchers'
      />
    </div>
    <div className='pie-analytics'>
      <PieBottom 
        labels = {['Pursued', 'Not Pursued', 'N/A']}
        datayes = {highered.length} 
        datano = {nohighered.length} 
        na = {na}
        title='Pursued Higher Education'
      />
      <PieBottom 
        labels = {['Employed', 'Unemployed', 'Retired']}
        datayes = {employed.length} 
        datano = {unemployed.length} 
        na = {retired.length}
        title='Alumni Employment Status'
      />
      <PieBottom 
        labels = {['Single', 'Married', 'Widow']}
        datayes = {single} 
        datano = {married} 
        na = {widow}
        title='Alumni Marital Status'
      />
    </div>
    </div>
  </div>
  <AddNewAccount
          type = 'activities'
          isModalVisible = {visible} 
          visible={() => setvisible(true)} 
          closeModal={() => setvisible(false)} />
</div>
  )
}