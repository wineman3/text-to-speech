import json
import boto3

def main(event, context):
    s3 = boto3.resource('s3')
    bucket_name = 'texttomp3'
    print(event)
    file_name = event['pathParameters']['title'] + ".mp3"
    file_name = file_name.replace(" ", "_")
    s3.Object(bucket_name, file_name).delete()
    return {
        'headers': {
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-Credentials' : 'true',
         },
        'statusCode': 200,
        'body': json.dumps('Successfuly Deleted ' + file_name)
    }
