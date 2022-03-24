"use strict";
import { _200 } from 'common/Responses';
import Dynamo from 'common/Dynamo';

export const create = async event => {

};

export const list = async (event, context, callback) => {
  const listdata = await Dynamo.list('Ledger');
  callback(null, _200(listdata));
};