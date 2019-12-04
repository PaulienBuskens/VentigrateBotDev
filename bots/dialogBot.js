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

        const token = 'eyJ0eXAiOiJKV1QiLCJub25jZSI6IlBocTMtNXRYY0JJUzJFU0gtXzZXM19aZFFHYTlNOEp0UW9ETUlJZU9pekUiLCJhbGciOiJSUzI1NiIsIng1dCI6IkJCOENlRlZxeWFHckdOdWVoSklpTDRkZmp6dyIsImtpZCI6IkJCOENlRlZxeWFHckdOdWVoSklpTDRkZmp6dyJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9mYzY5OTY4Ny01MGNlLTRlNzItYjA5ZC0wZjJkOWM3YjcyNWMvIiwiaWF0IjoxNTc1NDUyNzk3LCJuYmYiOjE1NzU0NTI3OTcsImV4cCI6MTU3NTQ1NjY5NywiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IjQyVmdZT0FzMVcrVlduS1hLekVwWnhwYjRPYmQza3FYMmNRNTFqeGJrOXkrS1RkMTFXNEEiLCJhbXIiOlsicHdkIl0sImFwcF9kaXNwbGF5bmFtZSI6IkdyYXBoIGV4cGxvcmVyIiwiYXBwaWQiOiJkZThiYzhiNS1kOWY5LTQ4YjEtYThhZC1iNzQ4ZGE3MjUwNjQiLCJhcHBpZGFjciI6IjAiLCJmYW1pbHlfbmFtZSI6IkJ1c2tlbnMiLCJnaXZlbl9uYW1lIjoiUGF1bGllbiIsImlwYWRkciI6Ijk0LjExMS4xMDkuMjI4IiwibmFtZSI6IlBhdWxpZW4gQnVza2VucyIsIm9pZCI6IjgzZjA3NjhhLWRiMzUtNGZiNy1hNWJlLTlmMTA4MDc3NGE2NSIsInBsYXRmIjoiMyIsInB1aWQiOiIxMDAzMjAwMDY0RDUzNTk5Iiwic2NwIjoiQWNjZXNzUmV2aWV3LlJlYWQuQWxsIEFjY2Vzc1Jldmlldy5SZWFkV3JpdGUuQWxsIEFncmVlbWVudC5SZWFkLkFsbCBBZ3JlZW1lbnQuUmVhZFdyaXRlLkFsbCBBZ3JlZW1lbnRBY2NlcHRhbmNlLlJlYWQgQWdyZWVtZW50QWNjZXB0YW5jZS5SZWFkLkFsbCBBcHBDYXRhbG9nLlJlYWRXcml0ZS5BbGwgQXVkaXRMb2cuUmVhZC5BbGwgQm9va2luZ3MuTWFuYWdlLkFsbCBCb29raW5ncy5SZWFkLkFsbCBCb29raW5ncy5SZWFkV3JpdGUuQWxsIENhbGVuZGFycy5SZWFkV3JpdGUgQ29udGFjdHMuUmVhZFdyaXRlIEZpbGVzLlJlYWRXcml0ZS5BbGwgR3JvdXAuUmVhZC5BbGwgR3JvdXAuUmVhZFdyaXRlLkFsbCBNYWlsLlJlYWRXcml0ZSBOb3Rlcy5SZWFkV3JpdGUuQWxsIG9wZW5pZCBQZW9wbGUuUmVhZCBwcm9maWxlIFNpdGVzLlJlYWRXcml0ZS5BbGwgVGFza3MuUmVhZFdyaXRlIFVzZXIuUmVhZCBVc2VyLlJlYWRCYXNpYy5BbGwgVXNlci5SZWFkV3JpdGUgZW1haWwiLCJzdWIiOiJTLXBCRWpoNWMyQ1hZckN4MkFxeVBLYXFPUzBfV055aEY5bzJRZGw5U0pJIiwidGlkIjoiZmM2OTk2ODctNTBjZS00ZTcyLWIwOWQtMGYyZDljN2I3MjVjIiwidW5pcXVlX25hbWUiOiJwYXVsaWVuQHZlbnRpZ3JhdGVkZXYub25taWNyb3NvZnQuY29tIiwidXBuIjoicGF1bGllbkB2ZW50aWdyYXRlZGV2Lm9ubWljcm9zb2Z0LmNvbSIsInV0aSI6Ikt3VHdvaV95UlVXZW50UlhDNDkyQVEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbIjYyZTkwMzk0LTY5ZjUtNDIzNy05MTkwLTAxMjE3NzE0NWUxMCJdLCJ4bXNfc3QiOnsic3ViIjoiUHhGaGFUSk9pN1I3b0RGRTVPQ2RKemRiaERvOFR4N1ZJMFJTQTRoZEhWTSJ9LCJ4bXNfdGNkdCI6MTU0MTc1NDc5MH0.Jemi5RSWOCaZdiPwVOPICOzReLqq5ZMLyZ9bTQ3MHj-HdwjKbTGafW_X-Ffv2MpawnwH4DYJKzaiDatuJ3nfnqhIEziYxDEgSx449ilqHXyrAAKsxUCkhNlicuRo3FP0YQTjpiVMHoimPWgiMLQb1eZnSI37BeqYRezDjkigC_J_G3Azu6TCMWCj6HZIpdZ09vTr7GyHS9n3VBXnRgTPRqcmSGDA0FZeY3x9MrYYS3g1QhLTWBTtrP_MAEwAziRW6OfeMoJPT97tXecI7Z2rmrFbCnozQrT8l-hTlkfi91P12moa5Xd-Mum64HoY9F4asevUpWSF48RQNB2t3_Fr8w';


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
                await this.dialog.graphMail(context,this.dialogState, token);

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