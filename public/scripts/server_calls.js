export const sendPostRequest = (url, reqData = {}) =>
  fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(reqData),
  }).then(data => data.json());