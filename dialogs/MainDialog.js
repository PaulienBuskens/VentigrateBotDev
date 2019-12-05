const { ChoicePrompt, DialogSet, DialogTurnStatus, OAuthPrompt, TextPrompt, WaterfallDialog } = require('botbuilder-dialogs');
const { LogoutDialog } = require('./logoutDialog');
const { OAuthHelpers } = require('../oAuthHelpers');
const { MessageFactory, CardFactory,TurnContext,ActivityHandler } = require('botbuilder');
const { SimpleGraphClient } = require('../simple-graph-client');


const { Client } = require('@microsoft/microsoft-graph-client');
const request = require("request");


class MainDialog extends LogoutDialog {
    constructor() {
        super('MainDialog');
        
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

                    access_tokenGraph = parsedBody.access_token;


                    var options = {
                        url: 'https://graph.microsoft.com/v1.0/me/',
                        headers: {
                            Authorization : access_tokenGraph
                        }
                    };
 
                    function callback(error, response, body) {
                        if (!error && response.statusCode == 200) {
                            var info = JSON.parse(body);
                            console.log("graphcall")
                            console.log(info);
                        } else{
                            console.log("else loop");
                            console.log(body);
                        }
                    }
 
                    request(options, callback);

                    return access_tokenGraph = parsedBody.access_token;
                }
            }
        });


        while(running){
            await context.sendActivity(access_tokenGraph);
            if(this.access_tokenGraph != "Getting Token"){
                await context.sendActivity(access_tokenGraph);
                running = false;
            }
        }
        
    }

    async graphMe(context,next){
        const APP_ID = 'e414d507-6c1d-4b7c-baa4-b0b8834e6d9c';
        const APP_SECERET = '+_#7mr=h:MTNo!a2YaR%0Pi8bD89PxT';
        const TOKEN_ENDPOINT ='https://login.microsoftonline.com/common/oauth2/v2.0/token';
        const MS_GRAPH_SCOPE = 'https://graph.microsoft.com/';

        const axios = require('axios');
        const qs = require('qs');

        const postData = {
            client_id: APP_ID,
            scope: MS_GRAPH_SCOPE,
            client_secret: APP_SECERET,
            grant_type: 'client_credentials'
        };

        axios.defaults.headers.post['Content-Type'] =
            'application/x-www-form-urlencoded';

        let token = 'getting Token';
        var running = true;

        axios
            .post(TOKEN_ENDPOINT, qs.stringify(postData))
            .then(response => {
                console.log(response.data);
                console.log(response.data.access_token);
                return token = response.data.access_token;
            })
            .catch(error => {
                console.log(error);
            });

        while(running){
             await context.sendActivity(token);
             if(this.access_tokenGraph != "Getting Token"){
                await context.sendActivity(token);
               // await OAuthHelpers.listMe(context, token);
                running = false;
            }
        }
        
    }

    async cookie(context,next){
        await context.sendActivity("set cookie");
    }

    async graphMail(context,next,token){
        await OAuthHelpers.mail(context, token);
    }

}

module.exports.MainDialog = MainDialog;