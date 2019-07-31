import json
import boto3

def main(event, context):
    dynamo = boto3.resource('dynamodb')
    table = dynamo.Table('notes')
    response = table.scan()
    fileList = []
    #iterates through db to get each file name

    for x in response['Items']:
        fileList.append({'title': x['title'], 'message': x['message'], 'version': x['version'], 'voice': x['voice']
        })

    fileList = {
        'files' : fileList
    }
    return {
        'statusCode': 200,
        #cors headers
        'headers': {
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-Credentials' : 'true'
         },
        'body': json.dumps(fileList)
        

    }
