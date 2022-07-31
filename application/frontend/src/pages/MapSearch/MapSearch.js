import {useRef,useCallback, useEffect, useState} from 'react'

import {Link,useLocation,useHistory} from "react-router-dom"

import Axios from "axios";

import styles from './MapSearch.module.css'

import DropdownIcon from '../../images/Created Icons/Dropdown.svg'

import Marker1  from '../../images/Third Party Icons/marker1.png'
import Marker2  from '../../images/Third Party Icons/marker2.png'
import Marker3  from '../../images/Third Party Icons/marker3.png'
import Marker4  from '../../images/Third Party Icons/marker4.png'
import Marker5  from '../../images/Third Party Icons/marker5.png'
import Marker6  from '../../images/Third Party Icons/marker6.png'
import Marker7  from '../../images/Third Party Icons/marker7.png'
import Marker8  from '../../images/Third Party Icons/marker8.png'
import Marker9  from '../../images/Third Party Icons/marker9.png'
import Marker10 from '../../images/Third Party Icons/marker10.png'

import Select from 'react-select';

import makeAnimated from 'react-select/animated';

import {GoogleMap, useLoadScript, Marker, InfoWindow} from '@react-google-maps/api';
import Spinner from '../../components/UI/Spinner/Spinner';

const mapContainerStyle = {
    width: '100%',
    height: 'calc(100vh - 100px)',
};

const options = {
    disableDefaultUI: true,
    // zoomControl: false,
}

let typeOptions = [];
let businessCategoryOptions = [];
let ageOptions = [];
let dogBreedOptions = [];
let catBreedOptions = [];
let colorOptions = [];
let sizeOptions = [];
let markerColors = []
let markerBaseUrl = "../../images/Third\ Party\ Icons/marker"

const distanceOptions = [
    {value: 1, label:'Walking Distance (1 Mile)'},
    {value: 2, label: 'Biking Distance (2 Miles)'},
    {value: 5, label: 'Driving Distance (5 Miles)'}
];

