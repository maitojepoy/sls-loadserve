"use strict";
import { _200 } from 'common/Responses';
import Dynamo from 'common/Dynamo';

export const create = async event => {

};

export const statement = async (event, context, callback) => {
  const listdata = await Dynamo.list('Ledger');
  callback(null, _200(listdata));
};

export const load = async (event, context, callback) => {
  const body = JSON.parse(event.body);
  

  const listdata = await Dynamo.list('Ledger');
  callback(null, _200(listdata));
};