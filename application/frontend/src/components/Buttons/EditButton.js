import React from 'react'

import styles from './EditButton.module.css'
import { FaEdit } from 'react-icons/fa';

function EditButton(props) {
    let edit = null;
    let buttonStyles = styles.Button;
    if (props.edit)
        edit = <FaEdit />
    if (props.save)
        buttonStyles = [styles.Button, styles.SaveButton].join(' ');
    return (
        <button className={buttonStyles} onClick={props.clicked} style={props.style} >
            {edit}
            {props.children}
        </button>
    )
}

export default EditButton