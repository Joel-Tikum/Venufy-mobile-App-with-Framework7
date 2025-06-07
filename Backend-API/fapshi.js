// @@ -1,183 +1,289 @@

// const axios = require('axios');


import axios from 'axios';

const baseUrl = 'https://sandbox.fapshi.com'

// For venufy pay live mode
// const headers =  {
//     apiuser: '24a0dfe7-6894-4470-9a5c-d88aecbe6182',
//     apikey: 'FAK_b977ce62d8fec150261fe86c0f9909b1'
// }

// For venufy collect live mode
// const headers =  {
//     apiuser: '5234328a-6642-4c31-887f-ba8c647e1b03',
//     apikey: 'FAK_6d17da8679f7847b3df4b3855b393723'
// }

const headers =  {
    apiuser: '1dcddc70-4fec-4a74-b160-3d53bd851c72',
    apikey: 'FAK_TEST_708c953616302215a5b6'
}

export default {
    /** 
    *This function returns an object with the link were a user is to be redirected in order to complete his payment

    *Below is a parameter template. Just amount is required

        data = {
            "amount": Integer ,
            "email": String,
            "userId": String,
            "externalId": String,
            "redirectUrl": String,
            "message": String
        }
    */
    initiatePay(data){
        return new Promise(async function(resolve){
            try {

                if(!data?.amount)
                    resolve(error('amount required', 400))
                if(!Number.isInteger(data.amount))
                    resolve(error('amount must be of type integer', 400))
                if(data.amount<100)
                    resolve(error('amount cannot be less than 100 XAF', 400))

                const config = {
                    method: 'post',
                    url: baseUrl+'/initiate-pay',
                    headers: headers,
                    data: data
                }
                const response = await axios(config)
                response.data.statusCode = response.status
                resolve(response.data)
            }catch(e){
                e.response.data.statusCode = e?.response?.status
                resolve(e.response.data)
            }
        })
    },

    /** 
    *This function directly initiates a payment request to a user's mobile device and 
    returns an object with a transId property that is used to get the status of the payment

    *Below is a parameter template. amount and phone are required

        data = {
            "amount": Integer ,
            "phone": String ,
            "medium": String,
            "name": String,
            "email": String,
            "userId": String,
            "externalId": String,
            "message": String
        }
    */
    directPay(data){
        return new Promise(async function(resolve){
            try {

                if(!data?.amount)
                    resolve(error('amount required', 400))
                if(!Number.isInteger(data.amount))
                    resolve(error('amount must be of type integer', 400))
                if(data.amount<100)
                    resolve(error('amount cannot be less than 100 XAF', 400))
                if(!data?.phone)
                    resolve(error('phone number required', 400))
                if(typeof data.phone !== 'string')
                    resolve(error('phone must be of type string', 400))
                if(!/^6[\d]{8}$/.test(data.phone))
                    resolve(error('invalid phone number', 400))

                const config = {
                    method: 'post',
                    url: baseUrl+'/direct-pay',
                    headers: headers,
                    data: data
                }
                const response = await axios(config)
                response.data.statusCode = response.status
                resolve(response.data)
            }catch(e){
                e.response.data.statusCode = e?.response?.status
                resolve(e.response.data)
            }
        })
    },

    /** 
    * This function returns an object containing the details of the transaction associated with the Id passed as parameter
    */
    paymentStatus(transId){
        return new Promise(async function(resolve){
            try {
                if(!transId || typeof transId !== 'string')
                    resolve(error('invalid type, string expected', 400))
                if(!/^[a-zA-Z0-9]{8,10}$/.test(transId))
                    resolve(error('invalid transaction id', 400))

                const config = {
                    method: 'get',
                    url: baseUrl+'/payment-status/'+transId,
                    headers: headers
                }
                const response = await axios(config)
                response.data.statusCode = response.status
                resolve(response.data)
            }catch(e){
                e.response.data.statusCode = e?.response?.status
                resolve(e.response.data)
            }
        })
    },

    /** 
    * This function expires the transaction associated with the Id passed as parameter and returns an object containing the details of the transaction
    */
    expirePay(transId){
        return new Promise(async function(resolve){
            try {
                if(!transId || typeof transId !== 'string')
                    resolve(error('invalid type, string expected', 400))
                if(!/^[a-zA-Z0-9]{8,9}$/.test(transId))
                if(!/^[a-zA-Z0-9]{8,10}$/.test(transId))
                    resolve(error('invalid transaction id', 400))

                const config = {
                    method: 'post',
                    url: baseUrl+'/expire-pay',
                    data: {transId},
                    headers: headers
                }
                const response = await axios(config)
                response.data.statusCode = response.status
                resolve(response.data)
            }catch(e){
                e.response.data.statusCode = e?.response?.status
                resolve(e.response.data)
            }
        })
    },

    /** 
    * This function returns an array of objects containing the transaction details of the user Id passed as parameter
    */
    userTrans(userId){
        return new Promise(async function(resolve){
            try {
                if(!userId || typeof userId !== 'string')
                    resolve(error('invalid type, string expected', 400))
                if(!/^[a-zA-Z0-9-_]{1,100}$/.test(userId))
                    resolve(error('invalid user id', 400))

                const config = {
                    method: 'get',
                    url: baseUrl+'/transaction/'+userId,
                    headers: headers
                }
                const response = await axios(config)
                resolve(response.data)
            }catch(e){
                e.response.data.statusCode = e?.response?.status
                resolve(e.response.data)
            }
        })
    },

    /** 
    * This function returns an object containing the balance of a service
    */
    balance(){
        return new Promise(async function(resolve){
            try {
                const config = {
                    method: 'get',
                    url: baseUrl+'/balance',
                    headers: headers
                }
                const response = await axios(config)
                response.data.statusCode = response.status
                resolve(response.data)
            }catch(e){
                e.response.data.statusCode = e?.response?.status
                resolve(e.response.data)
            }
        })
    },

    /** 
    *This function performs a payout to the phone number specified in the data parameter and 
    returns an object with a transId property that is used to get the status of the payment
    
    *Note: In the live environment, payouts must be enabled for this to work. Contact support if needed

    *Below is a parameter template. amount and phone are required

        data = {
            "amount": Integer ,
            "phone": String ,
            "medium": String,
            "name": String,
            "email": String,
            "userId": String,
            "externalId": String,
            "message": String
        }
    */
    payout(data){
        return new Promise(async function(resolve){
            try {
                if(!data?.amount)
                    return resolve(error('amount required', 400))
                if(!Number.isInteger(data.amount))
                    return resolve(error('amount must be of type integer', 400))
                if(data.amount<100)
                    return resolve(error('amount cannot be less than 100 XAF', 400))
                if(!data?.phone)
                    return resolve(error('phone number required', 400))
                if(typeof data.phone !== 'string')
                    return resolve(error('phone must be of type string', 400))
                if(!/^6[\d]{8}$/.test(data.phone))
                    return resolve(error('invalid phone number', 400))

                const config = {
                    method: 'post',
                    url: baseUrl+'/payout',
                    headers: headers,
                    data: data,
                }
                const response = await axios(config)
                response.data.statusCode = response.status
                resolve(response.data)
            }catch(e){
                e.response.data.statusCode = e?.response?.status
                resolve(e.response.data)
            }
        })
    },
    
    /** 
    *This function returns an array containing the transactions that satisfy
    the criteria specifed in the parameter passed to the function

    *Below is a parameter template.

        params = {
            "status": enum [created, successful, failed, expired],
            "medium": mobile money or orange money,
            "start": Date in format yyyy-mm-dd,
            "end": Date in format yyyy-mm-dd,
            "amt": >= 100,
            "limit": range(1, 100) default is 10,
            "sort": asc || desc
        }
    */
    search(params = {}){
        return new Promise(async function(resolve){
            try {                
                const config = {
                    method: 'get',
                    url: baseUrl+'/search',
                    params: params,
                    headers: headers,
                }
                const response = await axios(config)
                resolve(response.data)
            }catch(e){
                e.response.data.statusCode = e?.response?.status
                resolve(e.response.data)
            }
        })
    },    

}

function error(message, statusCode){
    return {message, statusCode}
}