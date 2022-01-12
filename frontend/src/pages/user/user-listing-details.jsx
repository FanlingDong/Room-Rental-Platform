import React, {useEffect, useMemo, useState,} from 'react';
import {
    Divider,
    Image,
    Rate,
    Button,
    Space,
    Modal,
    DatePicker,
    Descriptions,
    message,
    Input,
    Comment,
    List, Table,
} from 'antd';
import {ExclamationCircleOutlined, StarOutlined,} from '@ant-design/icons';
import Text from 'antd/es/typography/Text';
import {Link, useLocation,} from 'react-router-dom';
import moment from 'moment';
import request from '../../tools/request';
import './user-listing-details.css';

function UserListingDetailPage() {
    const {RangePicker,} = DatePicker;
    const {confirm,} = Modal;
    const {TextArea,} = Input;
    const listingId = useLocation().pathname.split('/')[3].split('=')[1];
    const [details, setDetails,] = useState([]);
    const [dateRange, setDateRange,] = useState([]);
    const [status, setStatus,] = useState(false);
    const [bookingId, setBookingId,] = useState('');
    const [review, setReview,] = useState('');
    const [rating, setRating,] = useState(2.5);
    const [allBookings, setAllBookings,] = useState([]);
    const tempArr = [];
    let totalRating = 0;
    let averageRating;
    const columns = [
        {
            title: 'BookingId',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'listing Id',
            dataIndex: 'listingId',
            key: 'listingId',
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
                    <a onClick={() => showDeleteConfirm(record.id)}> Delete </a>
                </Space>
            ),
        },
    ];

    // Get bookings list
    useEffect(() => {
        request('GET', undefined, '/bookings')
            .then((data) => {
                data.bookings.forEach((item) => {
                    if (item.listingId === listingId && item.owner === JSON.parse(localStorage.getItem('airbrb_user')).email) {
                        item['totalPriceStr'] = `${item['totalPrice']} $`;
                        item['startEnd'] = `${item['dateRange'].start} to ${item['dateRange'].end}`;
                        item['totalBookTime'] = `${moment(item['dateRange'].end).diff(moment(item['dateRange'].start), 'days')} days`;
                        tempArr.push(item);
                        setBookingId(item.id);
                        setAllBookings([...tempArr,]);
                        if (item.status === 'accepted') {
                            setStatus(true);
                        }
                    }
                });
            });
        // eslint-disable-next-line
    }, []);

    // Get each booking by id
    useEffect(() => {
        request('GET', undefined, `/listings/${listingId}`)
            .then(data => {
                if (data?.listing) {
                    setDetails(data.listing);
                }
            });
        // eslint-disable-next-line
    }, []);

    // Show total price of the order
    const totalPrice = useMemo(() => {
        return moment(dateRange[1]).diff(moment(dateRange[0]), 'days') * details.price;
    }, [dateRange, details.price,]);

    // Modal function
    const onChange = (dateRange, dateStr) => {
        setDateRange(dateStr);
    };

    function disabledDate(current) {
        return current && current < moment().endOf('day');
    }

    // Make booking
    function showConfirm() {
        confirm({
            title: 'Are you sure to book this room?',
            icon: <ExclamationCircleOutlined/>,
            content: `From ${dateRange[0]} To ${dateRange[1]}.`,
            onOk() {
                request('POST', {
                    'dateRange': {
                        start: dateRange[0],
                        end: dateRange[1],
                    },
                    'totalPrice': totalPrice,
                }, `/bookings/new/${listingId}`)
                    .then((data) => {
                        if (data?.bookingId) {
                            message.success('Make Booking successfully');
                            setBookingId(data.bookingId);
                            window.location.reload();
                        }
                    });
            },
        });
    }

    // Cancel booking
    function showDeleteConfirm(currentBookingId) {
        confirm({
            title: 'Are you sure to delete this booking?',
            icon: <ExclamationCircleOutlined/>,
            content: '',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                request('DELETE', undefined, `/bookings/${currentBookingId}`)
                    .then((res) => {
                        if (res) {
                            message.success('Delete booking successfully');
                            window.location.reload();
                        }
                    });
            },
        });
    }

    // Post review
    function postReview() {
        if (!bookingId) {
            message.error('You have not book this listing!');
            return;
        }
        request('PUT', {
            'review': {
                rating: rating,
                review: review,
                owner: localStorage.getItem('user_email'),
            },
        }, `/listings/${listingId}/review/${bookingId}`)
            .then((res) => {
                if (res) {
                    message.success('Comment successfully');
                    window.location.reload();
                }
            });
    }

    if (details.reviews) {
        details.reviews.forEach(review => {
            totalRating += review.rating;
        });
        averageRating = (totalRating / details.reviews.length).toFixed(1);
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
                    <Descriptions.Item label="Bedroom Number">{details.metadata?.roomCapacity}</Descriptions.Item>
                    <Descriptions.Item label="Bed Number">{details.metadata?.bedNumber}</Descriptions.Item>
                    <Descriptions.Item label="Bathroom Number">{details.metadata?.bathroomNumber}</Descriptions.Item>
                    <Descriptions.Item label="Price / Night">{details.price} $</Descriptions.Item>
                    <Descriptions.Item label="Address" span={2}>{details.address?.join(' / ')}</Descriptions.Item>
                    <Descriptions.Item label="Amenities"
                                       span={2}>{details.metadata?.propertyAmenities?.join(' / ')}</Descriptions.Item>
                    <Descriptions.Item label="Rating">{averageRating}<StarOutlined/></Descriptions.Item>
                </Descriptions>
            </div>

            <div className="date-pick">
                <Space direction="vertical" size={12}>
                    <RangePicker disabledDate={disabledDate} onChange={onChange}/>
                </Space>
                <Button onClick={showConfirm} type="primary" style={{marginLeft: 20,}}>Book</Button>
                <div className="total-price">
                    {
                        <Text type="success" strong>Total Price: {totalPrice} $</Text>
                    }
                </div>
            </div>
            <div>
                <br/>
                <Table columns={columns} dataSource={allBookings}/>
            </div>
            <div className="comments">
                <List
                    header={`${details.reviews?.length} reviews`}
                    className="comment-list"
                    itemLayout="horizontal"
                    dataSource={details.reviews}
                    renderItem={item => (
                        <li>
                            <Comment
                                content={item.review}
                                author={item.owner}
                            />
                        </li>
                    )}
                />
            </div>
            {
                status === true &&
                <div className="review">
                    <Rate allowHalf defaultValue={2.5} onChange={value => setRating(value)}/>
                    <TextArea showCount maxLength={140} rows={4} onChange={value => setReview(value.target.value)}/>
                    <Button onClick={postReview} type="primary" style={{marginTop: 20,}}>
                        Post Review
                    </Button>
                </div>
            }
            <Button style={{marginTop: 20,}}>
                <Link to="/user">Return</Link>
            </Button>
        </div>
    );
}

export default UserListingDetailPage;
