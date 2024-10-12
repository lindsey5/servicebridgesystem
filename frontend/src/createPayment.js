let paymentInterval;

const createPaymentLink = async (amount) => {
    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            authorization: 'Basic c2tfdGVzdF9Razh2Q1ZkdUJaOTFZRmtRTEhyTEpXR0E6'
        },
        body: JSON.stringify({ data: { attributes: { amount, description: 'sadafsafas' } } })
    };

    try {
        const response = await fetch('https://api.paymongo.com/v1/links', options);
        const data = await response.json();
        console.log(data);
        if (data && data.data && data.data.attributes.checkout_url) {
            window.open(data.data.attributes.checkout_url, '_blank');
            
        }
    } catch (err) {
        console.error(err);
    }
};
const checkPaymentStatus = async (id) => {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            authorization: 'Basic c2tfdGVzdF9Razh2Q1ZkdUJaOTFZRmtRTEhyTEpXR0E6'
        }
    };

    try {
        const response = await fetch(`https://api.paymongo.com/v1/links/${id}`, options);
        const data = await response.json();
        console.log(data.data.attributes.status);
        if (data && data.data) {
            if (data.data.attributes.status === 'paid') {
                console.log('payment success');
                clearInterval(paymentInterval);
            }
        }
    } catch (err) {
        console.error(err);
    }
};