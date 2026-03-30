export const sendPostRequest = async (url, reqData = {}) =>
  fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(reqData),
  }).then(data => data.json());