const { ChoicePrompt, DialogSet, DialogTurnStatus, OAuthPrompt, TextPrompt, WaterfallDialog } = require('botbuilder-dialogs');
const { LogoutDialog } = require('./logoutDialog');
const { OAuthHelpers } = require('../oAuthHelpers');
const { MessageFactory, CardFactory,TurnContext,ActivityHandler } = require('botbuilder');

const MAIN_WATERFALL_DIALOG = 'mainWaterfallDialog';
const OAUTH_PROMPT = 'oAuthPrompt';
const CHOICE_PROMPT = 'choicePrompt';
const TEXT_PROMPT = 'textPrompt';


class MainDialog extends LogoutDialog {
    constructor() {
        super('MainDialog');
        
        this.addDialog(new ChoicePrompt(CHOICE_PROMPT))
            .addDialog(new OAuthPrompt(OAUTH_PROMPT, {
                connectionName: process.env.ConnectionName,
                text: 'Please login',
                title: 'Login',
                timeout: 300000
            }))
            .addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new WaterfallDialog(MAIN_WATERFALL_DIALOG, [
                this.promptStep.bind(this),
                this.loginStep.bind(this),
                this.commandStep.bind(this),
                this.processStep.bind(this)
            ]));

        this.initialDialogId = MAIN_WATERFALL_DIALOG;
    }

    /**
     * The run method handles the incoming activity (in the form of a TurnContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     * @param {*} turnContext
     * @param {*} accessor
     */
    async run(turnContext, accessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);

        const dialogContext = await dialogSet.createContext(turnContext);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
    }

    async giphy(context, next){
        
        var command = context.activity.text;
        var number = Math.floor(Math.random() * 19 ) + 1;
        var inputKeyword = command.replace("@giphy", "");

        const response = await fetch('http://api.giphy.com/v1/gifs/search?q="'+inputKeyword+'"&api_key=Kp5L1GFE5JwIpDrsrKtMxc3ATb8syTV4&limit=21');
        const myJson = await response.json();

        var id = myJson.data[number].id;

        var card = CardFactory.heroCard(
            '',
            ['https://media0.giphy.com/media/'+id+'/200.webp'],
        );

        const message = MessageFactory.attachment(card);
        await context.sendActivity(message);
    }

    async graph(context,next){
        const command = context.activity.text.replace("@graph","");
        const tokenResponse = 'eyJ0eXAiOiJKV1QiLCJub25jZSI6IjNGb0ZxLTVHU2lwVkJrVjJ0Si1GdDE1RjNjbEMtN2RIZjMwdmVTeDNlT1EiLCJhbGciOiJSUzI1NiIsIng1dCI6IkJCOENlRlZxeWFHckdOdWVoSklpTDRkZmp6dyIsImtpZCI6IkJCOENlRlZxeWFHckdOdWVoSklpTDRkZmp6dyJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9mYzY5OTY4Ny01MGNlLTRlNzItYjA5ZC0wZjJkOWM3YjcyNWMvIiwiaWF0IjoxNTc1Mjg3NTMxLCJuYmYiOjE1NzUyODc1MzEsImV4cCI6MTU3NTI5MTQzMSwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IjQyVmdZRkM0MDdyZ3NkdjY1SUs1ZTFobEJXSVgrSW9LYU1rSmxiejh3MzFGOExLdXp6b0EiLCJhbXIiOlsicHdkIl0sImFwcF9kaXNwbGF5bmFtZSI6IkdyYXBoIGV4cGxvcmVyIiwiYXBwaWQiOiJkZThiYzhiNS1kOWY5LTQ4YjEtYThhZC1iNzQ4ZGE3MjUwNjQiLCJhcHBpZGFjciI6IjAiLCJmYW1pbHlfbmFtZSI6IkJ1c2tlbnMiLCJnaXZlbl9uYW1lIjoiUGF1bGllbiIsImlwYWRkciI6Ijk0LjE0My4xODkuMjQyIiwibmFtZSI6IlBhdWxpZW4gQnVza2VucyIsIm9pZCI6IjgzZjA3NjhhLWRiMzUtNGZiNy1hNWJlLTlmMTA4MDc3NGE2NSIsInBsYXRmIjoiMyIsInB1aWQiOiIxMDAzMjAwMDY0RDUzNTk5Iiwic2NwIjoiQWNjZXNzUmV2aWV3LlJlYWQuQWxsIEFjY2Vzc1Jldmlldy5SZWFkV3JpdGUuQWxsIEFncmVlbWVudC5SZWFkLkFsbCBBZ3JlZW1lbnQuUmVhZFdyaXRlLkFsbCBBZ3JlZW1lbnRBY2NlcHRhbmNlLlJlYWQgQWdyZWVtZW50QWNjZXB0YW5jZS5SZWFkLkFsbCBBcHBDYXRhbG9nLlJlYWRXcml0ZS5BbGwgQXVkaXRMb2cuUmVhZC5BbGwgQm9va2luZ3MuTWFuYWdlLkFsbCBCb29raW5ncy5SZWFkLkFsbCBCb29raW5ncy5SZWFkV3JpdGUuQWxsIENhbGVuZGFycy5SZWFkV3JpdGUgQ29udGFjdHMuUmVhZFdyaXRlIEZpbGVzLlJlYWRXcml0ZS5BbGwgR3JvdXAuUmVhZC5BbGwgR3JvdXAuUmVhZFdyaXRlLkFsbCBNYWlsLlJlYWRXcml0ZSBOb3Rlcy5SZWFkV3JpdGUuQWxsIG9wZW5pZCBQZW9wbGUuUmVhZCBwcm9maWxlIFNpdGVzLlJlYWRXcml0ZS5BbGwgVGFza3MuUmVhZFdyaXRlIFVzZXIuUmVhZCBVc2VyLlJlYWRCYXNpYy5BbGwgVXNlci5SZWFkV3JpdGUgZW1haWwiLCJzdWIiOiJTLXBCRWpoNWMyQ1hZckN4MkFxeVBLYXFPUzBfV055aEY5bzJRZGw5U0pJIiwidGlkIjoiZmM2OTk2ODctNTBjZS00ZTcyLWIwOWQtMGYyZDljN2I3MjVjIiwidW5pcXVlX25hbWUiOiJwYXVsaWVuQHZlbnRpZ3JhdGVkZXYub25taWNyb3NvZnQuY29tIiwidXBuIjoicGF1bGllbkB2ZW50aWdyYXRlZGV2Lm9ubWljcm9zb2Z0LmNvbSIsInV0aSI6InJ4bC1mZnhQTjAtZ092ZDVibUFvQVEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbIjYyZTkwMzk0LTY5ZjUtNDIzNy05MTkwLTAxMjE3NzE0NWUxMCJdLCJ4bXNfc3QiOnsic3ViIjoiUHhGaGFUSk9pN1I3b0RGRTVPQ2RKemRiaERvOFR4N1ZJMFJTQTRoZEhWTSJ9LCJ4bXNfdGNkdCI6MTU0MTc1NDc5MH0.bnVMlOu5Su7tQiBocxZdzt7_i1lcbs9yHTegh9nuFrq5JERfyaudiABaHUFH0lrM_EOEW3if00YRUrqwUtzPoxrpuL_2ZIwAB7MD0w9Z1SiMkmrhdfJAcf7wwt1jl_RchGpezsB1PvjPPZC9_AmzV5gdz_2sBER82m13WgZlRySmOI6V-5DzBlXA4aV2hcW_wkNNURidSIujG6oePM4fkQo94GqQxc0K0rsVJmwsVQh2CWfl0qFNX34AdMK7s5B7hwGqOQiGDir7QT2LzKcPmV2Cjitap2I5fE7RH6nHG9ZUtZYIIkEdOq4inWEa6JEkr0l0hurn1XNaR1hZnc5xkw';

                    switch (command) {
                        case 'me':
                            await OAuthHelpers.listMe(step.context, tokenResponse);
                            break;
                        case 'recent':
                            await OAuthHelpers.listRecentMail(step.context, tokenResponse);
                            break;
                        case 'myemail':
                            await OAuthHelpers.myEmail(step.context,tokenResponse);
                            break;
                        default:
                            await step.context.sendActivity(`Your token is ${ tokenResponse.token }`);
                        }
    }

    async promptStep(step) {
        return step.beginDialog(OAUTH_PROMPT);
    }

    async loginStep(step) {
        // Get the token from the previous step. Note that we could also have gotten the
        // token directly from the prompt itself. There is an example of this in the next method.
        const tokenResponse = step.result;
        if (tokenResponse) {
            //await step.context.sendActivity('You are now logged in.');
            return await step.prompt(TEXT_PROMPT, { prompt: 'You are now logged in. What would you like to do?' });
        }
        await step.context.sendActivity('Login was not successful please try again.');
        return await step.endDialog();
    }

    async commandStep(step) {
        step.values.command = step.result;
        return await step.beginDialog(OAUTH_PROMPT);
    }

    async processStep(step) {
        if (step.result) {
            const tokenResponse = step.result;

            // If we have the token use the user is authenticated so we may use it to make API calls.
            if (tokenResponse && tokenResponse.token) {
               const command = step.values.command;

                
                    switch (command) {
                        case 'me':
                            await OAuthHelpers.listMe(step.context, tokenResponse);
                            break;
                        case 'recent':
                            await OAuthHelpers.listRecentMail(step.context, tokenResponse);
                            break;
                        case 'myemail':
                            await OAuthHelpers.myEmail(step.context,tokenResponse);
                            break;
                        default:
                            await step.context.sendActivity(`Your token is ${ tokenResponse.token }`);
                        }
            }
        } else {
            await step.context.sendActivity('We couldn\'t log you in. Please try again later.');
        }
        return await step.endDialog();
    }
}

module.exports.MainDialog = MainDialog;