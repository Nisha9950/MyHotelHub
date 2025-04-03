import { useSelector } from 'react-redux';
import { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
  import axios from 'axios';
import { Link } from 'react-router-dom';
import {
 
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,

} from '../redux/user/userSlice.js';

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };


 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
  
      // Retrieve token from Redux or localStorage
      let token = currentUser?.token || localStorage.getItem("token");
      console.log("Retrieved Token:", token);
  
      if (!token) {
        throw new Error("Authentication token is missing.");
      }
  
      const res = await axios.post(
        `http://localhost:3000/api/user/update/${currentUser._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
             'Authorization': `Bearer ${token}`
            
          },
          credentials:"include",
          withCredentials: true
        }
      );
      console.log("user",res.data.id)
  
      if (res.data.success === false) {
        dispatch(updateUserFailure(res.data.message));
        return;
      }
  
      dispatch(updateUserSuccess(res.data));
      setUpdateSuccess(true);
    } catch (error) {
      console.error("Error updating user:", error.response?.data || error.message);
      dispatch(updateUserFailure(error.response?.data?.message || error.message));
    }
  };
  
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
  
      // Retrieve token from Redux or localStorage
      let token = currentUser?.token || localStorage.getItem("token");
  
      if (!token) {
        throw new Error("Authentication token is missing.");
      }
  
      const res = await axios.delete(
      `  http://localhost:3000/api/user/delete/${currentUser._id}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,  // 🔹 JWT Token Send
            "Content-Type": "application/json"
          },
          withCredentials: true
        }
      );
  
      if (res.data.success === false) {
        dispatch(deleteUserFailure(res.data.message));
        return;
      }
  
      dispatch(deleteUserSuccess(res.data));
    } catch (error) {
      dispatch(deleteUserFailure(error.response?.data?.message || error.message));
    }
  };

  
  
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const { data } = await axios.get('http://localhost:3000/api/auth/signout');
      
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.response?.data?.message || "Something went wrong"));
    }
  };





  const handleShowListings = async () => {
    try {
      setShowListingsError(false); // Reset error state
  
      const token = currentUser?.token || localStorage.getItem("token"); // Get token
  
      if (!token) {
        console.error("No authentication token found");
        setShowListingsError(true);
        return;
      }
  
      const res = await axios.get(`http://localhost:3000/api/listing/user/${currentUser._id}`, {
        headers: {
          Authorization:` Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!res.data || res.data.success === false) {
        throw new Error(res.data.message || "Failed to fetch listings");
      }
  
      setUserListings(res.data.listings); // Set user listings in state
      console.log("User listings:", res.data.listings);
    } catch (error) {
      console.error("Error fetching listings:", error.response?.data || error.message);
      setShowListingsError(true); // Set error state
    }
  };


  const handleListingDelete = async (listingId) => {
    try {
      const token = currentUser?.token || localStorage.getItem("token");
  
      if (!token) {
        console.error("No authentication token found");
        return;
      }
  
      const res = await fetch(`http://localhost:3000/api/listing/delete/${listingId}`, {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
  
      const data = await res.json();
  
      if (data.success === false) {
        console.log(data.message);
        return;
      }
  
      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
    } catch (error) {
      console.log("Error deleting listing:", error.message);
    }
  };
  

  

  

  
  



  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='file'
          ref={fileRef}
          hidden
          accept='image/*'
        />
       <img
  onClick={() => fileRef.current.click()}
  src={formData.avatar || currentUser?.avatar || "/default-avatar.png"}
  alt='profile'
  className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
/>
        <input
          type='text'
          placeholder='username'
          defaultValue={currentUser.username}
          id='username'
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />
        <input
          type='email'
          placeholder='email'
          id='email'
          defaultValue={currentUser.email}
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />
        <input
          type='password'
          placeholder='password'
          onChange={handleChange}
          id='password'
          className='border p-3 rounded-lg'
        />
        <button
          disabled={loading}
          className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Update'}
        </button>
        <Link
          className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'
          to={'/create-listing'}
        >
          Create Listing
        </Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span
           onClick={handleDeleteUser}
          className='text-red-700 cursor-pointer'
        >
          Delete account
        </span>
        <span  onClick={handleSignOut} className='text-red-700 cursor-pointer'>
          Sign out
        </span>
      </div>
      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5'>
        {updateSuccess ? 'User is updated successfully!' : ''}
      </p>
      <button onClick={handleShowListings} className='text-green-700 w-full'>
        Show Listings
      </button>
      <p className='text-red-700 mt-5'>
        {showListingsError ? 'Error showing listings' : ''}
      </p>


      
      {userListings && userListings.length > 0 && (
        <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl font-semibold'>
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className='border rounded-lg p-3 flex justify-between items-center gap-4'
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt='listing cover'
                  className='h-16 w-16 object-contain'
                />
              </Link>
              <Link
                className='text-slate-700 font-semibold  hover:underline truncate flex-1'
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className='flex flex-col item-center'>
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className='text-red-700 uppercase'
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className='text-green-700 uppercase'>Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}





    </div>
  );
}