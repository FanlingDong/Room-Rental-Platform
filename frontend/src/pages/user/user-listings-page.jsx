import React, {useEffect, useState,} from 'react';
import UserListingCard from '../../components/user/user-listing-card';
import request from '../../tools/request';

function UserListingsPage() {
    const [arr, setArr,] = useState([]);

    useEffect(() => {
        request('GET', undefined, '/listings')
            .then((data) => {
                data.listings.forEach((item) => {
                    request('GET', undefined, `/listings/${item.id}`)
                        .then((dataDetail) => {
                            if (dataDetail.listing.owner !== JSON.parse(localStorage.getItem('airbrb_user')).email && dataDetail.listing.published === true) {
                                dataDetail.listing.id = item.id;
                                arr.push(dataDetail.listing);
                                setArr([...arr,]);
                            }
                        });
                });
            });
        // eslint-disable-next-line
    }, []);

    return (
        <div className="host-listings-page">
            <div className="listings-container">
                {
                    arr.map(room => (
                        <div key={room.id} className="room-item">
                            <UserListingCard data={room}/>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default UserListingsPage;
