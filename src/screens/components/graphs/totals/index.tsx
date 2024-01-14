import React from 'react'

type Props = {
    title: string,
    count: number,
}

const Totals = ({title, count}: Props) => {
  return (
    <div className='total-container'>
      <h1>{title}</h1>
      <h2>{count}</h2>
    </div>
  )
}

export default Totals