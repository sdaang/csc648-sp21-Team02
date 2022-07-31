import React, { useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import styles from './HeroContainer.module.css';

//Import components
import CallToActionButton from '../Buttons/CallToActionButton'

//Import Images
import DogOwnerImage from '../../images/Third Party Images/undraw_Modern_woman_lxh7.svg'
import CatOwnerImage from '../../images/Third Party Images/undraw_chilling_8tii 1.svg'

function HeroContainer() {

  const history = useHistory();

  const [text, setText] = useState('Find a Friend');


  function onMouseover(e) {
    setText('Coming Soon');
  }

  function onMouseout(e) {
    setText('Find a Friend');
  }


  function searchLocalPets(){
    navigator.geolocation.getCurrentPosition((position)=>{
      const location = {
        pathname:'/MapSearch',
        state: {lat:position.coords.latitude, lng:position.coords.longitude, searchTerm: "", searchCategoryParam: "Pets"}
      }
      history.push(location);
    })
  }

  return (
    <div className={styles['hero-container']}>
      
      <div className={styles['right-side']}>

        <div className={styles['right-side-text']}>The Social Network for your furry (or not so furry) friends</div>
        <div className={styles['right-side-subtext']}>Sign Up or Search for a Friend to Get Started</div>
        <div className={styles['button-container']}>
          <NavLink to="/account-type">
            <button className={styles['signup-button']}><span><h3>Sign Up</h3></span></button>
          </NavLink>
          <button className={styles['find-friend-button']} onClick={searchLocalPets}>
             Find a Friend
          </button>
        </div>
      </div>

      <div className={styles['left-side']}>
        <img className={styles['left-side-dog']} src={DogOwnerImage} />
      </div>

    </div>
  );
}

export default HeroContainer;