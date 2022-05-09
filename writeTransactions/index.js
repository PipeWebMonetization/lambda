const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

exports.handler = async (event, context, callback) => {
  console.log(event);
  const { token, transactions } = JSON.parse(event.body);
  await writeTransaction(token, transactions)
    .then(() => {
      callback(null, {
        statusCode: 201,
        body: "success",
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
    })
    .catch((err) =>
      callback(err, {
        statusCode: 500,
        body: err,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      })
    );
};

function writeTransaction(token, transactions) {
  const transactionsRequest = transactions.map((transaction) => {
    return {
      PutRequest: {
        Item: {
          transactionId: transaction.date,
          value: transaction.value,
        },
      },
    };
  });
  var params = {
    RequestItems: {
      [token]: transactionsRequest,
    },
  };
  return ddb.batchWrite(params).promise();
}
