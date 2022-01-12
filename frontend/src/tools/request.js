import {message,} from 'antd';

function request(method, data, specificUrl) {
    const action = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('airbrb_token')}`,
        },
        body: JSON.stringify(
            data
        ),
    };

    return fetch(`http://localhost:5005${specificUrl}`, action)
        .then(response => response.json())
        .then((data) => {
            if (data.error) {
                message.error(data.error);
                return;
            }
            return data;
        }).catch(e => message.error(e.message));
}

export default request;
