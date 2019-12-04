# sfmc-DataExtension-DataOps
Insert data into Salesforce Marketing cloud Data Extension from outside sfmc org.
This example attempts to insert data into Marketing cloud Data Extension from any client.

Step1:
create a Data Extension in SFMC say TestDE.
Save its EXTERNAL KEY for step3 (say EXTERNALKEY123).

----------------------------------------------------------

Name   DataType Length Primary Key Nullable Default Value

----------------------------------------------------------
Email  Text     250 .  Yes         No
Gender Text .   60

----------------------------------------------------------

Step2:
-----
In this Step, we will create an installed package in salesforce Marketing cloud org (under setup).

Then add component anc choose API integration and save. Make sure that Integration Type is Server-to-Server.

Keep a note of Client Id, Client Secret and JWT Signing Secret.

------------------------
Step3:
-----
Having all the required creds form step2, we will first have to get the auth token as in the link below:

https://developer.salesforce.com/docs/atlas.en-us.mc-app-development.meta/mc-app-development/access-token-s2s.htm

The post request here would be to  https://mcmxxxxxxxxxx.auth.marketingcloudapis.com/

Request format:

{
"grant_type": "client_credentials",
"client_id": "7a9j47upktedde30uedl822p",
"client_secret": "1955278925675241571",
"scope": "email_read email_write email_send",
"account_id": "12345"
}

this will return you access token as follows:

{
    "access_token": "xxxxyyyyy_mfCQIZAulxuOsBi9f3ClOrjaclZvRME",
    "token_type": "Bearer",
    "expires_in": 1079,
    "scope": "offline data_extensions_read data_extensions_write",
    "soap_instance_url": "https://mcm25c247x1kzhztj9fn7jmtt19m.soap.marketingcloudapis.com/",
    "rest_instance_url": "https://mcm25c247x1kzhztj9fn7jmtt19m.rest.marketingcloudapis.com/"
}

----------------------
Step4:
-----

Then use the token in the header to insert data into DataExtention as explained in link below.

https://developer.salesforce.com/docs/atlas.en-us.noversion.mc-apis.meta/mc-apis/insertDataExtensionIDAsync.htm

Set header to:

[
{"key":"Content-Type","value":"application/json","description":""},

{"key":"Authorization","value":"Bearer authTokenFromStep2",

"description":""}
]

Post URL:

Host: https://mcxxxxxxx.rest.marketingcloudapis.com/data/v1/async/dataextensions/key:ExternalKey123/rows

Request body format:

[
{
	"keys":{
		"Email": "someone@example.com"
		},
	"values":{
		"Gender": "Male"
	}
}
,
{
	"keys":{
		"Email": "someone2@example.com"
		},
	"values":{
		"Gender": "FeMale"
	}
}
]
------------------------------------

Check the marketing cloud org and the data should be inseterd in the Data extension.

---------------------------------------------------POSTMAN ------------------------------------------------------------
-
Could implent the same from PostMan client:

Step1:
----

POST /v2/token HTTP/1.1

Host: mcm25c247x1kzhztj9fn7jmtt19m.auth.marketingcloudapis.com

Content-Type: application/json

Cache-Control: no-cache

Postman-Token: fd5f7d71-235c-ffbf-17f6-41672f9bfbdf

{
"grant_type": "client_credentials",
"client_id": "xxxxxxxxxxx",
"client_secret": "xxxxxxxxxxx",
"account_id": "xxxxxxxx"
}

This will result in

{
    "access_token": "xxxxxxxxxxxYYYYYYYsBi9f3ClOrjaclZvRME",
    "token_type": "Bearer",
    "expires_in": 1079,
    "scope": "offline data_extensions_read data_extensions_write",
    "soap_instance_url": "https://mcxxxx.soap.marketingcloudapis.com/",
    "rest_instance_url": "https://mcxxxx.rest.marketingcloudapis.com/"
}
-------------------------------------------------------------------
Step2:
----

Use the Access_toekn in the next Request to insert data:

POST /hub/v1/dataevents/key:TestDEExternalKey/rowset HTTP/1.1

Host: mcxxxxx.rest.marketingcloudapis.com

Content-Type: application/json

Authorization: Bearer xxxxtyyyydddssxOqn9bxzFi_mfCQIZAulxuOsBi9f3ClOrjaclZvRME

Cache-Control: no-cache

Postman-Token: 21590989-e51b-66d1-4774-4f46f7a28f11

body:

[{
	"keys":{
		"Email": "someone@example.com"
		},
	"values":{
		"Gender": "Male"
	}
},
{
	"keys":{
		"Email": "someone2@example.com"
		},
	"values":{
		"Gender": "FeMale"
	}
}
]

Data would be inserted in the sfmc DE.

------------------------------------
Incase of errors:
-----

plese refere to sfmc API error code docs.

https://developer.salesforce.com/docs/atlas.en-us.mc-apis.meta/mc-apis/error-handling.htm
