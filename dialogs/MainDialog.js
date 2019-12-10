const { MessageFactory, CardFactory,TurnContext,ActivityHandler } = require('botbuilder');

const request = require("request");
var Owlbot = require('owlbot-js');

class MainDialog {


    async run(context, next) {

        await context.sendActivity("HELP MENU:");
        await context.sendActivity("- For a giphy '@giphy + subject giphy'."); 
        await context.sendActivity("- For the graph token '@graphToken'. ");
        await context.sendActivity("- For the admin name en email '@graphAdmin'.");
        await context.sendActivity("- For the your name en email '@graphMe'.");
        await context.sendActivity("- For the your upcomming events '@graphEvents'.");
        await context.sendActivity("- For a random quote '@quote'.");
        await context.sendActivity("- For the wheater '@wheater + name city'.");
        await context.sendActivity("- For the info '@explain + input'.");
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

    async quote(context, next){

        
        const response = await fetch('https://api.quotable.io/random');
        const myJson = await response.json();

        var quote = myJson.content;

        await context.sendActivity(quote);
    }

    async explain(context, next){

        var command = context.activity.text;
        var input = command.replace("@explain ", "");
        console.log(input);

        var client = Owlbot('c98544b33ad132bab67c72ed90b96b741c942277');
        var definition = '...';
        var image = '...';
        var running = true;
 
        client.define(input).then(function(result){
            console.log(result);  
            definition = result.definitions[0].definition;
            image = result.definitions[0].image_url;
            console.log(definition);
            console.log(image);

            return {
                definition: definition,
                image: image
            }
        });

        var count = 0;

        while(running && count < 10){
            await context.sendActivity("getting info");
            count ++
           
            if(definition != "..."){

                var card = CardFactory.heroCard(
                    '',
                    [image],
                );

                const message = MessageFactory.attachment(card);
                await context.sendActivity(message);
                await context.sendActivity(definition);
                running = false;
            } else if (count == 9){
                await context.sendActivity("Nothing found");
            }
        }
    }

    async weather(context, next){

        var command = context.activity.text;
        var city = command.replace("@wheater","");

        console.log(city);
        const response = await fetch('http://api.openweathermap.org/data/2.5/weather?q='+city+'&APPID=5f0fc0d90506ff8451e192c0ed55f0fd');
        const myJson = await response.json();
        console.log(myJson);

        const temperature = myJson.main.temp;
        console.log(temperature);

        var newTemp = temperature - 273.15;

        const description = myJson.weather[0].description;


        await context.sendActivity(Math.round(newTemp * 100) / 100 + " °C");
        await context.sendActivity(description);
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
        var running = true;

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

        var count = 0;
        while(running && count < 10){
          // await context.sendActivity("getting data");
           count ++;
           console.log("running");
            if(displayName != "..."){
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

        var count = 0;
        while(running && count < 10){
          await context.sendActivity("getting data");
          count ++;
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

        var count = 0;
        while(running && count < 10){
            count ++;
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