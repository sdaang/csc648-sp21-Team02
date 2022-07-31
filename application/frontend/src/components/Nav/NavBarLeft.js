import React from "react";
import { NavLink } from "react-router-dom";

import LogoPng from '../../images/Created Icons/LogoScript.png';

import styles from './NavBar.module.css'

function NavBarLeft({appUser}) {
  return (
    <span  className={styles["navbar-left"]}>
      {!appUser && <NavLink to="/" activeClassName={styles["current"]}>
        <img className={styles["logo-img"]} src={LogoPng}/>
      </NavLink>
      }
      {appUser && <NavLink to="/Feed" activeClassName={styles["current"]}>
        <img className={styles["logo-img"]} src={LogoPng}/>
      </NavLink>
      }
    </span>
  );
}

export default NavBarLeft;