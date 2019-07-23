import json
import boto3

def main(event, context):
    s3 = boto3.resource('s3')
    dynamo = boto3.client('dynamodb')
    bucket_name = 'texttomp3'
    #only title is passed in, need to add .mp3 file extension
    file_name = event['pathParameters']['title'] + ".mp3"
    file_name = file_name.replace(" ", "_")
    #delete mp3 file from s3 bucket
    s3.Object(bucket_name, file_name).delete()
    #delete details from dynamodb table
    dynamo.delete_item(
        TableName='notes',
        Key ={
            'title': event['pathParameters']['title']
        }
    )
    return {
        'headers': {
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-Credentials' : 'true',
         },
        'statusCode': 200,
        'body': json.dumps('Successfuly Deleted ' + file_name)
    }
