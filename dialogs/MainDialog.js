const { MessageFactory, CardFactory,TurnContext,ActivityHandler } = require('botbuilder');

const request = require("request");

class MainDialog {


    async run(context, next) {

        await context.sendActivity("HELP MENU:");
        await context.sendActivity("- For a giphy '@giphy + subject giphy'."); 
        await context.sendActivity("- For the graph token '@graphToken'. ");
        await context.sendActivity("- For the admin name en email '@graphAdmin'.");
        await context.sendActivity("- For the your name en email '@graphMe'.");
        await context.sendActivity("- For the your upcomming events '@graphEvents'.");
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

    async graphToken(context,next){

        const endpoint = "https://login.microsoftonline.com/fc699687-50ce-4e72-b09d-0f2d9c7b725c/oauth2/token";
        const requestParams = {
            grant_type: "client_credentials",
            client_id: "e414d507-6c1d-4b7c-baa4-b0b8834e6d9c",
            client_secret: "+_#7mr=h:MTNo!a2YaR%0Pi8bD89PxT",
            resource: "https://graph.microsoft.com"
        };
        var access_tokenGraph = "Getting Token";
        var displayName = "...";
        var mail = "...";
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
                        url: 'https://graph.microsoft.com/v1.0/users?$top=1',
                        headers: {
                            Authorization : access_tokenGraph
                        }
                    };
 
                    function callback(error, response, body) {
                        if (!error && response.statusCode == 200) {
                            var info = JSON.parse(body);
                            console.log("graphcall")
                            console.log(info);
                            console.log(info.value[0].displayName);
                            console.log(info.value[0].mail);
                            displayName = info.value[0].displayName;
                            mail = info.value[0].mail;
                        } else{
                            console.log("else loop");
                            console.log(body);
                        }
                    }
 
                    request(options, callback);

                    return {
                        access_tokenGraph: access_tokenGraph
                    }

                }
            }
        });


        while(running){
            await context.sendActivity(access_tokenGraph);
            if(access_tokenGraph != "Getting Token"){
                await context.sendActivity(access_tokenGraph);
                running = false;
            }
        }
        
    }

    async graphAdmin(context,next){
        const endpoint = "https://login.microsoftonline.com/fc699687-50ce-4e72-b09d-0f2d9c7b725c/oauth2/token";
        const requestParams = {
            grant_type: "client_credentials",
            client_id: "e414d507-6c1d-4b7c-baa4-b0b8834e6d9c",
            client_secret: "+_#7mr=h:MTNo!a2YaR%0Pi8bD89PxT",
            resource: "https://graph.microsoft.com"
        };
        var access_tokenGraph = "Getting Data";
        var displayName = "...";
        var mail = "...";
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
                        url: 'https://graph.microsoft.com/v1.0/users?$top=1',
                        headers: {
                            Authorization : access_tokenGraph
                        }
                    };
 
                    function callback(error, response, body) {
                        if (!error && response.statusCode == 200) {
                            var info = JSON.parse(body);
                            console.log("graphcall")
                            console.log(info);
                            console.log(info.value[0].displayName);
                            console.log(info.value[0].mail);
                            displayName = info.value[0].displayName;
                            mail = info.value[0].mail;

                        } else{
                            console.log("else loop");
                            console.log(body);
                        }
                    }
 
                    request(options, callback);

                    return {
                        access_tokenGraph: access_tokenGraph,
                        displayName: displayName,
                        mail: mail
                    }

                }
            }
        });


        while(running){
           await context.sendActivity("getting data");
            if(displayName != "..."){
               // await context.sendActivity(access_tokenGraph);
                await context.sendActivity(displayName);
                await context.sendActivity(mail);
                running = false;
            }
        }
        
    }

    async graphMe(context,next){
        const endpoint = "https://login.microsoftonline.com/fc699687-50ce-4e72-b09d-0f2d9c7b725c/oauth2/token";
        const requestParams = {
            grant_type: "client_credentials",
            client_id: "e414d507-6c1d-4b7c-baa4-b0b8834e6d9c",
            client_secret: "+_#7mr=h:MTNo!a2YaR%0Pi8bD89PxT",
            resource: "https://graph.microsoft.com"
        };
        var access_tokenGraph = "Getting Data";
        var displayName = "...";
        var mail = "...";
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
                        url: "https://graph.microsoft.com/v1.0/users?$filter=displayName eq 'Paulien Buskens'",
                        headers: {
                            Authorization : access_tokenGraph
                        }
                    };
 
                    function callback(error, response, body) {
                        if (!error && response.statusCode == 200) {
                            var info = JSON.parse(body);
                            console.log("graphcall")
                            console.log(info);
                            console.log(info.value[0].displayName);
                            console.log(info.value[0].userPrincipalName);
                            displayName = info.value[0].displayName;
                            mail = info.value[0].userPrincipalName;

                        } else{
                            console.log("else loop");
                            console.log(body);
                        }
                    }
 
                    request(options, callback);

                    return {
                        access_tokenGraph: access_tokenGraph,
                        displayName: displayName,
                        mail: mail
                    }

                }
            }
        });


        while(running){
          await context.sendActivity("getting data");
            if(displayName != "..."){
                await context.sendActivity(displayName);
                await context.sendActivity(mail);
                running = false;
            }
        }
    }

    async graphEvents(context,next){
        const endpoint = "https://login.microsoftonline.com/fc699687-50ce-4e72-b09d-0f2d9c7b725c/oauth2/token";
        const requestParams = {
            grant_type: "client_credentials",
            client_id: "e414d507-6c1d-4b7c-baa4-b0b8834e6d9c",
            client_secret: "+_#7mr=h:MTNo!a2YaR%0Pi8bD89PxT",
            resource: "https://graph.microsoft.com"
        };
        var access_tokenGraph = "Getting Data";
        var subject = "...";
        var dateTime = "...";
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
                        url: "https://graph.microsoft.com/v1.0/users/paulien@ventigratedev.onmicrosoft.com/events",
                        headers: {
                            Authorization : access_tokenGraph
                        }
                    };
 
                    function callback(error, response, body) {
                        if (!error && response.statusCode == 200) {
                            var info = JSON.parse(body);
                            console.log("graphcall")
                            console.log(info);
                            console.log(info.value[0].subject);
                            console.log(info.value[0].start.dateTime);
                            subject = info.value[0].subject;
                            dateTime = info.value[0].dateTime;

                        } else{
                            console.log("else loop");
                            console.log(body);
                        }
                    }
 
                    request(options, callback);

                    return {
                        access_tokenGraph: access_tokenGraph,
                        subject: subject,
                        dateTime: dateTime
                    }

                }
            }
        });


        while(running){
           await context.sendActivity(access_tokenGraph);
            if(access_tokenGraph != "Getting Data"){
                await context.sendActivity(subject);
                await context.sendActivity(dateTime);
                running = false;
            }
        }
    }

    async graphUser(context,next){
        const endpoint = "https://login.microsoftonline.com/fc699687-50ce-4e72-b09d-0f2d9c7b725c/oauth2/token";
        const requestParams = {
            grant_type: "client_credentials",
            client_id: "e414d507-6c1d-4b7c-baa4-b0b8834e6d9c",
            client_secret: "+_#7mr=h:MTNo!a2YaR%0Pi8bD89PxT",
            resource: "https://graph.microsoft.com"
        };
        var access_tokenGraph = "Getting Data";
        var displayName = "...";
        var mail = "...";
        var running = true

        request.post({ url:endpoint, form: requestParams }, function (err, response, body) {
            if (err) {
                console.log("error");
            }else {
                //console.log("Body=" + body);
                let parsedBody = JSON.parse(body);         
                if (parsedBody.error_description) {
                    console.log("Error=" + parsedBody.error_description);
                } else {
                    //console.log("Access Token=" + parsedBody.access_token);  

                    access_tokenGraph = parsedBody.access_token;


                    var options = {
                        url: "https://graph.microsoft.com/v1.0/me",
                        headers: {
                            Authorization : access_tokenGraph
                        }
                    };
 
                    function callback(error, response, body) {
                        if (!error && response.statusCode == 200) {
                            var info = JSON.parse(body);
                            console.log("graphcall")
                            console.log(info);
                            // console.log(info.value[0].displayName);
                            // console.log(info.value[0].userPrincipalName);
                            // displayName = info.value[0].displayName;
                            // mail = info.value[0].userPrincipalName;

                        } else{
                            console.log("else loop");
                            console.log(body);
                        }
                    }
 
                    request(options, callback);

                    return {
                        access_tokenGraph: parsedBody.access_token,
                        // subject: subject,
                        // dateTime: dateTime
                    }

                }
            }
        });


        while(running){
           await context.sendActivity(access_tokenGraph);
            if(access_tokenGraph != "Getting Data"){
                 await context.sendActivity(displayName);
                 await context.sendActivity(mail);
                running = false;
            }
        }
        
    }



    /*
    
    Message in a channel
    all my planner tasks
    
     */

}

module.exports.MainDialog = MainDialog;