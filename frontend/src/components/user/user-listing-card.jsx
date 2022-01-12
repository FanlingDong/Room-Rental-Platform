import {EyeOutlined,} from '@ant-design/icons';
import {Card, Carousel,} from 'antd';
import React from 'react';
import {useNavigate,} from 'react-router';

const {Meta,} = Card;

function UserListingCard(data) {
    data = data.data;
    const navigate = useNavigate();
    const viewDetails = () => {
        navigate(`/user/details/listingId=${data.id}`);
    };

    return (
        <Card
            style={{width: 300,}}
            cover={
                <Carousel>
                    {
                        (data.thumbnail || []).map((src, index) => (
                            <div>
                                <h3 style={{height: 200,}}>
                                    <img className="thumbnail-img" key={index} alt={'thumbnail'} src={src}/>
                                </h3>
                            </div>
                        ))
                    }
                </Carousel>
            }
            actions={[
                <EyeOutlined key="view" onClick={viewDetails}/>,
            ]}
        >
            <Meta
                title={
                    // eslint-disable-next-line
                    <a onClick={viewDetails}>
                        {data.title}
                    </a>
                }
                description={`Total Reviews Number: ${data.reviews.length}`}
            />
        </Card>
    );
}

export default UserListingCard;
