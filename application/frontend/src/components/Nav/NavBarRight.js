import axios from "axios";
import {useRef, useEffect, useState} from "react";
import {NavLink, useHistory} from "react-router-dom";
import DropdownArrow from '../../images/Created Icons/Arrow.svg';

import useWindowDimensions from '../ProfileContent/ImageContainer/useWindowDimensions';

import styles from './NavBar.module.css'


//used to detect if there was a click outside the account menu to close it
let useClickOutside = (handler) =>{
  let domNode = useRef();

  useEffect(() =>{
    let maybeHandler = (event)=>{
      if(domNode){
        if(domNode.current && !domNode.current.contains(event.target)){
          handler();
        }
      }
    }
  
    document.addEventListener("mousedown", maybeHandler);
  
    return () => {
      document.removeEventListener("mousedown", maybeHandler);
    }
  })

  return domNode
}

function NavBarRight({appUser, updateLoginState}) {
  const history = useHistory();

  const [accountMenuDisplay, setAccountMenuDisplay] = useState({display: 'none'});
  const { width } = useWindowDimensions();

  function logoutHandler(){
    axios.post("/api/logout", {withCredentials: true}).then((response) =>{
      updateLoginState(response.data.loggedIn,response.data.user);
      history.push('/');
    })
    .catch((err) =>{
      console.log(err);
    });

  }

  function accountMenuToggle(){
    if(accountMenuDisplay =={display:'block'}){
      setAccountMenuDisplay({display: 'none'});
    }
    else{
      setAccountMenuDisplay({display: 'block'});
    }
    
  }

  // useEffect(() =>{
  //   console.log('AppUser in NavbarRight changed to: ', appUser)
  // },[appUser])

  let domNode = useClickOutside(()=>{
    setAccountMenuDisplay({display: 'none'})
  })

  return (
        <>
        {!appUser && <button className={styles["login-link"]} onClick={()=>history.push("/login-page")}>Login</button>}
        {appUser && <NavLink to="/Messages" className={styles["messages-menu"]}>Messages</NavLink>}
        {appUser &&<span ref={domNode} className="account-menu-dropdown">
          <button className={styles["account-menu-dropdown-button"]} onClick={accountMenuToggle}>Account<img className={styles["account-menu-dropdown-arrow"]} src={DropdownArrow}/></button>
          <ul  className={styles["account-menu-dropdown-content"]} style={ accountMenuDisplay}>
            <li>
              <NavLink className={styles["account-menu-dropdown-link"]} to={`/Profile/${appUser.profileID}`}>My Profile</NavLink>
            </li>
            <li><NavLink className={styles["account-menu-dropdown-link"]} to="/MyPets">My Pets</NavLink></li>
            <li>{(width < 770) && <NavLink className={styles["account-menu-dropdown-link"]} to="/Messages" >Messages</NavLink>}</li>
            <li><NavLink className={styles["account-menu-dropdown-link"]} to="/" onClick={logoutHandler}>Logout</NavLink></li>
          </ul>
        </span>}
        </>
  );
}


export default NavBarRight;