function MapSearch(props) {
    let state = props.location.state;

    //For storing filter states
    const [businessCategoryFilters,setBusinessCategoryFilters] = useState([]);
    const [petTypeFilters,setPetTypeFilters] = useState([]);
    const [dogBreedFilters, setDogBreedFilters] = useState([]);
    const [catBreedFilters, setCatBreedFilters] = useState([]);
    const [petColorFilters, setPetColorFilters] = useState([]);
    const [petSizeFilters, setPetSizeFilters] = useState([]);
    const [petAgeFilters, setPetAgeFilters] = useState([]);
    const [shelterPetTypeFilters, setShelterPetTypeFilters] = useState([]);


    
    const location = useLocation();
    let history = useHistory();

    const panTo = useCallback(({lat,lng}) =>{
        mapRef.current.panTo({lat,lng});
        mapRef.current.setZoom(18);
    },[]);
    
    const mapRef = useRef(); //retain state without causing re-renders
    const onMapLoad = useCallback((map) =>{
        mapRef.current = map;
    }, []);

    //Recieve search params from searchbar.js




    if(typeof(state) =='undefined'){
        state = {lat: 0, lng: 0}
        history.push('/');
    }

    //For storing searchOptions
    const[searchCategory, setSearchCategory] = useState();
    const[searchTerm, setSearchTerm] = useState();
    const[resultsSortOption, setResultsSortOption] = useState('');
    const [searchDistance, setSearchDistance] = useState({value: 5, label: 'Driving Distance (5 Miles)'});

    //For storing Map attributes
    
    //For Storing Search Results
    const[recievedSearchResults, setRecievedSearchResults] = useState([]);

    //For Storing Current Page
    const [currentPage, setCurrentPage] = useState(1);


    //for storing whether filter tab is displaying
    const [filterOverlayDisplay, setFilterOverlayDisplay] = useState('none');
    const [searchResultsDisplay, setSearchResultsDisplay] = useState('block')

    //for storing the number of pages of results
    const [maxResultsPages,setMaxResultsPages] = useState(1);


    //store ref to searchResultsContainer to show modified layout for petOwners
    const searchResultsContainerRef = useRef();

    const [loading, setLoading] = useState(true);




    //Check if state matches any dropdown options within the searchCategory to populate filter automatically
    
    //for storing map location
    const center = {lat: state.lat, lng: state.lng};

    useEffect(() => {  //run once when page loads/refresh
        const getPetTypes = Axios.get('/api/pet-types')   //get business types from database
        const getBusinessTypes = Axios.get('/api/business-types')   //get business types from database
        const getDogBreeds = Axios.get('/api/dog-breeds')   //get business types from database
        const getCatBreeds = Axios.get('/api/cat-breeds')   //get business types from database
        const getAges = Axios.get('/api/ages')   //get business types from database
        const getSizes = Axios.get('/api/sizes')   //get business types from database
        const getColors = Axios.get('/api/colors')   //get business types from database
        

        Promise.all([getPetTypes,getBusinessTypes,getDogBreeds,getCatBreeds,getAges,getSizes,getColors])
        .then((responses) =>{
            typeOptions =  responses[0].data;
            businessCategoryOptions = responses[1].data;
            dogBreedOptions = responses[2].data;
            catBreedOptions = responses[3].data;
            ageOptions = responses[4].data;
            sizeOptions = responses[5].data;
            colorOptions = responses[6].data;
        })
        .catch((err) =>{
            console.log(err);
        })
    }, [])



function search(){
        setLoading(true)
        // const searchResultsContainerNode = searchResultsContainerRef.current
        // if(state.searchCategoryParam === 'Pet Owners'){ //change to pet owner results layout
        //     if(searchResultsContainerNode){
        //         searchResultsContainerNode.classList.remove(styles['map-search-results-container'])
        //         searchResultsContainerNode.classList.add(styles['map-search-results-container-petOwners'])
        //     }
        // }
        // else{
        //     if(searchResultsContainerNode){
        //         searchResultsContainerNode.classList.remove(styles['map-search-results-container-petOwners'])
        //         searchResultsContainerNode.classList.add(styles['map-search-results-container'])
        //     }
        // }

        
        
        if(state.searchTermParam || state.searchCategoryParam || state.prefilter){

            setSearchCategory(state.searchCategoryParam);
            setSearchTerm(state.searchTermParam);

            let searchParams = {};
            let typePrefilter = {};
            let dogBreedPrefilter = {};
            let catBreedPrefilter = {};
            let businessCategoryPrefilter = {};

            if(searchCategory === 'Pets'){
                if(typeOptions.some(petType => petType.label === state.prefilter.label)){
                    typePrefilter = state.prefilter
                }
                else if(dogBreedOptions.some(dogBreed => dogBreed.label === state.prefilter.label)){
                    dogBreedPrefilter = state.prefilter
                }
                else if(catBreedOptions.some(catBreed => catBreed.label === state.prefilter.label)){
                    catBreedPrefilter = state.prefilter
                }
            }
            else if(searchCategory === 'Businesses'){
                businessCategoryPrefilter = state.prefilter
            }
            else if(searchCategory === 'Shelters'){
                typePrefilter = state.prefilter
            }


            switch(state.searchCategoryParam){
                case 'Businesses':
                    let businessCategoryFilterValues = [];

                    if (Object.keys(businessCategoryPrefilter).length !== 0){
                        businessCategoryFilterValues.push(businessCategoryPrefilter.value)
                    }

                    for(let i = 0; i < businessCategoryFilters.length; i++){
                        businessCategoryFilterValues.push(businessCategoryFilters[i].value);
                    }

                    searchParams = {
                        searchTerm: state.searchTermParam,
                        searchCategory:state.searchCategoryParam,
                        searchLatitude: state.lat,
                        searchLongitude: state.lng,
                        searchDistance: searchDistance.value,
                        searchPage: currentPage,
                        searchBizCategories : businessCategoryFilterValues
                    }
                    break
                case 'Shelters':
                    let shelterTypeFilterValues = [];

                    if (Object.keys(typePrefilter).length !== 0){
                        shelterTypeFilterValues.push(typePrefilter.value)
                    }                        
                    for(let i = 0; i < shelterPetTypeFilters.length; i++){
                        shelterTypeFilterValues.push(shelterPetTypeFilters[i].value);
                    }

                    
                    searchParams = {
                        searchTerm: state.searchTermParam,
                        searchCategory:state.searchCategoryParam,
                        searchLatitude: state.lat,
                        searchLongitude: state.lng,
                        searchDistance: searchDistance.value,
                        searchPage: currentPage,
                        searchPetTypes : shelterTypeFilterValues
                    }
                    break;
                case 'Pets':
                    let petTypeFilterValues = [];
                    let petColorFilterValues = [];
                    let petSizeFilterValues = [];
                    let petAgeFilterValues = [];
                    let dogBreedFilterValues = [];
                    let catBreedFilterValues = [];

                    if (Object.keys(typePrefilter).length !== 0){
                        petTypeFilterValues.push(typePrefilter.value)
                    }

                    for(let i = 0; i < petTypeFilters.length; i++){
                        petTypeFilterValues.push(petTypeFilters[i].value);
                    }

                    for(let i = 0; i < petColorFilters.length; i++){
                        petColorFilterValues.push(petColorFilters[i].value);
                    }
                    for(let i = 0; i < petSizeFilters.length; i++){
                        petSizeFilterValues.push(petSizeFilters[i].value);
                    }
                    for(let i = 0; i < petAgeFilters.length; i++){
                        petAgeFilterValues.push(petAgeFilters[i].value);
                    }

                    if (Object.keys(dogBreedPrefilter).length !== 0){
                        dogBreedFilterValues.push(dogBreedPrefilter.value)
                    }

                    for(let i = 0; i < dogBreedFilters.length; i++){
                        dogBreedFilterValues.push(dogBreedFilters[i].value);
                    }

                    if (Object.keys(catBreedPrefilter).length !== 0){
                        catBreedFilterValues.push(catBreedPrefilter.value)
                    }

                    for(let i = 0; i < catBreedFilters.length; i++){
                        catBreedFilterValues.push(catBreedFilters[i].value);
                    }
                        


                    if(petTypeFilters.length > 0 && !petTypeFilters.some(petType => petType.label == "Cat")){
                        catBreedFilterValues = [];
                    }
        
                    if(petTypeFilters.length > 0 && !petTypeFilters.some(petType => petType.label == "Dog")){
                        dogBreedFilterValues = [];
                    }

                    searchParams = {
                        searchTerm: state.searchTermParam,
                        searchCategory:state.searchCategoryParam,
                        searchLatitude: state.lat,
                        searchLongitude: state.lng,
                        searchDistance: searchDistance.value,
                        searchPage: currentPage,
                        searchPetTypes: petTypeFilterValues,
                        searchPetColors: petColorFilterValues,
                        searchPetSizes: petSizeFilterValues,
                        searchPetAges: petAgeFilterValues,
                        searchDogBreeds: dogBreedFilterValues,
                        searchCatBreeds: catBreedFilterValues
                    }
                    break;
                case 'Pet Owners':
                    searchParams = {
                        searchTerm: state.searchTermParam,
                        searchCategory:state.searchCategoryParam,
                        searchLatitude: state.lat,
                        searchLongitude: state.lng,
                        searchDistance: searchDistance.value,
                        searchPage: currentPage
                    }
                    break;
                
            }



            Axios.get('/api/search', {params: searchParams})
            .then(response =>{
                if(response.data.length !== 0){
                    setMaxResultsPages(Math.ceil(response.data[0].results_count/10))
                }
                
                setRecievedSearchResults(response.data);
                displaySearchResults();

                setLoading(false);
                // setOverlayDisplay(true);
            })
            .catch(err =>{
                console.log(err);
            })
        }
    }

    useEffect(()=>{
        search();
    },[state, currentPage]);  //only fetch results when search params or filters or page changes


    //toggle display of filter overlay
    function displayFilterOverlay(){
        setFilterOverlayDisplay('flex');
        setSearchResultsDisplay('none');
    }

    function displaySearchResults(){
        setFilterOverlayDisplay('none');
        setSearchResultsDisplay('block');
    }

    function applyFilters(){
        setCurrentPage(1);
        search();
    }

    function nextPage(){
        setCurrentPage(prevCurrentPage => prevCurrentPage + 1);
        // search();
    }

    function previousPage(){
        if(currentPage > 1){
            setCurrentPage(prevCurrentPage => prevCurrentPage - 1);
            // search();
        }
        else{
        }
    }

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

    const animatedComponents = makeAnimated();


    


    return (
            <>
            <div ref={searchResultsContainerRef} className={styles['map-search-results-container']}>
                <div className={styles['map-search-results-map']}>
                    {state.lat && state.lng && <GoogleMap 
                        mapContainerStyle={mapContainerStyle}
                        zoom={14}
                        center={center}
                        options={options}
                        onLoad={onMapLoad}
                        >
                        {recievedSearchResults && recievedSearchResults.map((searchResult, index) => (  //need to change index to something else later
                            <>
                             {/* <Marker position={{lat: state.lat, lng: state.lng}}/> */}
                            <Marker 
                                key={index}
                                position={{lat: parseFloat(searchResult.latitude), lng: parseFloat(searchResult.longitude)}}
                                icon= {{
                                        url: (`https://csc648groupproject.s3-us-west-2.amazonaws.com/marker${index+1}.png`)
                                    }
                                }
                            />
                            </>
                        ))}
{/* 
                        {!recievedSearchResults &&
                            // <Marker position={{lat: state.lat, lng: state.lng}}/>
                        } */}

                    </GoogleMap>}
                    {!state.lat && !state.lng && <div className={styles['map-coming-soon']}>Location Results Feature Coming Soon</div>}
                </div>
                {loading && <Spinner className={styles['map-search-results-loading']}/>}
                { !loading &&
                     <div className={styles['map-search-results-text']} style={{display: searchResultsDisplay}}>
                     <>
                         <div className={styles['map-search-header']}>
                             <span><span className={styles['map-search-header-text']}>Results</span><button className={styles['map-search-results-header-action']} onClick={displayFilterOverlay}>Filter</button></span>
                             <div className={styles['sort-dropdown']}>
                                 {/* <span className={styles['sort-dropdown-label']}>Sort By:</span> */}
                                 <select className={styles['sort-dropdown-select']}  name="search-category" id="search-category" onChange= {e => setResultsSortOption(e.target.value)}>
                                     <option value="Account Age">Newly Added</option>
                                     <option value="Distance">Distance</option>
                                 </select>
                                 <img src={DropdownIcon}/>
                             </div>                
                         </div>
                         <div className={styles['map-search-results-text-list']}>
                             <ul>
                                 {recievedSearchResults.length == 0 && <li className={styles['no-results']}>No {searchCategory} that Match your Search.</li>}
                                 {recievedSearchResults.length != 0 && searchCategory == 'Pets' && recievedSearchResults.map((searchResult,index) => (
                                     <PetSearchResult searchResult={searchResult} index={index} panTo={panTo}/>
                                 ))}
                                 {recievedSearchResults.length != 0 && searchCategory == 'Businesses' && recievedSearchResults.map((searchResult, index) => (
                                    <BusinessSearchResult searchResult={searchResult} index={index} panTo={panTo}/>
                                 ))}
                                 {recievedSearchResults.length != 0 && searchCategory == 'Shelters' && recievedSearchResults.map((searchResult, index) => (
                                     <ShelterSearchResult searchResult={searchResult} index={index} panTo={panTo}/>
                                 ))}
                                 {recievedSearchResults.length != 0 && searchCategory == 'Pet Owners' && recievedSearchResults.map((searchResult, index) => (
                                     <PetOwnerSearchResult searchResult={searchResult} index={index}/>
                                 ))}
 
                             </ul>
                         </div>
                         <div className={styles['map-search-results-page-navigation']}>
                             {currentPage != 1 && maxResultsPages != 1 && <button className={styles['map-search-results-page-navigation-back']} onClick={previousPage}>Prev Page</button>}
                             {currentPage < maxResultsPages && <button className={styles['map-search-results-page-navigation-next']} onClick={nextPage}>Next Page</button>}
                         </div>
                     </>
                    </div>
                }
               
                <div className={styles["map-search-results-filter"]} style={{display: filterOverlayDisplay}}>
                    <>
                        <div className={styles['map-search-header']}>
                        <span><span className={styles['map-search-header-text']}>Filters</span><button className={styles['map-search-results-header-action']} onClick={displaySearchResults}>Back to Results</button></span>
                        </div>
                        {searchCategory=="Businesses" && 
                        <>
                            <div className={styles['filter-business-categories']}>
                                <label for="business-categories">Categories</label>
                                    <Select id="business-categories" name="business_categories"
                                        onChange={setBusinessCategoryFilters}
                                        options={businessCategoryOptions}
                                        placeholder="Select Business Categories"
                                        theme={customTheme}
                                        isSearchable
                                        isMulti
                                        components={animatedComponents}
                                    />
                            </div>
                            <div className={styles['filter-distance']}>
                                <label for="distance">Distance</label>
                                    <Select id="distance" name="distance"
                                        onChange={setSearchDistance}
                                        options={distanceOptions}
                                        placeholder="Select Preferred Distance"
                                        theme={customTheme}
                                        isSearchable
                                        components={animatedComponents}
                                    />
                            </div>
                        </>
                        }
                        {searchCategory=="Pets" &&
                        <>
                            <div className={styles['filter-pet-types']}>
                            <label for="pet-types">Types</label>
                                <Select id="pet-types" name="pet_types"
                                    onChange={setPetTypeFilters}
                                    options={typeOptions}
                                    placeholder="Select Pet Type(s)"
                                    theme={customTheme}
                                    isSearchable
                                    isMulti
                                    components={animatedComponents}
                                />
                            </div>
                            <div className={styles['filter-pet-size']}>
                                <label for="pet-sizes">Sizes</label>
                                    <Select id="pet-sizes" name="pet_sizes"
                                        onChange={setPetSizeFilters}
                                        options={sizeOptions}
                                        placeholder="Select Pet Size(s)"
                                        theme={customTheme}
                                        isSearchable
                                        isMulti
                                        components={animatedComponents}
                                    />
                            </div>
                            <div className={styles['filter-pet-colors']}>
                                <label for="pet-colors">Colors</label>
                                    <Select id="pet-colors" name="pet_colors"
                                        onChange={setPetColorFilters}
                                        options={colorOptions}
                                        placeholder="Select Pet Color(s)"
                                        theme={customTheme}
                                        isSearchable
                                        isMulti
                                        components={animatedComponents}
                                    />
                            </div>
                            <div className={styles['filter-pet-age']}>
                                <label for="pet-age">Age</label>
                                    <Select id="pet-age" name="pet_age"
                                        onChange={setPetAgeFilters}
                                        options={ageOptions}
                                        placeholder="Select Pet Age(s)"
                                        theme={customTheme}
                                        isSearchable
                                        isMulti
                                        components={animatedComponents}
                                    />
                            </div>
                            {petTypeFilters.length > 0 && petTypeFilters.some(petType => petType.label == "Dog") && <div className={styles['filter-pet-breed']}>
                                <label for="dog-breed">Dog Breeds</label>
                                    <Select id="dog-breed" name="dog_breed"
                                        onChange={setDogBreedFilters}
                                        options={dogBreedOptions}
                                        placeholder="Select Dog Breed(s)"
                                        theme={customTheme}
                                        isSearchable
                                        isMulti
                                        components={animatedComponents}
                                    />
                            </div>}

                            {petTypeFilters.length > 0 && petTypeFilters.some(petType => petType.label == "Cat") &&<div className={styles['filter-pet-breed']}>
                                <label for="cat-breed">Cat Breeds</label>
                                    <Select id="cat-breed" name="cat_breed"
                                        onChange={setCatBreedFilters}
                                        options={catBreedOptions}
                                        placeholder="Select Cat Breed(s)"
                                        theme={customTheme}
                                        isSearchable
                                        isMulti
                                        components={animatedComponents}
                                    />
                            </div>}
                        </>
                        }
                        {searchCategory=="Shelters" &&
                            <>
                                <div className={styles['filter-shelter-pets']}>
                                    <label for="shelter-pet-types">Available Types of Pets</label>
                                        <Select id="shelter-pet-types" name="shelter_pet_types"
                                            onChange={setShelterPetTypeFilters}
                                            options={typeOptions}
                                            placeholder="Select Types of Pets"
                                            theme={customTheme}
                                            isSearchable
                                            isMulti
                                            components={animatedComponents}
                                        />
                                </div>
                                <div className={styles['filter-distance']}>
                                    <label for="distance">Distance</label>
                                        <Select id="distance" name="distance"
                                            onChange={setSearchDistance}
                                            options={distanceOptions}
                                            placeholder="Select Preferred Distance"
                                            theme={customTheme}
                                            isSearchable
                                            components={animatedComponents}
                                        />
                                </div>
                            </>
                        }
                        <button className={styles['filter-button']} onClick={applyFilters}>Apply Filters</button>
                    </>
                </div>
            </div>
            </>     
    );
}

