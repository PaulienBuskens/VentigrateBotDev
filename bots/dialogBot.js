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


        this.onMessage(async (context, next) => {
            console.log('Running dialog with Message Activity.');

            // Run the Dialog with the new message Activity.
            if(context.activity.text.includes("@giphy")){
                await this.dialog.giphy(context, this.dialogState);

            } else if(context.activity.text.includes("@graphToken")){
                await this.dialog.graphToken(context, this.dialogState);

            } else if(context.activity.text.includes("@graphAdmin")){
                await this.dialog.graphAdmin(context, this.dialogState);

            } else if(context.activity.text.includes("@graphMe")){    
                await this.dialog.graphMe(context,this.dialogState);

            } else if(context.activity.text.includes("@graphEvents")){    
                await this.dialog.graphEvents(context,this.dialogState);

            } else if(context.activity.text.includes("@graphUser")){    
                await this.dialog.graphUser(context,this.dialogState);

            } else if(context.activity.text.includes("@quote")){    
                await this.dialog.quote(context,this.dialogState);

            } else if(context.activity.text.includes("@wheater")){    
                await this.dialog.weather(context,this.dialogState);

            } else if(context.activity.text.includes("@explain")){    
                await this.dialog.explain(context,this.dialogState);

            } else if(context.activity.text.includes("@joke")){    
                await this.dialog.joke(context,this.dialogState);

            } else if(context.activity.text.includes("@bored")){    
                await this.dialog.bored(context,this.dialogState);

            } else if(context.activity.text.includes("@graphTest")){    
                await this.dialog.graphTest(context,this.dialogState);

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