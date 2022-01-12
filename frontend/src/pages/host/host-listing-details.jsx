import React, {useEffect, useState,} from 'react';
import {Divider, Image, Button, Table, Space, message, DatePicker, Descriptions,} from 'antd';
import {StarOutlined,} from "@ant-design/icons";
import Text from 'antd/es/typography/Text';
import moment from 'moment';
import {Link, useLocation,} from 'react-router-dom';
import request from '../../tools/request';
import './host-listing-details.css';

function ListingDetailPage() {
    const listingId = useLocation().pathname.split('/')[3].split('=')[1];
    const [details, setDetails,] = useState([]);
    const [arr, setArr,] = useState([]);
    const tempArr = [];
    const [status, setStatus,] = useState(false);
    const [date, setDateRange,] = useState([]);
    const [currentDate, setCurrentDate,] = useState([]);
    const [allDays, setAllDays,] = useState(0);
    const [allProfit, setAllProfit,] = useState(0);
    let totalRating = 0;
    let rating;
    const {RangePicker,} = DatePicker;

    // Table's columns
    const columns = [
        {
            title: 'BookingId',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Client',
            dataIndex: 'owner',
            key: 'owner',
        },
        {
            title: 'Book Time',
            dataIndex: 'startEnd',
            key: 'startEnd',
        },
        {
            title: 'Total Days',
            dataIndex: 'totalBookTime',
            key: 'totalBookTime',
        },

        {
            title: 'TotalPrice',
            dataIndex: 'totalPriceStr',
            key: 'totalPrice',
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    {/*eslint-disable-next-line*/}
                    <a onClick={() => acceptBookingRequire(record.id)}> Accept </a>
                    {/*eslint-disable-next-line*/}
                    <a onClick={() => declineBookingRequire(record.id)}> Decline </a>
                </Space>
            ),
        },
    ];

    // Get listing list
    useEffect(() => {
        request('GET', undefined, `/listings/${listingId}`)
            .then(data => {
                if (data?.listing) {
                    setDetails(data.listing);
                    setStatus(data.listing.published);
                    setCurrentDate(data.listing.availability[0]);
                }
            });
        // eslint-disable-next-line
    }, []);

    // Get booking list
    useEffect(() => {
        let tempAllDays = 0;
        let tempAllProfit = 0;
        request('GET', undefined, '/bookings')
            .then((bookingData) => {
                bookingData.bookings.forEach((bookItem) => {
                    const bookingsListingId = bookItem.listingId;
                    if (bookingsListingId === listingId) {
                        bookItem['startEnd'] = `${bookItem['dateRange'].start} to ${bookItem['dateRange'].end}`;
                        bookItem['totalBookTime'] = `${moment(bookItem['dateRange'].end).diff(moment(bookItem['dateRange'].start), 'days')} days`;
                        bookItem['totalPriceStr'] = `${bookItem['totalPrice']} $`;
                        tempArr.push(bookItem);
                        setArr([...tempArr,]);
                        if (bookItem['status'] === 'accepted') {
                            tempAllDays += moment(bookItem['dateRange'].end).diff(moment(bookItem['dateRange'].start), 'days');
                            tempAllProfit += bookItem['totalPrice'];
                        }
                    }
                });
                setAllDays(tempAllDays);
                setAllProfit(tempAllProfit);
            });
        // eslint-disable-next-line
    }, []);

    // Construct arr
    arr.forEach((value, index) => {
        value.key = index + 1;
    });

    // Accept Booking Require function
    function acceptBookingRequire(bookingId) {
        request('PUT', {'status': 'accepted',}, `/bookings/accept/${bookingId}`)
            .then((res) => {
                if (res) {
                    message.success('Accept Successfully!');
                    window.location.reload();
                }
            });
    }

    // Decline Booking Require function
    function declineBookingRequire(bookingId) {
        request('PUT', {'status': 'declined',}, `/bookings/decline/${bookingId}`)
            .then((res) => {
                if (res) {
                    message.success('Decline Successfully!');
                    window.location.reload();
                }
            });
    }

    // Publish and Unpublished function
    function disabledDate(current) {
        return current && current < moment().endOf('day');
    }

    const onChange = (dateRange, dateStr) => {
        setDateRange(dateStr);
    };

    const Publish = async () => {
        if (date[0]) {
            const response = await request('PUT', {
                'availability': [{
                    start: date[0],
                    end: date[1],
                },],
            }, `/listings/publish/${listingId}`);
            if (response) {
                message.success('Publish Successfully!');
                setStatus(true);
                setCurrentDate({start: date[0], end: date[1],});
            }
        } else {
            message.warning("Please select the date to publish!");
        }
    };

    const unPublishListing = async () => {
        const response = await request('PUT', undefined, `/listings/unpublish/${listingId}`);
        if (response) {
            message.success('UnPublish Successfully!');
            setStatus(false);
        }
    };

    if (details.reviews) {
        details.reviews.forEach(review => {
            totalRating += review.rating;
        });
        rating = (totalRating / details.reviews.length).toFixed(1);
    }

    return (
        <div className="listings-details-container">
            <div className="listing-details-title">
                <Divider orientation="left">{details.title}</Divider>
            </div>
            <div className="thumbnails-container">
                <div className="thumbnails">
                    {
                        <Image.PreviewGroup>
                            {
                                (details.thumbnail || []).map((src, index) => (
                                    <img width={400} height={300} className="thumbnail-img" key={index}
                                         alt={'thumbnail'} src={src}/>
                                ))
                            }
                        </Image.PreviewGroup>
                    }
                </div>
            </div>
            <div className="room-information-container">
                <Descriptions title="Room Information">
                    <Descriptions.Item label="Property Type">{details.metadata?.propertyType}</Descriptions.Item>
                    <Descriptions.Item label="Bed Number">{details.metadata?.bedNumber}</Descriptions.Item>
                    <Descriptions.Item label="Bathroom Number">{details.metadata?.bathroomNumber}</Descriptions.Item>
                    <Descriptions.Item label="Price / Night">{details.price} $</Descriptions.Item>
                    <Descriptions.Item label="Room Capacity">{details.metadata?.roomCapacity}</Descriptions.Item>
                    <Descriptions.Item label="Reviews Number">{details.reviews?.length}</Descriptions.Item>
                    <Descriptions.Item label="Address" span={2}>{details.address?.join(' / ')}</Descriptions.Item>
                    <Descriptions.Item label="Rating">{rating}<StarOutlined/></Descriptions.Item>
                </Descriptions>
            </div>
            {
                status === false &&
                <div className="date-pick">
                    <Space direction="vertical" size={12}>
                        <RangePicker disabledDate={disabledDate} onChange={onChange}/>
                    </Space>
                    <Button onClick={Publish} type="primary" style={{marginLeft: 20,}}>Publish</Button>
                </div>
            }
            {
                status === true &&
                <div className="status">
                    <Text strong>This Room is available from {currentDate?.start} to {currentDate?.end}</Text>
                    <br/>
                    <br/>
                    <Text strong>Cancel Publish This Room </Text>
                    <Button onClick={unPublishListing} type="danger">
                        UnPublish
                    </Button>
                </div>
            }
            <div className="bookings-table">
                <Table columns={columns} dataSource={arr}/>
            </div>
            <div className="days-profit">
                <p>The total days this listing has been booked for: {allDays} days.</p>
                <p>The total profit this listing has made: {allProfit} $.</p>
            </div>
            <Button style={{marginLeft: 20,}}>
                <Link to="/host">Go Back</Link>
            </Button>
        </div>
    );
}

export default ListingDetailPage;
