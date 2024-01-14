import { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { FormEventHandler } from 'react'
import '../styles/components.css'
import { Link, LinkProps, To } from 'react-router-dom'
type Props = {
	icon: IconDefinition,
	color?: string,
    to: To,
    title: string,
    onClick: (e: any) => void,
	
}

export const CustomButton = ({
        title,
		color,
		icon, 
        to,
        onClick
	}: Props) => {

  return (
	<>
    <Link onClick={onClick} to =  {to} className='global-buttons'>
			<p>{title}</p>
			<FontAwesomeIcon icon={icon} />
    </Link>
	</>
  )
}

type TableButtonProps = {
  onClick: (e: any) => void,
  title: string,
}

export const TableButton = ({onClick, title}: TableButtonProps) => {
  return (
    <a className='table-button' onClick={onClick}>{title}</a>
  )
}
