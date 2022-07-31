import {useState} from "react";
import { NavLink } from "react-router-dom";
import styles from "./Footer.module.css";

import TermsAndConditions from '../../components/Modals/TermsAndConditions'
import PrivacyPolicy from "../Modals/PrivacyPolicy";

function Footer() {
  const [termsAndConditionsDisplay,setTermsAndConditionsDisplay]= useState(false);
  const [privacyPolicyDisplay,setPrivacyPolicyDisplay]= useState(false);

  function openTermsAndConditionsModal(){
    setTermsAndConditionsDisplay(true);
  }

  function closeTermsAndConditionsModal(){
    setTermsAndConditionsDisplay(false);
  }

  function openPrivacyPolicyModal(){
    setPrivacyPolicyDisplay(true);
  }

  function closePrivacyPolicyModal(){
    setPrivacyPolicyDisplay(false);
  }


  return (
    <>
    <div className={styles["footer"]}>
      <div className={styles["our-team-footer"]}>Our Team<br />
        <NavLink className={styles["nav-link"]} to="/Edgar" >Edgar</NavLink>
        <NavLink className={styles["nav-link"]} to="/Daniel" >Daniel</NavLink>
        <NavLink className={styles["nav-link"]} to="/Em" >Em</NavLink>
        <NavLink className={styles["nav-link"]} to="/Sabrina" >Sabrina</NavLink>
        <NavLink className={styles["nav-link"]} to="/Wenjie" >Wenjie</NavLink>
        <NavLink className={styles["nav-link"]} to="/Cameron" > Cameron</NavLink>
        <NavLink className={styles["nav-link"]} to="/Wameedh" > Wameedh</NavLink>
      </div>
      <div className={styles['logos']}>
        <a href="https://www.linkedin.com/"><i className="fa fa-facebook"></i></a>
        <a href="https://www.instagram.com/"><i className="fa fa-instagram"></i></a>
        <a href="https://twitter.com/"><i className="fa fa-twitter"></i></a>
        <a href=""><i className="fa fa-envelope"></i></a>
      </div>
      <div className={styles['terms-conditions']}>
        <button className={styles['terms-button']} onClick={openTermsAndConditionsModal}>Terms of Use</button>
        |
        <button className={styles['policy-button']} onClick={openPrivacyPolicyModal}>Privacy Policy</button>
      </div>
      <div className={styles['icons-8-attribution']}>Icons by <a href="https://icons8.com/">icons8.com</a></div>
    </div>
    {/* Modals */}
    <TermsAndConditions display={termsAndConditionsDisplay} onClose={closeTermsAndConditionsModal}/>
    <PrivacyPolicy display={privacyPolicyDisplay} onClose={closePrivacyPolicyModal}/>
    
    </>
  );
}

export default Footer;