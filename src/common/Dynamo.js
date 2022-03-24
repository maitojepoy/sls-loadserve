import { DynamoDB } from 'aws-sdk';

let options = {};
if (process.env.IS_OFFLINE) {
  options = {
    region: 'localhost',
    endpoint: 'http://localhost:8097',
  };
}

const documentClient = new DynamoDB.DocumentClient(options);

const Dynamo = {
  async get(ID, TableName) {
    const params = {
      TableName,
      Key: {
        ID,
      },
    };

    const data = await documentClient.get(params).promise();

    if (!data || !data.Item) {
      throw Error(`There was an error fetching the data for ID of ${ID} from ${TableName}`);
    }
    console.log(data);

    return data.Item;
  },

  async list(TableName) {
    const params = { TableName };

    const items = await documentClient.scan(params).promise();
    
    return [...items.Items];
  },

  async write(data, TableName) {
    if (!data.ID) {
      throw Error('no ID on the data');
    }

    const params = {
      TableName,
      Item: data,
    };

    const res = await documentClient.put(params).promise();

    if (!res) {
      throw Error(`There was an error inserting ID of ${data.ID} in table ${TableName}`);
    }

    return data;
  },

  async delete(ID, TableName) {
    const params = {
      Key: { ID },
      TableName,
    };

    return documentClient.delete(params).promise();
  },
};
export default Dynamo;
