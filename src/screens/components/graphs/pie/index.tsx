import { PieChart, pieArcLabelClasses } from '@mui/x-charts'
import React from 'react'
import { educationdata } from 'types/interfaces'

type Props = {
    title: string,
    datayes: number,
    datano: number,
    labels: string[]
}

function Pie({title, datayes, datano, labels}: Props) {
  return (
    <div className='pie-container'>
      <h1>{title}</h1>
      <PieChart
          series={[ 
            {
              arcLabel: (item) => `${item?.value}`,
              data: [
                { id: 0, value: datayes, label: labels[0], color: '#2F5288' },
                { id: 1, value: datano, label: labels[1], color: '#8FABD3' },
              ],
            },
          ]}
          sx={{
            [`& .${pieArcLabelClasses.root}`]: {
              fill: 'white',
              fontWeight: 'bold',
            },
          }}
          width={350}
          height={150}
          margin={{right: 175}}
        />
      </div>
  )
}

export default Pie