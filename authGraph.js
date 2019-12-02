const APP_ID = 'e414d507-6c1d-4b7c-baa4-b0b8834e6d9c';
const APP_SECERET = '+_#7mr=h:MTNo!a2YaR%0Pi8bD89PxT';
const TOKEN_ENDPOINT= 'https://login.microsoftonline.com/common/oauth2/v2.0/token'
const MS_GRAPH_SCOPE = 'https://graph.microsoft.com/.default';

const axios = require('axios');
const qs = require('qs');

const postData = {
  client_id: APP_ID,
  scope: MS_GRAPH_SCOPE,
  client_secret: APP_SECERET,
  grant_type: 'client_credentials'
};

axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded';

let token = '';

axios
  .post(TOKEN_ENDPOINT, qs.stringify(postData))
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.log(error);
  });