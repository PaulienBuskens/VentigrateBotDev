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

    async test(context, next){
        await context.sendActivity("testmethode");
        return next();
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

                if(command.includes('@giphy')){
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
                    await step.context.sendActivity(message);
                }else{
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
            }
        } else {
            await step.context.sendActivity('We couldn\'t log you in. Please try again later.');
        }

        return await step.endDialog();
        
    }
}

module.exports.MainDialog = MainDialog;