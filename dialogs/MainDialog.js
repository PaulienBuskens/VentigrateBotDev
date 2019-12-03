const { ChoicePrompt, DialogSet, DialogTurnStatus, OAuthPrompt, TextPrompt, WaterfallDialog } = require('botbuilder-dialogs');
const { LogoutDialog } = require('./logoutDialog');
const { OAuthHelpers } = require('../oAuthHelpers');
const { MessageFactory, CardFactory,TurnContext,ActivityHandler } = require('botbuilder');
const { SimpleGraphClient } = require('../simple-graph-client');


const MAIN_WATERFALL_DIALOG = 'mainWaterfallDialog';
const OAUTH_PROMPT = 'oAuthPrompt';
const CHOICE_PROMPT = 'choicePrompt';
const TEXT_PROMPT = 'textPrompt';

const { Client } = require('@microsoft/microsoft-graph-client');
const request = require("request");


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

    async graphToken(context,next, access_token){

        await context.sendActivity("AccesToken: ");
        await context.sendActivity(access_token);
        
    }

    async graphMe(context,next, access_token){
        const token = 'eyJ0eXAiOiJKV1QiLCJub25jZSI6IkItMWlWM3BzanRVNVduQ1kxem9IU0x2WXBqOWtuWVgwRHVHcHdRSVlCeFUiLCJhbGciOiJSUzI1NiIsIng1dCI6IkJCOENlRlZxeWFHckdOdWVoSklpTDRkZmp6dyIsImtpZCI6IkJCOENlRlZxeWFHckdOdWVoSklpTDRkZmp6dyJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9mYzY5OTY4Ny01MGNlLTRlNzItYjA5ZC0wZjJkOWM3YjcyNWMvIiwiaWF0IjoxNTc1Mzc1ODUwLCJuYmYiOjE1NzUzNzU4NTAsImV4cCI6MTU3NTM3OTc1MCwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFTUUEyLzhOQUFBQUZJRHFibmZ3a01VbCtWcGJHTm5mOFFwQXJlSGRZOXlMQXFEMGxWTnpOL0E9IiwiYW1yIjpbInB3ZCJdLCJhcHBfZGlzcGxheW5hbWUiOiJHcmFwaCBleHBsb3JlciIsImFwcGlkIjoiZGU4YmM4YjUtZDlmOS00OGIxLWE4YWQtYjc0OGRhNzI1MDY0IiwiYXBwaWRhY3IiOiIwIiwiZmFtaWx5X25hbWUiOiJCdXNrZW5zIiwiZ2l2ZW5fbmFtZSI6IlBhdWxpZW4iLCJpcGFkZHIiOiI5NC4xNDMuMTg5LjI0MyIsIm5hbWUiOiJQYXVsaWVuIEJ1c2tlbnMiLCJvaWQiOiI4M2YwNzY4YS1kYjM1LTRmYjctYTViZS05ZjEwODA3NzRhNjUiLCJwbGF0ZiI6IjMiLCJwdWlkIjoiMTAwMzIwMDA2NEQ1MzU5OSIsInNjcCI6IkFjY2Vzc1Jldmlldy5SZWFkLkFsbCBBY2Nlc3NSZXZpZXcuUmVhZFdyaXRlLkFsbCBBZ3JlZW1lbnQuUmVhZC5BbGwgQWdyZWVtZW50LlJlYWRXcml0ZS5BbGwgQWdyZWVtZW50QWNjZXB0YW5jZS5SZWFkIEFncmVlbWVudEFjY2VwdGFuY2UuUmVhZC5BbGwgQXBwQ2F0YWxvZy5SZWFkV3JpdGUuQWxsIEF1ZGl0TG9nLlJlYWQuQWxsIEJvb2tpbmdzLk1hbmFnZS5BbGwgQm9va2luZ3MuUmVhZC5BbGwgQm9va2luZ3MuUmVhZFdyaXRlLkFsbCBDYWxlbmRhcnMuUmVhZFdyaXRlIENvbnRhY3RzLlJlYWRXcml0ZSBGaWxlcy5SZWFkV3JpdGUuQWxsIEdyb3VwLlJlYWQuQWxsIEdyb3VwLlJlYWRXcml0ZS5BbGwgTWFpbC5SZWFkV3JpdGUgTm90ZXMuUmVhZFdyaXRlLkFsbCBvcGVuaWQgUGVvcGxlLlJlYWQgcHJvZmlsZSBTaXRlcy5SZWFkV3JpdGUuQWxsIFRhc2tzLlJlYWRXcml0ZSBVc2VyLlJlYWQgVXNlci5SZWFkQmFzaWMuQWxsIFVzZXIuUmVhZFdyaXRlIGVtYWlsIiwic3ViIjoiUy1wQkVqaDVjMkNYWXJDeDJBcXlQS2FxT1MwX1dOeWhGOW8yUWRsOVNKSSIsInRpZCI6ImZjNjk5Njg3LTUwY2UtNGU3Mi1iMDlkLTBmMmQ5YzdiNzI1YyIsInVuaXF1ZV9uYW1lIjoicGF1bGllbkB2ZW50aWdyYXRlZGV2Lm9ubWljcm9zb2Z0LmNvbSIsInVwbiI6InBhdWxpZW5AdmVudGlncmF0ZWRldi5vbm1pY3Jvc29mdC5jb20iLCJ1dGkiOiIwQUwxdENoU1RrYUo4WDNrMTNwUkFRIiwidmVyIjoiMS4wIiwid2lkcyI6WyI2MmU5MDM5NC02OWY1LTQyMzctOTE5MC0wMTIxNzcxNDVlMTAiXSwieG1zX3N0Ijp7InN1YiI6IlB4RmhhVEpPaTdSN29ERkU1T0NkSnpkYmhEbzhUeDdWSTBSU0E0aGRIVk0ifSwieG1zX3RjZHQiOjE1NDE3NTQ3OTB9.QaHP-BG4dWeYgagXDtBptQvGOrksXCXBbbh2n64VLM1T4sIY9sHOIk_8IEghRw9HXYvum180nCND3Qc40Fw2LULYb1NuplXCew4bVNe6ih_bCreJ2F9mZetx1JtJh_50OiLY29xUQGlvGuAIJxYeec0cI0NFAq93tHftxeTYEIZO0uig-GxNMf9-YGx1-WQtgzJbSV185I8QnFznmV4uXn0TTLr99JirsdZ3XUNFV0vtOATtBX0pRO54wpgbmvt7Ve3i9wdbP_vzW_dLULpxpfQpFb5npqh61JPyF-dmASdMGyOiFy6zKKXNzlL-Jq-ST8jLW0JU0ESos_Xwn4LC3w'
        await OAuthHelpers.listMe(context, token);
    }

    async graphMail(context,next, access_token){
        const token = 'eyJ0eXAiOiJKV1QiLCJub25jZSI6IkItMWlWM3BzanRVNVduQ1kxem9IU0x2WXBqOWtuWVgwRHVHcHdRSVlCeFUiLCJhbGciOiJSUzI1NiIsIng1dCI6IkJCOENlRlZxeWFHckdOdWVoSklpTDRkZmp6dyIsImtpZCI6IkJCOENlRlZxeWFHckdOdWVoSklpTDRkZmp6dyJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9mYzY5OTY4Ny01MGNlLTRlNzItYjA5ZC0wZjJkOWM3YjcyNWMvIiwiaWF0IjoxNTc1Mzc1ODUwLCJuYmYiOjE1NzUzNzU4NTAsImV4cCI6MTU3NTM3OTc1MCwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFTUUEyLzhOQUFBQUZJRHFibmZ3a01VbCtWcGJHTm5mOFFwQXJlSGRZOXlMQXFEMGxWTnpOL0E9IiwiYW1yIjpbInB3ZCJdLCJhcHBfZGlzcGxheW5hbWUiOiJHcmFwaCBleHBsb3JlciIsImFwcGlkIjoiZGU4YmM4YjUtZDlmOS00OGIxLWE4YWQtYjc0OGRhNzI1MDY0IiwiYXBwaWRhY3IiOiIwIiwiZmFtaWx5X25hbWUiOiJCdXNrZW5zIiwiZ2l2ZW5fbmFtZSI6IlBhdWxpZW4iLCJpcGFkZHIiOiI5NC4xNDMuMTg5LjI0MyIsIm5hbWUiOiJQYXVsaWVuIEJ1c2tlbnMiLCJvaWQiOiI4M2YwNzY4YS1kYjM1LTRmYjctYTViZS05ZjEwODA3NzRhNjUiLCJwbGF0ZiI6IjMiLCJwdWlkIjoiMTAwMzIwMDA2NEQ1MzU5OSIsInNjcCI6IkFjY2Vzc1Jldmlldy5SZWFkLkFsbCBBY2Nlc3NSZXZpZXcuUmVhZFdyaXRlLkFsbCBBZ3JlZW1lbnQuUmVhZC5BbGwgQWdyZWVtZW50LlJlYWRXcml0ZS5BbGwgQWdyZWVtZW50QWNjZXB0YW5jZS5SZWFkIEFncmVlbWVudEFjY2VwdGFuY2UuUmVhZC5BbGwgQXBwQ2F0YWxvZy5SZWFkV3JpdGUuQWxsIEF1ZGl0TG9nLlJlYWQuQWxsIEJvb2tpbmdzLk1hbmFnZS5BbGwgQm9va2luZ3MuUmVhZC5BbGwgQm9va2luZ3MuUmVhZFdyaXRlLkFsbCBDYWxlbmRhcnMuUmVhZFdyaXRlIENvbnRhY3RzLlJlYWRXcml0ZSBGaWxlcy5SZWFkV3JpdGUuQWxsIEdyb3VwLlJlYWQuQWxsIEdyb3VwLlJlYWRXcml0ZS5BbGwgTWFpbC5SZWFkV3JpdGUgTm90ZXMuUmVhZFdyaXRlLkFsbCBvcGVuaWQgUGVvcGxlLlJlYWQgcHJvZmlsZSBTaXRlcy5SZWFkV3JpdGUuQWxsIFRhc2tzLlJlYWRXcml0ZSBVc2VyLlJlYWQgVXNlci5SZWFkQmFzaWMuQWxsIFVzZXIuUmVhZFdyaXRlIGVtYWlsIiwic3ViIjoiUy1wQkVqaDVjMkNYWXJDeDJBcXlQS2FxT1MwX1dOeWhGOW8yUWRsOVNKSSIsInRpZCI6ImZjNjk5Njg3LTUwY2UtNGU3Mi1iMDlkLTBmMmQ5YzdiNzI1YyIsInVuaXF1ZV9uYW1lIjoicGF1bGllbkB2ZW50aWdyYXRlZGV2Lm9ubWljcm9zb2Z0LmNvbSIsInVwbiI6InBhdWxpZW5AdmVudGlncmF0ZWRldi5vbm1pY3Jvc29mdC5jb20iLCJ1dGkiOiIwQUwxdENoU1RrYUo4WDNrMTNwUkFRIiwidmVyIjoiMS4wIiwid2lkcyI6WyI2MmU5MDM5NC02OWY1LTQyMzctOTE5MC0wMTIxNzcxNDVlMTAiXSwieG1zX3N0Ijp7InN1YiI6IlB4RmhhVEpPaTdSN29ERkU1T0NkSnpkYmhEbzhUeDdWSTBSU0E0aGRIVk0ifSwieG1zX3RjZHQiOjE1NDE3NTQ3OTB9.QaHP-BG4dWeYgagXDtBptQvGOrksXCXBbbh2n64VLM1T4sIY9sHOIk_8IEghRw9HXYvum180nCND3Qc40Fw2LULYb1NuplXCew4bVNe6ih_bCreJ2F9mZetx1JtJh_50OiLY29xUQGlvGuAIJxYeec0cI0NFAq93tHftxeTYEIZO0uig-GxNMf9-YGx1-WQtgzJbSV185I8QnFznmV4uXn0TTLr99JirsdZ3XUNFV0vtOATtBX0pRO54wpgbmvt7Ve3i9wdbP_vzW_dLULpxpfQpFb5npqh61JPyF-dmASdMGyOiFy6zKKXNzlL-Jq-ST8jLW0JU0ESos_Xwn4LC3w'
        await OAuthHelpers.mail(context, token);
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