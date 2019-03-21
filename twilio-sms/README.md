# Send an SMS message using Twilio

Leverage the [Twilio Node Helper Library](https://www.twilio.com/docs/libraries/node) to send an SMS notification when a pull request is merged.

## Using the Action

The following parameters are used to configure the action:

| Name | Mode | Required| Example | Description | 
|------|------|---------|---------|-------------|
| TWILIO_ACCT_SID | SECRET | X | |  [Twilio Application SID](https://support.twilio.com/hc/en-us/articles/223136607-What-is-an-Application-SID-) | 
| TWILIO_ACCT_TOKEN | SECRET | X | | [Twilio Authorization Token](https://support.twilio.com/hc/en-us/articles/223136027-Auth-Tokens-and-How-to-Change-Them) | 
| TO_NUMBER | SECRET | X | `15556667777` |  Phone number to send the notification to | 
| FROM_NUMBER | SECRET | X | `15556667777` | Twilio number from which to send the SMS | 
| FAIL_ON_EXIT | ENV VAR | | | If defined (any value), exit with failure code on any error.  Otherwise, exit with neutral code | 
| DEBUG | ENV VAR | | | If defined (any value), print useful debug information to the log | 

## Output

An SMS message with information about the merge, and a link to the relevant Pull Request:

![Example SMS][https://github.com/bryancross/GitHub-Actions/blob/master/twilio-sms/assets/exampleSMS.png]
