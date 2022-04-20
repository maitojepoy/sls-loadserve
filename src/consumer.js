"use strict";
import { _200 } from 'common/Responses';
import Dynamo from 'common/Dynamo';

const { tableLedger, tableContacts } = process.env;

export const statement = async (event, context, callback) => {
  const body = JSON.parse(event.body);
  const {
    contactId: ContactID,
  } = body;

  const contactStatement = await Dynamo.query(
    tableContacts,
    { ContactID },
    null
  );
  
  callback(null, _200({ ...contactStatement }));
  
};

export const load = async (event, context, callback) => {
  const body = JSON.parse(event.body);
  const {
    contactId: ContactID,
    amount: Amount,
    payment: AmountPaid, 
  } = body;

  const contactLastUpdate = await Dynamo.query(
    tableContacts,
    { ContactID },
    null,
    { ScanIndexForward: true, Limit: 1 },
  );
  const Balance = contactLastUpdate.Balance - (Amount - AmountPaid);

  const ledgerData = {
    ContactID,
    Timestamp: Date.now(),
    Amount,
    AmountPaid,
    Balance,
    ActivityType: 'CUSTOMER_LOAD',
  };
  Dynamo.write(ledgerData, tableLedger);
  

  callback(null, _200({ ...ledgerData }));
};