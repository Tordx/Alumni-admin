import { PieChart, pieArcLabelClasses } from '@mui/x-charts'
import React from 'react'

type Props = {
	title: string,
	datayes: number,
	datano: number,
  na: number,
	labels: string[]
}
function PieBottom({title, datayes, datano, na,labels}: Props) {
  return (
    <div className='pie-bottom-container'>
        <h1>{title}</h1>
        <PieChart
            series={[ 
            {
                arcLabel: (item) => `${item?.value}`,
                color: 'white',
                data: [
                { id: 0, value: datayes, label: labels[0], color: '#2F5288' },
                { id: 1, value: datano, label: labels[1], color: '#8FABD3' },
                { id: 2, value: na, label: labels[2], color: '#101828',  },
                ],
            },
            ]}
            sx={{
              [`& .${pieArcLabelClasses.root}`]: {
                fill: 'white',
                fontWeight: 'bold',
              },
            }}
            width={325}
            height={150}
            margin={{right: 150}}
        />
    </div>
  )
}

export default PieBottom