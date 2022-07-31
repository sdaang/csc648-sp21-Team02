import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'

import ImageContainer from './ImageContainer/ImageContainer';
import Reviews from './Reviews/Reviews';
import WriteAReview from '../Modals/WriteAReview';

import styles from './ProfileContent.module.css';
import axios from 'axios';

function ProfileContent({photoPosts, pets, profile, isSelfView, updateProfile, taggedPosts}) {
    const [writeAReviewDisplay, setWriteAReviewDisplay] = useState(false);
    const [text, setText] = useState('See All');

    let imageContainer = null;
    switch(profile.type) {
        case 'Shelter':
            imageContainer = (
                <div className={styles.ImageContainerShelter} >
                    <ImageContainer title='Photos' previews={photoPosts} selfView={isSelfView} type={profile.type} profile={profile} />
                    <ImageContainer title='Pets' previews={pets} type={profile.type} profile={profile} />
                </div>
            )
            break;
        case 'Business':
            imageContainer = (
                <div className={styles.ImageContainerBusiness} >
                    <ImageContainer title='Photos' selfView={isSelfView} previews={photoPosts} type={profile.type} profile={profile} />
                </div>
            )
            break;
        case 'Admin':
        case 'PetOwner':
            imageContainer = (
                <div className={styles.ImageContainerTwoRows} >
                    <ImageContainer title='My Photos' previews={photoPosts} selfView={isSelfView} image={profile.photos} type={profile.type} profile={profile} />
                    <ImageContainer title='Pets' previews={pets} type={profile.type} profile={profile} />
                </div>
            )
            break;
        case 'Pet':
            imageContainer = (
                <div className={styles.ImageContainerTwoRows} >
                    <ImageContainer title='My Photos' previews={taggedPosts} selfView={isSelfView} type={profile.type} profile={profile} />
                    <ImageContainer title='My Siblings' previews={pets} type={profile.type} profile={profile}/>
                </div>
            )
            break;
        default:
            imageContainer = null;
    }

    let displayReview = null;
    
    return (
        <div className={styles.ProfileContent} >
            {imageContainer}
            
        </div>
    );
}

export default ProfileContent;