import { DynamoDB } from 'aws-sdk';

let options = {};
const { IS_OFFLINE, dynamodbPortLocal } = process.env;
if (IS_OFFLINE) {
  options = {
    region: 'localhost',
    endpoint: `http://localhost:${dynamodbPortLocal}`,
  };
}

const documentClient = new DynamoDB.DocumentClient(options);

const Dynamo = {
  OPERATION: {
    gt: attr => `${attr} > :${attr.toLowerCase()}`,
    lt: attr => `${attr} < ${attr.toLowerCase()}`,
    gte: attr => `${attr} >= ${attr.toLowerCase()}`,
    lte: attr => `${attr} <= ${attr.toLowerCase()}`,
    eq: attr => `${attr} = ${attr.toLowerCase()}`,
    default: (attr, func) => `${func}(${attr}, :${attr.toLowerCase()})`,
    list: ['gt', 'lt', 'gte', 'lte', 'eq'],
  },
  async get(Key, TableName) {
    const params = {
      TableName,
      Key,
    };

    const data = await documentClient.get(params).promise();

    if (!data || !data.Item) {
      const keys = Object.keys(Key);
      throw Error(`There was an error fetching the data for ${keys[0]} of ${Key[0]} from ${TableName}`);
    }
    console.log(data);

    return data.Item;
  },

  async list(TableName, conditions = {}) {
    const params = { TableName, ...conditions };

    const items = await documentClient.scan(params).promise();
    
    return [...items.Items];
  },

  async write(data, TableName) {
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

  async delete(Key, TableName) {
    const params = {
      Key,
      TableName,
    };

    return documentClient.delete(params).promise();
  },

  async query(TableName, HashParams, RangeParams = null, ExtraParams = null) {
    const hashKeys = Object.keys(HashParams);
    const keyConditions = [hashKeys.map(hashKey => `${hashKey} = :${hashKey}`).join(' AND ')];
    let expAttrValues = hashKeys.reduce((acc, curr) => {
      return { ...acc, [`:${curr.toLowerCase()}`]: HashParams[curr] };
    }, {});
    if (RangeParams) {
      const rangeKeys = Object.keys(RangeParams);
      const rangeConditions = rangeKeys.map((rangeKey) => {
        const { operation } = RangeParams[rangeKey];
        return this.OPERATION.list.includes(operation) 
          ? this.OPERATION[operation](rangeKey)
          : this.operation.default(rangeKey, operation);
      }).join(' AND ');
      keyConditions.push(rangeConditions);
      expAttrValues = rangeKeys.reduce((acc, curr) => {
        return { ...acc, [`:${curr.toLowerCase()}`]: RangeParams[curr] };
      }, { ... expAttrValues });
    }
    const params = {
      TableName,
      KeyConditionExpression: keyConditions.join(' AND '),
      ExpressionAttributeValues: expAttrValues,
      ...ExtraParams,
    };

    return documentClient.query(params).promise();
  },
};
export default Dynamo;
