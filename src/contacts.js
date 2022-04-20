"use strict";
import { _200, _400, _404 } from 'common/Responses';
import Dynamo from 'common/Dynamo';
import { v4 as uuid } from 'uuid';

const { tableLedger, tableContacts } = process.env;

export const create = async (event, context, callback) => {
  const body = JSON.parse(event.body);
  const { contactId, name: Name, contactNum: ContactNumber } = body;

  const ContactID = contactId || uuid();
  const Timestamp = Date.now();
  
  const newContactData = {
    ContactID,
    Timestamp,
    ActivityType: 'NEW_ACCOUNT',
    Name,
    ContactNumber,
  };
  Dynamo.write(newContactData, tableLedger);
  const ledgerData = {
    ContactID,
    Timestamp,
    ActivityType: 'INIT_BALANCE',
    Balance: 0,
  };
  Dynamo.write(ledgerData, tableLedger);

  callback(null, _200({ ...newContactData, ...ledgerData }));
};

export const list = async (event, context, callback) => {
  const listdata = await Dynamo.list(tableContacts);
  callback(null, _200(listdata));
};

export const remove = async (event, context, callback) => {
  if (!event.pathParameters || !event.pathParameters.ID) {
      // failed without an ID
      return _400({ message: 'missing the ID from the path' });
  }

  const { pathParameters: { ID } } = event;

  const response = await Dynamo.delete({ ContactID: ID }, tableLedger).catch(err => {
      console.log('error in Dynamo Get', err);
      return null;
  });

  if (!response) {
      return _404({ message: 'Failed to find user by ID' });
  }

  callback(null, _200(response));
};