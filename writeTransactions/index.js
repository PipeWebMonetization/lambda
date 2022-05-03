const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({region:'us-east-1'});

exports.handler = async (event,context,callback) => {
    console.log(event)
    const token = event.token;
    await writeTransaction(token).then(()=>{
        callback(null,{
            statusCode:201,
            body:'',
            headers:{
                'Access-Control-Allow-Origin':'*'
                
            }
        })
    }).catch((err)=>console.error(err))
};

function writeTransaction(token){
    const now = new Date()
    const params = {
        TableName: token,
        Item:{
            'transactionId': now.toISOString(),
            'value': 30000
        }
    }
    return ddb.put(params).promise();
}
