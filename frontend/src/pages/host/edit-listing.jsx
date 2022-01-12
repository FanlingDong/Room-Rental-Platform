import React, {useEffect, useState,} from 'react';
import {Button, Cascader, Checkbox, Col, Form, Input, InputNumber, message, Modal, Row, Upload,} from 'antd';
import address from '../../tools/address';
import {Link, useLocation,} from 'react-router-dom';
import {useNavigate,} from "react-router";
import request from "../../tools/request";

function changeBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

function generateEditThumbnail(thumbnail) {
    if (thumbnail instanceof Array) {
        return thumbnail.map(item => item.url || item.thumbUrl);
    }
    return thumbnail.fileList.map(item => item.url || item.thumbUrl);
}

function EditListingPage() {
    const listingId = useLocation().pathname.split('/')[3].split('=')[1];
    const [thumbnailList, setThumbnailList,] = useState([]);
    const [previewImage, setPreviewImage,] = useState();
    const [previewModalVisible, setPreviewModalVisible,] = useState(false);

    const navigate = useNavigate();
    const [form,] = Form.useForm();

    useEffect(() => {
        request('GET', undefined, `/listings/${listingId}`)
            .then(data => {
                const values = {
                    title: data.listing.title,
                    address: data.listing.address,
                    price: data.listing.price,
                    metadata: data.listing.metadata,
                };
                setThumbnailList(data.listing.thumbnail.map((data, index) => ({
                    uid: index.toString(),
                    name: `${index}.png`,
                    url: data,
                    status: 'done',
                })));
                form.setFieldsValue(values);
            });
        // eslint-disable-next-line
    }, []);

    const onEdit = async (values) => {
        const thumbnail = generateEditThumbnail(thumbnailList || values.thumbnail);
        if (!thumbnail || thumbnail.length === 0) {
            message.warning('Thumbnail is required!');
        } else {
            const data = {
                ...values,
                thumbnail,
            };
            const response = await request('PUT', data, `/listings/${listingId}`);
            if (response) {
                message.success('Update successfully!');
                navigate(`/host`, {replace: true,});
            }
        }
    };

    const handleThumbnailChange = ({fileList,}) => {
        setThumbnailList(fileList);
    };

    const handleThumbnailPreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await changeBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewModalVisible(true);
    };

    return (
        <div className="listings-edit-container">
            <h1>Please fill this form to update your listing!</h1>
            <Form
                name="edit-listing"
                labelCol={{span: 8,}}
                wrapperCol={{span: 16,}}
                initialValues={{remember: true,}}
                form={form}
                onFinish={onEdit}
                autoComplete="off"
            >
                <Form.Item
                    label="Title"
                    name="title"
                    rules={[{required: true,},]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="Address"
                    name="address"
                    rules={[{required: true,},]}
                >
                    <Cascader options={address} placeholder="Please select address"/>
                </Form.Item>
                <Form.Item
                    label="Price (per night)"
                    name="price"
                    rules={[{
                        type: 'number',
                        min: 0,
                        max: 999999,
                        required: true,
                    },]}
                >
                    <InputNumber/>
                </Form.Item>
                <Form.Item
                    label="Thumbnail"
                    name="thumbnail"
                    valuePropName="thumbnailList"
                >
                    <Upload
                        listType="picture-card"
                        fileList={thumbnailList}
                        onPreview={handleThumbnailPreview}
                        onChange={handleThumbnailChange}
                    >
                        {thumbnailList.length < 5 && '+ Upload'}
                    </Upload>
                </Form.Item>
                <Form.Item
                    label="Property type"
                    name={['metadata', 'propertyType',]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="Bathroom Number"
                    name={['metadata', 'bathroomNumber',]}
                    rules={[{
                        type: 'number',
                        min: 1,
                        max: 99,
                    },]}
                >
                    <InputNumber/>
                </Form.Item>
                <Form.Item
                    label="Room Capacity"
                    name={['metadata', 'roomCapacity',]}
                    rules={[{
                        type: 'number',
                        min: 1,
                        max: 99,
                    },]}
                >
                    <InputNumber/>
                </Form.Item>
                <Form.Item
                    label="Bed Number"
                    name={['metadata', 'bedNumber',]}
                    rules={[{
                        type: 'number',
                        min: 1,
                        max: 99,
                    },]}
                >
                    <InputNumber/>
                </Form.Item>
                <Form.Item
                    label="Property amenities"
                    name={['metadata', 'propertyAmenities',]}
                >
                    <Checkbox.Group style={{width: '100%',}}>
                        <Row>
                            <Col span={8}>
                                <Checkbox value="Free Parking">Free Parking</Checkbox>
                            </Col>
                            <Col span={8}>
                                <Checkbox value="Air Condition">Air Condition</Checkbox>
                            </Col>
                            <Col span={8}>
                                <Checkbox value="Washing Machine">Washing Machine</Checkbox>
                            </Col>
                            <Col span={8}>
                                <Checkbox value="Cooking">Cooking</Checkbox>
                            </Col>
                            <Col span={8}>
                                <Checkbox value="Pets Allowed">Pets Allowed</Checkbox>
                            </Col>
                            <Col span={8}>
                                <Checkbox value="WiFi">WiFi</Checkbox>
                            </Col>
                        </Row>
                    </Checkbox.Group>
                </Form.Item>
                <Form.Item wrapperCol={{
                    offset: 8,
                    span: 16,
                }}>
                    <Button type="light" style={{marginRight: 30,}}>
                        <Link to="/host">
                            Cancel
                        </Link>
                    </Button>
                    <Button type="primary" htmlType="submit">
                        Update
                    </Button>
                </Form.Item>
            </Form>
            <Modal
                visible={previewModalVisible}
                title={'Preview Photo'}
                footer={null}
                onCancel={() => setPreviewModalVisible(false)}
            >
                <img alt="thumbnail" style={{width: '100%',}} src={previewImage}/>
            </Modal>
        </div>
    );
}

export default EditListingPage;
