"use strict";
import { _200, _400, _404 } from 'common/Responses';
import Dynamo from 'common/Dynamo';
import { v4 as uuid } from 'uuid';

export const create = async (event, context, callback) => {
  const body = JSON.parse(event.body);
  const ContactID = uuid();
  const newContactData = {
    ID: ContactID,
    ...body,
  };
  Dynamo.write(newContactData, 'Contacts');

  const newLedgerData = {
    DateTransact: Date.now(),
    ContactID,
    Amount: 0,
    Balance: 0,
    Status: 'NEW_ACCOUNT',
  };

  // Dynamo.write(newLedgerData, 'Ledger');

  callback(null, _200({ user: newContactData, info: newLedgerData }));
};

export const list = async (event, context, callback) => {
  const listdata = await Dynamo.list('Contacts');
  callback(null, _200(listdata));
};

export const remove = async (event, context, callback) => {
  if (!event.pathParameters || !event.pathParameters.ID) {
      // failed without an ID
      return _400({ message: 'missing the ID from the path' });
  }

  const { pathParameters: { ID } } = event;

  const response = await Dynamo.delete(ID, 'Contacts').catch(err => {
      console.log('error in Dynamo Get', err);
      return null;
  });

  if (!response) {
      return _404({ message: 'Failed to find user by ID' });
  }

  callback(null, _200(response));
};