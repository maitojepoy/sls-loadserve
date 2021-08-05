'use strict';
import { _200 } from 'common/Responses';

export const hello = async event => (
  _200({
    message: 'Hey. Nothing to see here. Move along.',
  })
);
