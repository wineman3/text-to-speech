import json
import boto3

def main(event, context):
    dynamo = boto3.client('dynamodb')
    #rename title
    title = event['pathParameters']['title']
    #get note details, by title, from Dynamo DB
    title = title.replace("_", " ")
    item = dynamo.get_item(TableName='notes', Key={'title':{'S':title}})
    result = {
        "title": item['Item']['title']['S'],
        "message": item['Item']['message']['S']
    }

    return {
        'headers': {
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-Credentials' : 'true',
         },
        'statusCode': 200,
        'body': json.dumps(result)
        
    }
