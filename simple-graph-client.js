const { Client } = require('@microsoft/microsoft-graph-client');

/**
 * This class is a wrapper for the Microsoft Graph API.
 * See: https://developer.microsoft.com/en-us/graph for more information.
 */
class SimpleGraphClient {
    constructor(token) {
        if (!token || !token.trim()) {
            throw new Error('SimpleGraphClient: Invalid token received.');
        }

        this._token = token;

        // Get an Authenticated Microsoft Graph client using the token issued to the user.
        this.graphClient = Client.init({
            authProvider: (done) => {
                done(null, this._token); // First parameter takes an error if you can't get an access token.
            }
        });
    }

    /**
     * Gets recent mail the user has received within the last hour and displays up to 5 of the emails in the bot.
     */
    async getRecentMail() {
        return await this.graphClient
            .api('/me/messages')
            .version('beta')
            .top(5)
            .get().then((res) => {
                return res;
            });
    }

    /**
     * Collects information about the user in the bot.
     */
    async getMe() {
        return await this.graphClient
            .api('/me')
            .get().then((res) => {
                return res;
            });
    }
    
    async getMail() {
        return await this.graphClient
            .api('/me/mail')
            .get().then((res) => {
                return res;
            });
    }

    /**
     * Collects information about the user in the bot.
     */
    async getEmail() {
        return await this.graphClient
            .api('/me')
            .select('mail')
            .get().then((res) => {
                return res;
            });
    }

    /**
     * Collects the user's manager in the bot.
     */
    async getManager() {
        return await this.graphClient
            .api('/me/manager')
            .version('beta')
            .select('displayName')
            .get().then((res) => {
                return res;
            });
    }
}

exports.SimpleGraphClient = SimpleGraphClient;