const { DialogBot } = require('./dialogBot');

class AuthBot extends DialogBot {
    constructor(conversationState, userState, dialog) {
        super(conversationState, userState, dialog);

        this.onMessage(async (context, next) => {

            var input = context.activity.text;
            var number = Math.floor(Math.random() * 19 ) + 1;
            var inputKeyword = input.replace("@giphy", "");


            const response = await fetch('http://api.giphy.com/v1/gifs/search?q="'+inputKeyword+'"&api_key=Kp5L1GFE5JwIpDrsrKtMxc3ATb8syTV4&limit=21');
            const myJson = await response.json();
            //console.log(JSON.stringify(myJson));
            //console.log(myJson);
            console.log(myJson.data[number].url);

            var id = myJson.data[number].id;

            var card = CardFactory.heroCard(
                '',
               ['https://media0.giphy.com/media/'+id+'/200.webp'],
            );

            if(input.includes("@giphy")){
                const message = MessageFactory.attachment(card);
                await context.sendActivity(message);
            }        

            if(!input.includes("@giphy")){
                TurnContext.removeRecipientMention(context.activity);
                switch (context.activity.text.trim()) {
                case 'help':
                    await context.sendActivity("Use @giphy 'name gif' to send a giphy");
                    break;
                case 'Who am I':
                    await context.sendActivity("input graph here");
                    break;
                default:
                    await context.sendActivity("I don't know the answer to that.")
                    break;        
                }
            }
        
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            for (let cnt = 0; cnt < membersAdded.length; cnt++) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity('Welcome to the VentigrateBot. Type anything to get started.');
                }
            }

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        this.onTokenResponseEvent(async (context, next) => {
            console.log('Running dialog with Token Response Event Activity.');

            // Run the Dialog with the new Token Response Event Activity.
            await this.dialog.run(context, this.dialogState);

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }
}

module.exports.AuthBot = AuthBot;