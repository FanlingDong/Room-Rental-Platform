import React, {useState,} from 'react';
import {Form, Input, Button, Cascader, Upload, InputNumber, Row, Col, message, Modal, Checkbox,} from 'antd';
import {useNavigate,} from 'react-router';
import {Link,} from 'react-router-dom';
import request from "../../tools/request";
import address from "../../tools/address";
import './create-listing.css';

function changeBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

async function generateThumbnail(fileList) {
    return (
        Promise.all(
            fileList.map(async (file) => {
                return await changeBase64(file.originFileObj);
            })
        )
    );
}

function CreateListing() {
    const [thumbnailList, setThumbnailList,] = useState([]);
    const [previewImage, setPreviewImage,] = useState();
    const [previewModalVisible, setPreviewModalVisible,] = useState(false);
    const navigate = useNavigate();

    const onCreate = async (values) => {
        const data = {
            ...values,
            thumbnail: await generateThumbnail(values.thumbnail.fileList),
        };
        const response = await request('POST', data, '/listings/new');
        if (response) {
            message.success('Create successfully!');
            navigate(`/host`, {replace: true,});
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
        <div className="listings-create-container">
            <h1>Please fill this form to create your listing!</h1>
            <Form
                name="create-listing"
                labelCol={{span: 8,}}
                wrapperCol={{span: 16,}}
                initialValues={{remember: true,}}
                onFinish={onCreate}
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
                    rules={[{required: true,},]}
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
                        min: 0,
                        max: 999999,
                    },]}
                >
                    <InputNumber/>
                </Form.Item>
                <Form.Item
                    label="Room Capacity"
                    name={['metadata', 'roomCapacity',]}
                    rules={[{
                        type: 'number',
                        min: 0,
                        max: 999999,
                    },]}
                >
                    <InputNumber/>
                </Form.Item>
                <Form.Item
                    label="Bed Number"
                    name={['metadata', 'bedNumber',]}
                    rules={[{
                        type: 'number',
                        min: 0,
                        max: 999999,
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
                        <Link to="/host/listings">
                            Cancel
                        </Link>
                    </Button>
                    <Button type="primary" htmlType="submit">
                        Create
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

export default CreateListing;
