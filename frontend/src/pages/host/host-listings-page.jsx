import React, {useEffect, useMemo, useState,} from 'react';
import {Link,} from 'react-router-dom';
import {Button,} from 'antd';
import HostListingCard from '../../components/host/host-listing-card';
import request from '../../tools/request';
import './host-listings-page.css';

function HostListings() {
    const [list, setList,] = useState([]);

    useEffect(() => {
        request('GET', undefined, '/listings')
            .then(data => {
                if (data?.listings) {
                    setList(data.listings);
                }
            });
    }, []);

    const renderList = useMemo(() => {
        return list.filter((room) => room.owner === JSON.parse(localStorage.getItem('airbrb_user')).email);
    }, [list,]);

    return (
        <div className="host-listings-page">
            <Link to="/host/create-list">
                <Button type="primary" style={{marginLeft: 20,}}> + Create Listing</Button>
            </Link>
            <div className="listings-container">
                {
                    renderList.map(room => (
                        <div key={room.id} className="room-item">
                            <HostListingCard data={room}/>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default HostListings;