function BusinessSearchResult({searchResult,panTo, index}){
    return (
        <li className={styles['search-result']} key={searchResult.reg_business_id}>
            <img className={styles['search-result-pic']} src={searchResult.profile_pic_link}/>
            <Link className={styles['profile-link']} to={"/Profile/" + searchResult.profile_id}>
                <div className={styles['search-result-name-address']}>
                    <div className={styles['search-result-name']}>{searchResult.name}</div>
                    <div className={styles['search-result-address']}>{searchResult.address}</div>
                </div>
            </Link>
            <img className={styles['search-result-marker']} src={`https://csc648groupproject.s3-us-west-2.amazonaws.com/marker${index+1}.png`} onClick={() => {panTo({lat: parseFloat(searchResult.latitude), lng:parseFloat(searchResult.longitude)})}}/>
        </li>
    )
}

function ShelterSearchResult({searchResult,panTo, index}){
    return (
        <li className={styles['search-result']} key={searchResult.reg_shelter_id} >
            <img className={styles['search-result-pic']} src={searchResult.profile_pic_link}/>
            <Link className={styles['profile-link']} to={"/Profile/" + searchResult.profile_id}>
                <div className={styles['search-result-name-address']}>
                    <div className={styles['search-result-name']}>{searchResult.name}</div>
                    <div className={styles['search-result-address']}>{searchResult.address}</div>
                </div>
            </Link>
            <img className={styles['search-result-marker']} src={`https://csc648groupproject.s3-us-west-2.amazonaws.com/marker${index+1}.png`} onClick={() => {panTo({lat: parseFloat(searchResult.latitude), lng:parseFloat(searchResult.longitude)})}}/>
        </li>
    )

}

