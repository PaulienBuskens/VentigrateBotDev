const { ActivityHandler } = require('botbuilder');

class DialogBot extends ActivityHandler {
    /**
     *
     * @param {ConversationState} conversationState
     * @param {UserState} userState
     * @param {Dialog} dialog
     */
    constructor(conversationState, userState, dialog) {
        super();
        if (!conversationState) throw new Error('[DialogBot]: Missing parameter. conversationState is required');
        if (!userState) throw new Error('[DialogBot]: Missing parameter. userState is required');
        if (!dialog) throw new Error('[DialogBot]: Missing parameter. dialog is required');

        this.conversationState = conversationState;
        this.userState = userState;
        this.dialog = dialog;
        this.dialogState = this.conversationState.createProperty('DialogState');

        const token = 'eyJ0eXAiOiJKV1QiLCJub25jZSI6Im5OZFFkSFVfM2RiNEt1S0RwM0dYUi0wdjREMjBiUjRKcUpNN0NMaVE4LTAiLCJhbGciOiJSUzI1NiIsIng1dCI6IkJCOENlRlZxeWFHckdOdWVoSklpTDRkZmp6dyIsImtpZCI6IkJCOENlRlZxeWFHckdOdWVoSklpTDRkZmp6dyJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9mYzY5OTY4Ny01MGNlLTRlNzItYjA5ZC0wZjJkOWM3YjcyNWMvIiwiaWF0IjoxNTc1NTM5OTE0LCJuYmYiOjE1NzU1Mzk5MTQsImV4cCI6MTU3NTU0MzgxNCwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFTUUEyLzhOQUFBQWxvTlFWd0FGZGF1NGNxaW1KNFBVMlJ5b0dNSzNrK0JLNmhna1hSakJFZlU9IiwiYW1yIjpbInB3ZCJdLCJhcHBfZGlzcGxheW5hbWUiOiJHcmFwaCBleHBsb3JlciIsImFwcGlkIjoiZGU4YmM4YjUtZDlmOS00OGIxLWE4YWQtYjc0OGRhNzI1MDY0IiwiYXBwaWRhY3IiOiIwIiwiZmFtaWx5X25hbWUiOiJCdXNrZW5zIiwiZ2l2ZW5fbmFtZSI6IlBhdWxpZW4iLCJpcGFkZHIiOiI5NC4xNDMuMTg5LjI0MiIsIm5hbWUiOiJQYXVsaWVuIEJ1c2tlbnMiLCJvaWQiOiI4M2YwNzY4YS1kYjM1LTRmYjctYTViZS05ZjEwODA3NzRhNjUiLCJwbGF0ZiI6IjMiLCJwdWlkIjoiMTAwMzIwMDA2NEQ1MzU5OSIsInNjcCI6IkFjY2Vzc1Jldmlldy5SZWFkLkFsbCBBY2Nlc3NSZXZpZXcuUmVhZFdyaXRlLkFsbCBBZ3JlZW1lbnQuUmVhZC5BbGwgQWdyZWVtZW50LlJlYWRXcml0ZS5BbGwgQWdyZWVtZW50QWNjZXB0YW5jZS5SZWFkIEFncmVlbWVudEFjY2VwdGFuY2UuUmVhZC5BbGwgQXBwQ2F0YWxvZy5SZWFkV3JpdGUuQWxsIEF1ZGl0TG9nLlJlYWQuQWxsIEJvb2tpbmdzLk1hbmFnZS5BbGwgQm9va2luZ3MuUmVhZC5BbGwgQm9va2luZ3MuUmVhZFdyaXRlLkFsbCBDYWxlbmRhcnMuUmVhZFdyaXRlIENvbnRhY3RzLlJlYWRXcml0ZSBGaWxlcy5SZWFkV3JpdGUuQWxsIEdyb3VwLlJlYWQuQWxsIEdyb3VwLlJlYWRXcml0ZS5BbGwgTWFpbC5SZWFkV3JpdGUgTm90ZXMuUmVhZFdyaXRlLkFsbCBvcGVuaWQgUGVvcGxlLlJlYWQgcHJvZmlsZSBTaXRlcy5SZWFkV3JpdGUuQWxsIFRhc2tzLlJlYWRXcml0ZSBVc2VyLlJlYWQgVXNlci5SZWFkQmFzaWMuQWxsIFVzZXIuUmVhZFdyaXRlIGVtYWlsIiwic3ViIjoiUy1wQkVqaDVjMkNYWXJDeDJBcXlQS2FxT1MwX1dOeWhGOW8yUWRsOVNKSSIsInRpZCI6ImZjNjk5Njg3LTUwY2UtNGU3Mi1iMDlkLTBmMmQ5YzdiNzI1YyIsInVuaXF1ZV9uYW1lIjoicGF1bGllbkB2ZW50aWdyYXRlZGV2Lm9ubWljcm9zb2Z0LmNvbSIsInVwbiI6InBhdWxpZW5AdmVudGlncmF0ZWRldi5vbm1pY3Jvc29mdC5jb20iLCJ1dGkiOiJ4Sk5FUm1jeE1rT0lncnZjeVk1X0FRIiwidmVyIjoiMS4wIiwid2lkcyI6WyI2MmU5MDM5NC02OWY1LTQyMzctOTE5MC0wMTIxNzcxNDVlMTAiXSwieG1zX3N0Ijp7InN1YiI6IlB4RmhhVEpPaTdSN29ERkU1T0NkSnpkYmhEbzhUeDdWSTBSU0E0aGRIVk0ifSwieG1zX3RjZHQiOjE1NDE3NTQ3OTB9.PP82elGeXxh17ZWMawiXN8XAzYfjmZPw_kYbr9XLuG-H7ty5TA75U6xkUU3Nz6gE4ZHyCZS0YxUPng8AbeGh6__RGQiaRAgihMxFzZMBGYZ3kbWalo8O5IOKFrBBQnrXyxt11EehLrDsV0X7W2htN0VWS3-E3sJjVpzBm4efvK8xTZzg_2OUw3qje7_Srk6Y7F7F5kpVzURHV0I0amhrk2BOMpGSKOGk5-FpWaI1eka4KcM1jOM2drSY4JAeUc16JXzYtt0UsjLc_sPbS8mLoK1vcEwtZaQ69tPlNBOkXMv0P1t7lTpcHplUxwk9AZpk0bmdiHoeU_jUZNsOzlqXng';


        this.onMessage(async (context, next) => {
            console.log('Running dialog with Message Activity.');

            // Run the Dialog with the new message Activity.
            if(context.activity.text.includes("@giphy")){
                await this.dialog.giphy(context, this.dialogState);

            } else if(context.activity.text.includes("@graphToken")){
                await this.dialog.graphToken(context, this.dialogState, token);

            } else if(context.activity.text.includes("@graphAdmin")){
                await this.dialog.graphMe(context, this.dialogState);

            } else if(context.activity.text.includes("@graphMail")){    
                await this.dialog.graphMail(context,this.dialogState, token);

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