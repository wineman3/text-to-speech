import json
import boto3

def main(event, context):
    dynamo = boto3.client('dynamodb')
    #rename title
    title = event['pathParameters']['title']
    #get note details, by title, from Dynamo DB
    response = dynamo.get_item(TableName='notes', Key={'title':{'S':title}})
    response = {
        "title": response['Item']['title']['S'],
        "message": response['Item']['message']['S']
    }

    return {
        'headers': {
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-Credentials' : 'true',
         },
        'statusCode': 200,
        'body': json.dumps(response)
        
    }