function PetSearchResult({searchResult, panTo, index}){
    return (
        <li className={styles['search-result']} key={searchResult.pet_id} onClick={() => {panTo({lat: parseFloat(searchResult.latitude), lng:parseFloat(searchResult.longitude)})}}>
            <img className={styles['search-result-pic']} src={searchResult.profile_pic_link}/>
            <Link className={styles['profile-link']} to={"/Profile/" + searchResult.profile_id}>
                <div className={styles['search-result-name-address']}>
                    <div className={styles['search-result-name']}>{searchResult.name}</div>
                    <div className={styles['search-result-address']}>{searchResult.address}</div>
                </div>
            </Link>
            <img className={styles['search-result-marker']} src={`https://csc648groupproject.s3-us-west-2.amazonaws.com/marker${index+1}.png`} onClick={() => {panTo({lat: parseFloat(searchResult.latitude), lng:parseFloat(searchResult.longitude)})}}/>
            
        </li>
    )
}

function PetOwnerSearchResult({searchResult}){
    return (
        <li className={styles['search-result']} key={searchResult.reg_user_id}>
            <img className={styles['search-result-pic']} src={searchResult.profile_pic_link}/>
            <Link className={styles['profile-link']} to={"/Profile/" + searchResult.profile_id}>
                <span className={styles['search-result-name']}>{searchResult.display_name}</span>
            </Link>
        </li>
    )
}

export default MapSearch;
