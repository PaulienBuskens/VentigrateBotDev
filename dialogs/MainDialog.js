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
                            Authorization :  'eyJ0eXAiOiJKV1QiLCJub25jZSI6ImFxd2J1TTZ1bkxHS0Y2SWo0ZGZjVmpJZ1JMOWxVa3ZzSTJTMjdiZlp2TmsiLCJhbGciOiJSUzI1NiIsIng1dCI6IkJCOENlRlZxeWFHckdOdWVoSklpTDRkZmp6dyIsImtpZCI6IkJCOENlRlZxeWFHckdOdWVoSklpTDRkZmp6dyJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9mYzY5OTY4Ny01MGNlLTRlNzItYjA5ZC0wZjJkOWM3YjcyNWMvIiwiaWF0IjoxNTc1NTMwNzY4LCJuYmYiOjE1NzU1MzA3NjgsImV4cCI6MTU3NTUzNDY2OCwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IjQyVmdZTmo5MUg2Vi9vK0xyOWxrMmRjVkNWUW1MMnp2dW1IS1ZaVmgrRzJ5aFowQXV3SUEiLCJhbXIiOlsicHdkIl0sImFwcF9kaXNwbGF5bmFtZSI6IkdyYXBoIGV4cGxvcmVyIiwiYXBwaWQiOiJkZThiYzhiNS1kOWY5LTQ4YjEtYThhZC1iNzQ4ZGE3MjUwNjQiLCJhcHBpZGFjciI6IjAiLCJmYW1pbHlfbmFtZSI6IkJ1c2tlbnMiLCJnaXZlbl9uYW1lIjoiUGF1bGllbiIsImlwYWRkciI6Ijk0LjE0My4xODkuMjQyIiwibmFtZSI6IlBhdWxpZW4gQnVza2VucyIsIm9pZCI6IjgzZjA3NjhhLWRiMzUtNGZiNy1hNWJlLTlmMTA4MDc3NGE2NSIsInBsYXRmIjoiMyIsInB1aWQiOiIxMDAzMjAwMDY0RDUzNTk5Iiwic2NwIjoiQWNjZXNzUmV2aWV3LlJlYWQuQWxsIEFjY2Vzc1Jldmlldy5SZWFkV3JpdGUuQWxsIEFncmVlbWVudC5SZWFkLkFsbCBBZ3JlZW1lbnQuUmVhZFdyaXRlLkFsbCBBZ3JlZW1lbnRBY2NlcHRhbmNlLlJlYWQgQWdyZWVtZW50QWNjZXB0YW5jZS5SZWFkLkFsbCBBcHBDYXRhbG9nLlJlYWRXcml0ZS5BbGwgQXVkaXRMb2cuUmVhZC5BbGwgQm9va2luZ3MuTWFuYWdlLkFsbCBCb29raW5ncy5SZWFkLkFsbCBCb29raW5ncy5SZWFkV3JpdGUuQWxsIENhbGVuZGFycy5SZWFkV3JpdGUgQ29udGFjdHMuUmVhZFdyaXRlIEZpbGVzLlJlYWRXcml0ZS5BbGwgR3JvdXAuUmVhZC5BbGwgR3JvdXAuUmVhZFdyaXRlLkFsbCBNYWlsLlJlYWRXcml0ZSBOb3Rlcy5SZWFkV3JpdGUuQWxsIG9wZW5pZCBQZW9wbGUuUmVhZCBwcm9maWxlIFNpdGVzLlJlYWRXcml0ZS5BbGwgVGFza3MuUmVhZFdyaXRlIFVzZXIuUmVhZCBVc2VyLlJlYWRCYXNpYy5BbGwgVXNlci5SZWFkV3JpdGUgZW1haWwiLCJzdWIiOiJTLXBCRWpoNWMyQ1hZckN4MkFxeVBLYXFPUzBfV055aEY5bzJRZGw5U0pJIiwidGlkIjoiZmM2OTk2ODctNTBjZS00ZTcyLWIwOWQtMGYyZDljN2I3MjVjIiwidW5pcXVlX25hbWUiOiJwYXVsaWVuQHZlbnRpZ3JhdGVkZXYub25taWNyb3NvZnQuY29tIiwidXBuIjoicGF1bGllbkB2ZW50aWdyYXRlZGV2Lm9ubWljcm9zb2Z0LmNvbSIsInV0aSI6ImxpaEEzcGVIXzAyWnpIZDZBdm03QVEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbIjYyZTkwMzk0LTY5ZjUtNDIzNy05MTkwLTAxMjE3NzE0NWUxMCJdLCJ4bXNfc3QiOnsic3ViIjoiUHhGaGFUSk9pN1I3b0RGRTVPQ2RKemRiaERvOFR4N1ZJMFJTQTRoZEhWTSJ9LCJ4bXNfdGNkdCI6MTU0MTc1NDc5MH0.Hkg3NP2X-Sh7Ho_6SWjhYNovsYi0ivvpQR3CbEjaZB5TzSrwEVezGli_2gpTY1wqk-iSSAn_SVC4Z7uVfD_iSkIq923cKG-QuFl7zYogl1tPJ13hXdLbPDeYWzAm-IbH56fPji6RoHCwiPYs4NWgnmyp8SM5qhWPNtKL3UczEKU7S02JGR45aW5PQdQudlWh3nuF7kQERYG2goaJArAFp5FKpDjrO_aiRvfzBQjM8cn1fX0T1Ze3ZfoYu99rPll0u2jN-XmvwPW3r9vAKMJgeYcQeti628KzxJa2R_n0MoqhgrOpWllXlogRalj26BcIjsM0qD4Z2EP7dTSsD-a5GA'
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