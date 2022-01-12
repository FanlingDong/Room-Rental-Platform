import React from 'react';
import {Card, Carousel,} from 'antd';
import Meta from "antd/es/card/Meta";

function HomeListingCard(data) {
    data = data.data;
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
        >
            <Meta
                title={
                    <p>
                        {data.title}
                    </p>
                }
                description={`${(data.reviews).length} reviews totally`}
            />
        </Card>
    );
}

export default HomeListingCard;
