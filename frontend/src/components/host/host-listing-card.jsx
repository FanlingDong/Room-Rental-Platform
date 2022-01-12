import {
    DeleteOutlined,
    EyeOutlined,
    FormOutlined,
} from '@ant-design/icons';
import {Modal, Card, Carousel, message,} from 'antd';
import {ExclamationCircleOutlined,} from '@ant-design/icons';
import React from 'react';
import {useNavigate,} from 'react-router';
import request from "../../tools/request";

const {Meta,} = Card;
const {confirm,} = Modal;

function HostListingCard(data) {
    data = data.data;
    const navigate = useNavigate();

    const viewDetails = () => {
        navigate(`/host/details/listingId=${data.id}`);
    };

    const editDetails = () => {
        navigate(`/host/edit/listingId=${data.id}`);
    };

    function showDeleteConfirm() {
        confirm({
            title: 'Are you sure delete this listing?',
            icon: <ExclamationCircleOutlined/>,
            content: `Title: ${data.title}`,
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk() {
                request('DELETE', undefined, `/listings/${data.id}`)
                    .then(response => {
                        if (response) {
                            message.success('Delete Successfully!');
                            window.location.reload();
                        }
                    });
            },
        });
    }

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
                <FormOutlined key="edit" onClick={editDetails}/>,
                <DeleteOutlined key="delete" onClick={showDeleteConfirm}/>,
            ]}
        >
            <Meta
                title={
                    // eslint-disable-next-line
                    <a onClick={viewDetails}>
                        {data.title}
                    </a>
                }
                description={`${data.address[1]}, ${data.address[0]}`}
            />
        </Card>
    );
}

export default HostListingCard;
