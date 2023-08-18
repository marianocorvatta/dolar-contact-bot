var axios = require('axios');

function sendMessage() {
    const url = 'https://graph.facebook.com/v17.0/104266786108834/messages';
    const accessToken = 'EABbZCbnJ1YeoBO4rESNB2IIN3pk3BDzF93yAOI2psnn2NMlKiOvAWLjAMKLi8i0ZBOmNEeuIYghbZA6Mrye9ofjLyDvwPjg6AZBRvDFRRnk8tH0aWxzTxnohN8FEdL6XooWglw3dClTMZBlruI1FyD1J6GSokOFLD2HiNqoFEKtHpHZBxNDfiDHWmF3ZB1JoWEK7GBbc6DPhU1QJGb2oV9xGfszpFV3dxQIJAZDZD';

    const data = {
        messaging_product: 'whatsapp',
        to: '34624890420',
        preview_url: false,
        recipient_type: "individual",
        type: "text",
        text: {
            body: "Hello from nodejs app"
        }
    };

    const headers = {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
    };

    return axios.post(url, data, { headers });
}

function getTextMessageInput(recipient, text) {
  return JSON.stringify({
    "messaging_product": "whatsapp",
    "preview_url": false,
    "recipient_type": "individual",
    "to": "+34624890420",
    "type": "text",
    "text": {
        "body": text
    }
  });
}

module.exports = {
  sendMessage: sendMessage,
  getTextMessageInput: getTextMessageInput
};
