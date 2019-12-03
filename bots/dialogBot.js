const { ActivityHandler } = require('botbuilder');

class DialogBot extends ActivityHandler {
    /**
     *
     * @param {ConversationState} conversationState
     * @param {UserState} userState
     * @param {Dialog} dialog
     */
    constructor(conversationState, userState, dialog, access_tokenGraph) {
        super();
        if (!conversationState) throw new Error('[DialogBot]: Missing parameter. conversationState is required');
        if (!userState) throw new Error('[DialogBot]: Missing parameter. userState is required');
        if (!dialog) throw new Error('[DialogBot]: Missing parameter. dialog is required');

        this.conversationState = conversationState;
        this.userState = userState;
        this.dialog = dialog;
        this.dialogState = this.conversationState.createProperty('DialogState');

        const token = 'eyJ0eXAiOiJKV1QiLCJub25jZSI6ImhFYzNpbGJkd0hhR2FuanlXRG5pVWZ3WU1DaXpRdHlvZzItTGlkZ0pXTGsiLCJhbGciOiJSUzI1NiIsIng1dCI6IkJCOENlRlZxeWFHckdOdWVoSklpTDRkZmp6dyIsImtpZCI6IkJCOENlRlZxeWFHckdOdWVoSklpTDRkZmp6dyJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9mYzY5OTY4Ny01MGNlLTRlNzItYjA5ZC0wZjJkOWM3YjcyNWMvIiwiaWF0IjoxNTc1Mzc3NzMxLCJuYmYiOjE1NzUzNzc3MzEsImV4cCI6MTU3NTM4MTYzMSwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IjQyVmdZQkMwbkNUb3N1dGtzV1JWaUdlSFYyaDRjdGZNdGZHcmhIbFpWbkQyQ2J6L3NSTUEiLCJhbXIiOlsicHdkIl0sImFwcF9kaXNwbGF5bmFtZSI6IkdyYXBoIGV4cGxvcmVyIiwiYXBwaWQiOiJkZThiYzhiNS1kOWY5LTQ4YjEtYThhZC1iNzQ4ZGE3MjUwNjQiLCJhcHBpZGFjciI6IjAiLCJmYW1pbHlfbmFtZSI6IkJ1c2tlbnMiLCJnaXZlbl9uYW1lIjoiUGF1bGllbiIsImlwYWRkciI6Ijk0LjE0My4xODkuMjQzIiwibmFtZSI6IlBhdWxpZW4gQnVza2VucyIsIm9pZCI6IjgzZjA3NjhhLWRiMzUtNGZiNy1hNWJlLTlmMTA4MDc3NGE2NSIsInBsYXRmIjoiMyIsInB1aWQiOiIxMDAzMjAwMDY0RDUzNTk5Iiwic2NwIjoiQWNjZXNzUmV2aWV3LlJlYWQuQWxsIEFjY2Vzc1Jldmlldy5SZWFkV3JpdGUuQWxsIEFncmVlbWVudC5SZWFkLkFsbCBBZ3JlZW1lbnQuUmVhZFdyaXRlLkFsbCBBZ3JlZW1lbnRBY2NlcHRhbmNlLlJlYWQgQWdyZWVtZW50QWNjZXB0YW5jZS5SZWFkLkFsbCBBcHBDYXRhbG9nLlJlYWRXcml0ZS5BbGwgQXVkaXRMb2cuUmVhZC5BbGwgQm9va2luZ3MuTWFuYWdlLkFsbCBCb29raW5ncy5SZWFkLkFsbCBCb29raW5ncy5SZWFkV3JpdGUuQWxsIENhbGVuZGFycy5SZWFkV3JpdGUgQ29udGFjdHMuUmVhZFdyaXRlIEZpbGVzLlJlYWRXcml0ZS5BbGwgR3JvdXAuUmVhZC5BbGwgR3JvdXAuUmVhZFdyaXRlLkFsbCBNYWlsLlJlYWRXcml0ZSBOb3Rlcy5SZWFkV3JpdGUuQWxsIG9wZW5pZCBQZW9wbGUuUmVhZCBwcm9maWxlIFNpdGVzLlJlYWRXcml0ZS5BbGwgVGFza3MuUmVhZFdyaXRlIFVzZXIuUmVhZCBVc2VyLlJlYWRCYXNpYy5BbGwgVXNlci5SZWFkV3JpdGUgZW1haWwiLCJzdWIiOiJTLXBCRWpoNWMyQ1hZckN4MkFxeVBLYXFPUzBfV055aEY5bzJRZGw5U0pJIiwidGlkIjoiZmM2OTk2ODctNTBjZS00ZTcyLWIwOWQtMGYyZDljN2I3MjVjIiwidW5pcXVlX25hbWUiOiJwYXVsaWVuQHZlbnRpZ3JhdGVkZXYub25taWNyb3NvZnQuY29tIiwidXBuIjoicGF1bGllbkB2ZW50aWdyYXRlZGV2Lm9ubWljcm9zb2Z0LmNvbSIsInV0aSI6IlUzNUFDOTNnR0Vpc0RqRXBqd3BwQVEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbIjYyZTkwMzk0LTY5ZjUtNDIzNy05MTkwLTAxMjE3NzE0NWUxMCJdLCJ4bXNfc3QiOnsic3ViIjoiUHhGaGFUSk9pN1I3b0RGRTVPQ2RKemRiaERvOFR4N1ZJMFJTQTRoZEhWTSJ9LCJ4bXNfdGNkdCI6MTU0MTc1NDc5MH0.btlFAS_KaGLBzo_f1JQ_QjWkdVW-Sl6kuAvbBFhLZJHpu-xQX3M02IrUWHStimaojDNxIpiNoNU4cc57FQke1fZz7nTguScqRzuFSGsJ6H2VDI4FpLAK4WfEOcA3lkOVJer7VhY9joXvwTiPIoFUBQA0w9-U_f-ecwfm3oyht7LsrLl1t3n067WL4J2CFrvtuCzXSjsvEHqqZcWOiIYU0t3xtA77d0tljs2fhrq2bPBSOZtEv-eu5Cvb0aBOoo7V--VZzewcULDXMD7__Vr5sy8nKN9SnXzl92_ICfcAdCxh_BqE2xocKmsQjs5d7TmuEEWN-AVyVWPrC2zw3RKxow';


        this.onMessage(async (context, next) => {
            console.log('Running dialog with Message Activity.');


            // Run the Dialog with the new message Activity.
            if(context.activity.text.includes("@giphy")){
                await this.dialog.giphy(context, this.dialogState);

            } else if(context.activity.text.includes("@graphToken")){
                await this.dialog.graphToken(context, this.dialogState, token);

            } else if(context.activity.text.includes("@graphMe")){
                await this.dialog.graphMe(context, this.dialogState, token);

            } else if(context.activity.text.includes("@graphMail")){    
                await this.dialog.graphMail(context,this.dialogState);

            } else if(context.activity.text.includes("@cookie")){    
                await this.dialog.cookie(context,this.dialogState);
            }else{
                await this.dialog.run(context, this.dialogState);
            }
            

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        this.onDialog(async (context, next) => {
            // Save any state changes. The load happened during the execution of the Dialog.
            await this.conversationState.saveChanges(context, false);
            await this.userState.saveChanges(context, false);

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }
}

module.exports.DialogBot = DialogBot;