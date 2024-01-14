
import React, {useState} from "react";
import { Link } from 'react-router-dom';
import '../../styles/components.css'
import { Icon } from "@mui/material";
type Props = {
    item: Items,
    active: any,
    onClick: (e: any) => void,
}

type Items = {
    path: string,
    id: number,
    title: string,

}

 const NavBarItems: React.FC<Props> = ({ item, active, onClick}) => {

    const [hover, setHover] = useState(false);
    return (
        <Link
            onClick={onClick}
            to={item.path} 
            className={active ? 'tab-active': 'tab-inactive'} >
            <span className='tab-button'>{item.title}</span>
            {active && <span className='tab-underline'>___</span>}
        </Link>
    )
}

export default NavBarItems;