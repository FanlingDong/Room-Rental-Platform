import React from 'react';
import {Routes, Route,} from 'react-router-dom';
import './App.css';
import Homepage from './pages/homepage/homepage';
import UserPage from './pages/my-airbrb/user-page';
import HostPage from './pages/my-airbrb/host-page';
import CreateListing from "./pages/host/create-listing";
import ListingDetailPage from "./pages/host/host-listing-details";
import EditListingPage from "./pages/host/edit-listing";
import UserListingDetailPage from "./pages/user/user-listing-details";

function App() {
    return (
        <div className="App">
            <main className="App-body">
                <Routes>
                    <Route path="/" element={<Homepage/>}/>
                    <Route path="/user" element={<UserPage/>}/>
                    <Route path="/host" element={<HostPage/>}/>
                    <Route path="/host/create-list" element={<CreateListing/>}/>
                    <Route path="/host/details/:listingId" element={<ListingDetailPage/>}/>
                    <Route path="/host/edit/:listingId" element={<EditListingPage/>}/>
                    <Route path="/user/details/:listingId" element={<UserListingDetailPage/>}/>
                </Routes>
            </main>
        </div>
    );
}

export default App;
