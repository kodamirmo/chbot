const SlackBot = require('slackbots');
const axios = require('axios');
const TOKEN = process.env.CLUBHOUSE_API_TOKEN;
const STOKEN = process.env.SLACK_OAUTH_TOKEN;
const bot = new SlackBot({
  token : STOKEN,
  name : 'chbot'
});

bot.on('error', (err) => console.log(err));

bot.on('message', data => {
  if(data.type != 'message'){
    return;
  }

  handleMessage(data.text);
});

function handleMessage(message) {
  console.log("TCL: handleMessage -> message", message)
  if(message.includes(' in development')){
    getDevelopmentColumn()
  };

  if(message.includes(' ready for review')){
    getReadyForReviewColumn()
  };
};

function getDevelopmentColumn() {
  axios.get(`https://api.clubhouse.io/api/v2/search/stories?token=${TOKEN}`, {
    params : {
      "page_size" : 10,
      "query" : "state:500000018 !is:archived"
    }
  }).then(res => {
      const data = res.data.data;
      console.log("TCL: getDevelopmentColumn -> data", data)
      
      const params = {
        icon_emoji : ':computer:',
        mkdwn : true,
        attachments :  data.map(story => ({
          color : 'good',
          text : `*Name : ${story.name}* => assigned : ${getNames(story.owner_ids)}`
        })),
      };

      bot.postMessageToChannel(
        'test',
        `In Development`,
        params
      );
      
    }).catch(function (error) {
      // handle error
      console.log(error);
    });
}

function getReadyForReviewColumn() {
  axios.get(`https://api.clubhouse.io/api/v2/search/stories?token=${TOKEN}`, {
    params : {
      "page_size" : 10,
      "query" : "state:500000022"
    }
  }).then(res => {
      const data = res.data.data;
      const params = {
        icon_emoji : ':squirrel:',
        mkdwn : true,
        attachments :  data.map(story => ({
          color : 'good',
          text : `*Name : ${story.name}* => assigned : ${getNames(story.owner_ids)}`
        })),
      };

      bot.postMessageToChannel(
        'test',
        `Ready for Review`,
        params
      );
      
    }).catch(function (error) {
      // handle error
      console.log(error);
    });
}

function getNames (ownerId) {
    
  switch (ownerId[0]) {
    case '5a98dc8e-579c-4718-a9ea-c50f69ffee5a' :
      return 'Irving';
    case '5c3f6c1d-f9a1-4eec-b0a4-32fa060c691a' :
      return 'Pamela';
    case '5a997bf3-2258-4c94-957e-da00562ea49d' :
      return 'Linda';
    case '5a997ad4-89c4-45ac-863f-cf1da527ca8e' :
      return 'Edgar';
    default : 
      return 'Not assigned';
  }
}
