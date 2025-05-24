
// Example of how to initiate a payment using the fapshi Nodejs SDK
// Before running this, make sure to have axios installed. Also, add your apiuser and apikey to your fapshi.js file
// const fapshi = require('./fapshi');

import fapshi from './fapshi.js';

export async function initiatePayment(){
    const payment = {
        amount: 500, //fapshi
        email: 'myuser@email.com',
        externalId: '12345',
        userId: 'abcde',
        redirectUrl: 'https://mywebsite.com',
        message: 'testing SDK nodejs',
        // cardOnly: true 
    }
    const resp = await fapshi.initiatePay(payment)
    return resp;
}