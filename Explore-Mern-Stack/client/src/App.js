import {BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import SignIn from './Pages/SignIn';
import SignUp from './Pages/SignUp';
import About from './Pages/About';
import Profile from './Pages/Profile';
import Header from './Component/Header';
import PrivateRoute from './Component/PrivateRoute';
import CreateListing from './Pages/CreateListing';
import ListingDetails from './Pages/ListingDetails';
import UpdateListing from './Pages/UpdateListing';
import Listing from './Pages/Listing';
import Search from './Pages/Search';


const App = () => {
  return (
    <BrowserRouter>
    <Header/>
    <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/sign-in" element={<SignIn/>}/>
        <Route path="/sign-up" element={<SignUp/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/search" element={<Search/>}/>

        <Route path="/listing/:listingId" element={<Listing/>}/>
        <Route element = {<PrivateRoute/>}>
             <Route path="/profile" element={<Profile/>}/>
             <Route path="/create-listing" element={<CreateListing/>}/>
             <Route path='/listing/:id' element={<ListingDetails />} />
             <Route path="/update-listing/:listingId" element={<UpdateListing/>}/>
        </Route>

    </Routes>
    </BrowserRouter>
 
  )
}

export default App
