const { AttachmentLayoutTypes, CardFactory } = require('botbuilder');
const { SimpleGraphClient } = require('./simple-graph-client');

class OAuthHelpers {

    /**
     * Displays information about the user in the bot.
     * @param {TurnContext} context A TurnContext instance containing all the data needed for processing this conversation turn.
     * @param {TokenResponse} tokenResponse A response that includes a user token.
     */
    static async listMe(context, tokenResponse) {
        if (!context) {
            throw new Error('OAuthHelpers.listMe(): `context` cannot be undefined.');
        }
        if (!tokenResponse) {
            throw new Error('OAuthHelpers.listMe(): `tokenResponse` cannot be undefined.');
        }

        // Pull in the data from Microsoft Graph.
        //const client = new SimpleGraphClient(tokenResponse.token);
        const client = new SimpleGraphClient(tokenResponse);
        const me = await client.getMe();

        await context.sendActivity(`You are ${ me.displayName }.`);
    }

    /**
     * Displays information about the user in the bot.
     * @param {TurnContext} context A TurnContext instance containing all the data needed for processing this conversation turn.
     * @param {TokenResponse} tokenResponse A response that includes a user token.
     */
    static async mail(context, tokenResponse) {
        if (!context) {
            throw new Error('OAuthHelpers.listMe(): `context` cannot be undefined.');
        }
        if (!tokenResponse) {
            throw new Error('OAuthHelpers.listMe(): `tokenResponse` cannot be undefined.');
        }

        // Pull in the data from Microsoft Graph.
        //const client = new SimpleGraphClient(tokenResponse.token);
        const client = new SimpleGraphClient(tokenResponse);
        const me = await client.getMe();

        await context.sendActivity(`You are ${ me.mail }.`);
    }


}

exports.OAuthHelpers = OAuthHelpers;