const _DefineResponse = (statusCode = 502, data = {}) => ({
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Origin': '*',
  },
  statusCode,
  body: JSON.stringify(data),
});

export const _200 = (data = {}) => (
  _DefineResponse(200, data)
);

export const _400 = (data = {}) => (
  _DefineResponse(400, data)
);

export const _404 = (data = {}) => (
  _DefineResponse(404, data)
);
