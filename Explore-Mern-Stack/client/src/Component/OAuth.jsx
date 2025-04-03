
import React from 'react';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            // Sign in with Google
            const result = await signInWithPopup(auth, provider);

            console.log("Google login result:", result.user); // Debugging

            // Send data to backend
            const response = await axios.post('http://localhost:3000/api/auth/google', {
                name: result.user.displayName,
                email: result.user.email,
                photo: result.user.photoURL
            },  { withCredentials: true });//this i add

            console.log("Backend Response:", response.data); // Debugging

            if (!response.data.token) {
                console.error("Token not received!");
                
                return;
            }
    
            // ✅ Store token & user properly
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));
    
            dispatch(signInSuccess(response.data));
            navigate('/');

        } catch (error) {
            console.error('Could not sign in with Google:', error.response?.data || error.message);
            alert("Google Sign-in failed. Please try again.");
        }
    };

    return (
        <button 
            onClick={handleGoogleClick} 
            type='button' 
            className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95'
        >
            Continue with Google
        </button>
    );
};

export default OAuth;


