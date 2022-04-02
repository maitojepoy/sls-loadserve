"use strict";
import { _200, _400, _404 } from 'common/Responses';
import Dynamo from 'common/Dynamo';
import { v4 as uuid } from 'uuid';

export const create = async (event, context, callback) => {
  const body = JSON.parse(event.body);
  const ContactID = uuid();
  const { name: Name, contactNum: ContactNumber } = body;
  const newContactData = {
    ContactID: ContactID,
    Timestamp: Date.now(),
    Name,
    ContactNumber,
    Amount: 0,
    Balance: 0,
    ActivityType: 'NEW_ACCOUNT',
    ...body,
  };
  Dynamo.write(newContactData, 'Ledger');

  callback(null, _200(newContactData));
};

export const list = async (event, context, callback) => {
  const listdata = await Dynamo.list('Ledger');
  console.log(listdata);
  callback(null, _200(listdata));
};

export const remove = async (event, context, callback) => {
  if (!event.pathParameters || !event.pathParameters.ID) {
      // failed without an ID
      return _400({ message: 'missing the ID from the path' });
  }

  const { pathParameters: { ID } } = event;

  const response = await Dynamo.delete(ID, 'Ledger').catch(err => {
      console.log('error in Dynamo Get', err);
      return null;
  });

  if (!response) {
      return _404({ message: 'Failed to find user by ID' });
  }

  callback(null, _200(response));
};