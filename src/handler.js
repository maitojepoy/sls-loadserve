"use strict";
import { _200 } from 'common/Responses';

export const hello = async event => (
  _200({
    message: "Go Serverless v2.0! Your function executed successfully!",
  })
);
