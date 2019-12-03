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

                    const endpoint = "https://login.microsoftonline.com/common/oauth2/token";
                    const requestParams = {
                        grant_type: "client_credentials",
                        client_id: "e414d507-6c1d-4b7c-baa4-b0b8834e6d9c",
                        client_secret: "+_#7mr=h:MTNo!a2YaR%0Pi8bD89PxT",
                        resource: "https://graph.microsoft.com"
                    };
                    var access_tokenGraph = "Getting Token";
                    var running = true

                    request.post({ url:endpoint, form: requestParams }, function (err, response, body) {
                        if (err) {
                            console.log("error");
                        }else {
                            console.log("Body=" + body);
                            let parsedBody = JSON.parse(body);         
                            if (parsedBody.error_description) {
                                console.log("Error=" + parsedBody.error_description);
                            } else {
                                console.log("Access Token=" + parsedBody.access_token);
                    
                                return this.access_tokenGraph = parsedBody.access_token;
                            }
                        }
                    });

                     while(running){
                         await context.sendActivity(this.access_tokenGraph);
                         if(this.access_tokenGraph != "Getting Token"){
                            await context.sendActivity(this.access_tokenGraph);
                            running = false;
                            await next(this.access_tokenGraph);
                         }
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