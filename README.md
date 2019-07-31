# Text-to-Speech Application
This Angular App allows users to create notes and add them to a list. Each note has a title, a message, and a voice attached to them. The title uniquely identifies each note, the message is the text that will be converted to the mp3 file, and the voice is the voice the user chooses to say their message. 

## Motivation
My motivation behind this project was to gain more experience working with cloud technologies, along with Angular. This project demonstrates how quickly you can spin up a serverless API, and work with some pretty cool services that AWS has come out with.

## URL

[keatonwineman.com/text-to-speech] (keatonwiwneman.com/text-to-speech)

## Tools

 - [Angular 7](https://angular.io/)
 - [Bootstrap](https://getbootstrap.com/)
 - [SASS](https://sass-lang.com/)
 - [AWS API Gateway](https://aws.amazon.com/api-gateway/)
 - [AWS Lambda](https://aws.amazon.com/lambda/)
 - [AWS Polly](https://aws.amazon.com/polly/) (Used to convert text to mp3 file)
 - [Python 3.7](https://www.python.org) 
 - [Boto3](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html?id=docs_gateway) (AWS SDK for Python)
 - [AWS S3](https://aws.amazon.com/s3/) 
 - [AWS DynamoDB](https://aws.amazon.com/dynamodb/) (NoSQL DB)
 - [Serverless Framework](https://serverless.com/) (Used to deploy AWS resources)

## How it works

When a new note is added in the Angular App, The Angular service makes a POST request to the endpoint generated in API Gateway. API Gateway then maps that request body and endpoint to a Lambda function that will convert the text to a .mp3 file. This is done using boto3, AWS's Python SDK, along with Polly, AWS's text-to-speech service. Once that .mp3 file is generated, it is saved in an S3 bucket, AWS's simple storage service. The Angular App then references that new S3 object URL to play the mp3 file! There are also endpoints to retrieve, update, and delete notes. Essentially, this is a simple CRUD application with a text-to-speech component built on top of it.

## Installation
(Note: the app is also hosted at keatonwineman.com/text-to-speech , as previously mentioned.)
With this being a serverless backend, I do not have a way to run the API locally, however you can certainly run the Angular App locally!  

 `git clone https://github.com/wineman3/text-to-speech`  
 `cd Angular`  
 `npm i`  
 `ng serve`
