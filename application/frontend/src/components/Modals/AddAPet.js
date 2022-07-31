import {useEffect, useState} from 'react'

import Modal from './Modal'

import styles from './EditPetDetails.module.css'

import Select from 'react-select';

import makeAnimated from 'react-select/animated';
import axios from 'axios';

//component
import ButtonLoader from '../UI/Spinner/ButtonLoader';

function AddAPet({display,onClose, typeOptions,dogBreedOptions,catBreedOptions,colorOptions,sizeOptions,ageOptions,update}) {

    //States to be set and sent to db
    const [petName,setPetName] = useState('');
    const [petColor, setPetColor] = useState([]);
    const [petSize, setPetSize] = useState();
    const [petAge, setPetAge] = useState();
    const [petType, setPetType] = useState();
    const [dogBreed, setDogBreed] = useState([]);
    const [catBreed, setCatBreed] = useState([]);
    //Loading UI
    const [loading, setLoading] = useState(false);



    function customTheme(theme){
        return {
            ... theme,
            colors:{
                ... theme.colors,
                primary25: '#B3B3B3',
                primary:'#1CB48F',
            }
        }
    }

    function createPetProfile(event){
        event.preventDefault();
        // if(petType.label != 'Cat'){  //make sure Cat or dog breeds are null
        //     setCatBreed([]);
        // }

        // if(petType.label != 'Dog'){
        //     setCatBreed([]);
        // }
        setLoading(true);

        axios.post('/api/create-pet-profile',{
            name: petName,
            type: petType,
            age: petAge,
            color: petColor,
            dogBreed: dogBreed,
            catBreed: catBreed,
            size: petSize
        })
        .then(response =>{
            setLoading(false);
            onClose();
            update()
        })
        .catch(err =>{
            setLoading(false);
            update()
            //display error to user
        })
        // remove later when the setLoading is working in the then block 
        // setLoading(false);
    }

    const animatedComponents = makeAnimated();

    return (
        <Modal display={display} onClose={onClose}>
            <form onSubmit={createPetProfile}>
                <div className={styles['edit-pet-details-header']}>Add a Pet</div>
                <div className={styles['edit-pet-details-container']}>
                    <div className={styles['edit-pet-details-name']}>
                        <label for="name">Name</label>
                        <input 
                            type="text" 
                            id="name" 
                            name="pet_name" 
                            maxLength="25"
                            style={{paddingLeft: '13px'}}
                            required
                            value={petName}
                            // value={props.profile.userName}
                            // onChange={event => props.updateProfile('userName', event.target.value)} 
                            onChange={event => setPetName(event.target.value)}
                            placeholder="Name"
                        />
                    </div>
                    <div className={styles['edit-pet-details-type']}>
                        <label for="type">Type</label>
                        <Select id="type" name="pet_type"
                            // onChange={props.updatePetType}
                            onChange={setPetType}
                            options={typeOptions}
                            theme={customTheme}
                            value={petType}
                            required
                            placeholder="Select Pet Type"
                            isSearchable
                        />
                    </div>
                    

                    <div className={styles['edit-pet-details-color']}>
                        <label for="color">Color(s)</label>
                        <Select id="color" name="pet_color"
                            onChange={setPetColor}
                            options={ colorOptions}
                            theme={customTheme}
                            value={petColor}
                            required
                            placeholder="Select Pet Color(s)"
                            isSearchable
                            isMulti
                        />
                    </div>

                    <div className={styles['edit-pet-details-age']}>
                        <label for="age">Age</label>
                        <Select id="age" name="pet_age"
                            onChange={setPetAge}
                            options={ageOptions}
                            theme={customTheme}
                            value={petAge}
                            required
                            placeholder="Select Pet Age"
                            isSearchable
                        />
                    </div>

                    <div className={styles['edit-pet-details-size']}>
                        <label for="size">Size</label>
                        <Select id="size" name="pet_size"
                            onChange={setPetSize}
                            options={ sizeOptions}
                            theme={customTheme}
                            value={petSize}
                            required
                            placeholder="Select Pet Size"
                            isSearchable
                        />
                    </div>
                    {petType && petType.label == 'Dog' && <div className={styles['edit-pet-details-breed']}>
                        <label for="breed">Breed</label>
                        <Select id="breed" name="pet_breed"
                            // onChange={props.updatePetBreed}
                            onChange={setDogBreed}
                            options={ dogBreedOptions}
                            theme={customTheme}
                            placeholder="Select Dog Breed"
                            isSearchable
                            required
                            isMulti
                            components={animatedComponents}
                        />
                    </div>}
                    {petType && petType.label == 'Cat' && <div className={styles['edit-pet-details-breed']}>
                        <label for="breed">Breed</label>
                        <Select id="breed" name="pet_breed"
                            // onChange={props.updatePetBreed}
                            onChange={setCatBreed}
                            options={ catBreedOptions}
                            theme={customTheme}
                            placeholder="Select Cat Breed"
                            isSearchable
                            required
                            isMulti
                            components={animatedComponents}
                        />
                    </div>}
                    <button className={styles['edit-pet-details-submit']} type='submit'>{loading ? <ButtonLoader/> : 'Submit'}</button>
                </div>
            </form>
        </Modal>
    )
}

export default AddAPet
