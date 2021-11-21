import aws from "aws-sdk";

const client = new aws.DynamoDB.DocumentClient({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
  region: "us-east-1",
  params: {
    TableName: "TweeterTable",
  },
  endpoint: "http://localhost:8000",
});

export default client;
