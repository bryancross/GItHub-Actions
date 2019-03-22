//Action sends SMS to TO_NUMBER using Twilio FROM_NUMBER
//Action will exit with a neutral result by default

//If the action is misconfigured, output helpful info and exit
if (!(process.env.TWILIO_ACCT_SID && process.env.TWILIO_ACCT_TOKEN && process.env.TO_NUMBER && process.env.FROM_NUMBER))
{
    console.log("USAGE: ");
    console.log("The following secrets are REQUIRED to use this Action:");
    console.log("TWILIO_ACCT_SID\t\t: Your active Twilio SID");
    console.log("TWILIO_ACCT_TOKEN\t\t: Your active Twilio Auth Token");
    console.log("TO_NUMBER\t\t: Number to send an SMS to.  May need to be validated on Twilio");
    console.log("FROM_NUMBER\t\t: Twilio phone number from which the SMS will be sent.");
    console.log("The following two environment variables are OPTIONAL")
    console.log("DEBUG\t\t: If present (set to any value), print variable values to the console");
    console.log("FAIL_ON_ERROR\t\t: If present (set to any value), fail on any error.  Otherwise, exit with neutral return value");
    process.exit(process.env.FAIL_ON_ERROR ? -1 : 78);
};


const fs = require('fs');
const accountSid = process.env.TWILIO_ACCT_SID;
const authToken = process.env.TWILIO_ACCT_TOKEN;
const client = require('twilio')(accountSid, authToken);

var event_payload = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH));

//We're only interested in responding to the merge flavor of pull request event
if (!event_payload || !event_payload.pull_request.merged_by || !event_payload.pull_request.merged_by.login)
{
    console.log("PR Action missing, nothing to do");
    //Arguably inconsistent, but the action will run on an PR event, which is beyond our control.  
    process.exit(78); //Exit neutral
}

try
{
    var pr_action = event_payload.pull_request.merged_by.login;
    var pr_title = event_payload.pull_request.title;
    var repo_owner = event_payload.repository.owner.login;
    var repo_name = event_payload.repository.name;
    var base_branch_name = event_payload.pull_request.base.ref;
    var head_branch_name = event_payload.pull_request.head.ref;
    var pr_url = event_payload.pull_request.html_url;
}
catch (e)
{
    console.log("ERROR processing event data: " + e.msg);
    process.exit(process.env.FAIL_ON_ERROR ? err.code : 78);
}


var msgBody = 'PR merge in ' + repo_owner + '/' + repo_name + ': ' + head_branch_name + '->' + base_branch_name + ' ' + pr_url;

//if the DEBUG environment variable exists, print this debug stuff to the log.
if (process.env.DEBUG)
{
    console.log("ENV VARS");
    console.log("SID   : " + accountSid.substring(0, 5));
    console.log("TOKEN : " + authToken.substring(0, 5));
    console.log("TO #  : " + process.env.TO_NUMBER);
    console.log("FROM #: " + process.env.FROM_NUMBER);
    console.log("RUNTIME VARS");
    console.log("pr_Action   : " + JSON.stringify(pr_action));
    console.log("pr_Title    : " + JSON.stringify(pr_title));
    console.log("pr_repo_name: " + JSON.stringify(repo_name));
    console.log("base_branch_name: " + JSON.stringify(base_branch_name));
    console.log("head_branch_name: " + JSON.stringify(head_branch_name));
    console.log("msgBody: " + msgBody);
};

//Send our SMS message
//Might implement a Twilio flow for better management of target #s, etc.
client.messages
    .create({
        body: msgBody,
        from: process.env.FROM_NUMBER,
        to: process.env.TO_NUMBER
    })
    .then(message => console.log("SMS Delivered: " + message.sid))
    .catch(err =>
    {
        console.log("ERROR: " + err.code + err.message);
        process.exit(process.env.FAIL_ON_ERROR ? err.code : 78);
    });
