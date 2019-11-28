const { ActivityHandler } = require('botbuilder');
var builder = require('botbuilder');
const { MessageFactory, CardFactory,TurnContext,ActionTypes } = require('botbuilder');

class GiphyBot {

    static async getGiphy(context,next){

        var input = context.activity.text;
        var number = Math.floor(Math.random() * 19 ) + 1;
        var inputKeyword = input.replace("@giphy", "");

        const response = await fetch('http://api.giphy.com/v1/gifs/search?q="'+inputKeyword+'"&api_key=Kp5L1GFE5JwIpDrsrKtMxc3ATb8syTV4&limit=21');
        const myJson = await response.json();

        console.log(myJson.data[number].url);

        var id = myJson.data[number].id;

        var card = CardFactory.heroCard(
            '',
            ['https://media0.giphy.com/media/'+id+'/200.webp'],
        );

        const message = MessageFactory.attachment(card);
        await context.sendActivity(message);
    } 
}
