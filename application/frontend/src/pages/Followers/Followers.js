import axios from "axios";
import { useEffect, useState } from "react";
import {useParams} from "react-router-dom";
import UserProfileCard from "../../components/UserProfileCard/UserProfileCard";

import Spinner from '../../components/UI/Spinner/Spinner';

// Import Components Here
function Followers() {

  const {profileID} = useParams();

  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);

  const getFollowers = axios.get('/api/followers',{params: {profileID}}) // call to get followers
 
  const getFollowing = axios.get('/api/following',{params: {profileID}}) //call to get followed Users (following)

  // const redirectContext = useContext(RedirectPathContext);

  useEffect(() =>{
    setLoading(true);
    Promise.all([getFollowers, getFollowing])
    .then((responses)=>{
      setFollowers(responses[0].data);
      setFollowing(responses[1].data);
      setLoading(false);
    })
    .catch((err) =>{
      setLoading(false);
    })
  },[profileID])


  return (
    <div>
      {loading ? <Spinner /> : <UserProfileCard followersList={followers} followingList={following}/>}
    </div>
  );
}

export default Followers;
