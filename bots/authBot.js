const { DialogBot } = require('./dialogBot');
const request = require("request");

class AuthBot extends DialogBot {
    constructor(conversationState, userState, dialog) {
        super(conversationState, userState, dialog);

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            
            for (let cnt = 0; cnt < membersAdded.length; cnt++) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity('Welcome to the VentigrateBot. Type anything to get started.');
                     const teamDetails = await TeamsInfo.getTeamDetails(context);
                    if (teamDetails) {
                        await turnContext.sendActivity(`The group ID is: ${teamDetails.aadGroupId}`);
                    } else {
                        await turnContext.sendActivity('This message did not come from a channel in a team.');
                    }
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        this.onTokenResponseEvent(async (context, next) => {
            console.log('Running dialog with Token Response Event Activity.');

            // Run the Dialog with the new Token Response Event Activity.
            await this.dialog.run(context, this.dialogState);
            await next();
        });
    }
}

module.exports.AuthBot = AuthBot;

