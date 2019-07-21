const SlackBot = require('slackbots');
const axios = require('axios');
const TOKEN = process.env.CLUBHOUSE_API_TOKEN;
const bot = new SlackBot({
  token : 'xoxb-138180247361-686443593746-OnX4W1a1dhvc3uHFQemzQci8',
  name : 'chbot'
});

bot.on('start', () => {
  const params = {
    icon_emoji : ':squirrel:',  
  }

  bot.postMessageToChannel(
    'test',
    'Averigua cómo van las tareas',
    params
  );
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
};

function getDevelopmentColumn() {
  console.log('token',TOKEN)
  axios.get(`https://api.clubhouse.io/api/v2/search/stories?token=${TOKEN}`, {
    params : {
      "page_size" : 10,
      "query" : "state:500000018"
    }
  }).then(res => {
      const data = res.data.data;
      console.log("TCL: getDevelopmentColumn -> data", data)
      const params = {
        icon_emoji : ':squirrel:',
        mkdwn : true,
        attachments :  data.map(story => ({
          color : 'good',
          text : `*Name : ${story.name}* => assigned : ${story.owner_ids}`
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

function getUnscheduledColumn() {
  return console.log('unscheduled');
}
