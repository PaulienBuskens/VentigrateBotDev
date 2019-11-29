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
        const client = new SimpleGraphClient(tokenResponse.token);
        const me = await client.getMe();

        await context.sendActivity(`You are ${ me.displayName }.`);
    }

    /**
     * Displays information about the user in the bot.
     * @param {TurnContext} context A TurnContext instance containing all the data needed for processing this conversation turn.
     * @param {TokenResponse} tokenResponse A response that includes a user token.
     */
    static async myEmail(context, tokenResponse) {
        if (!context) {
            throw new Error('OAuthHelpers.myEmail(): `context` cannot be undefined.');
        }
        if (!tokenResponse) {
            throw new Error('OAuthHelpers.myEmail(): `tokenResponse` cannot be undefined.');
        }

        // Pull in the data from Microsoft Graph.
        const client = new SimpleGraphClient(tokenResponse.token);
        const me = await client.getEmail();

        await context.sendActivity(`Your email is ${ me.mail }.`);
    }


    /**
     * Lists the user's collected email.
     * @param {TurnContext} context A TurnContext instance containing all the data needed for processing this conversation turn.
     * @param {TokenResponse} tokenResponse A response that includes a user token.
     */
    static async listRecentMail(context, tokenResponse) {
        if (!context) {
            throw new Error('OAuthHelpers.listRecentMail(): `context` cannot be undefined.');
        }
        if (!tokenResponse) {
            throw new Error('OAuthHelpers.listRecentMail(): `tokenResponse` cannot be undefined.');
        }

        var client = new SimpleGraphClient(tokenResponse.token);
        var response = await client.getRecentMail();
        var messages = response.value;
        if (Array.isArray(messages)) {
            let numberOfMessages = messages.length;
            if (messages.length > 5) {
                numberOfMessages = 5;
            }

            const reply = { attachments: [], attachmentLayout: AttachmentLayoutTypes.Carousel };
            for (let cnt = 0; cnt < numberOfMessages; cnt++) {
                const mail = messages[cnt];
                const card = CardFactory.heroCard(
                    mail.subject,
                    mail.bodyPreview,
                    [{ alt: 'Outlook Logo', url: 'https://botframeworksamples.blob.core.windows.net/samples/OutlookLogo.jpg' }],
                    [],
                    { subtitle: `${ mail.from.emailAddress.name } <${ mail.from.emailAddress.address }>` }
                );
                reply.attachments.push(card);
            }
            await context.sendActivity(reply);
        } else {
            await context.sendActivity('Unable to find any recent unread mail.');
        }
    }
}

exports.OAuthHelpers = OAuthHelpers;