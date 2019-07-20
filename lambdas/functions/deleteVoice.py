import json
import boto3

def main(event, context):
    s3 = boto3.resource('s3')
    bucket_name = 'texttomp3'
    file_name = event['pathParameters']['title'] + ".mp3"
    file_name = file_name.replace(" ", "_")
    try:
        s3.Object(bucket_name, file_name).delete()
    except:
        pass
    return {
        'headers': {
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-Credentials' : 'true',
            'Access-Control-Allow-Methods': 'POST, PUT, GET, DELETE, OPTIONS'
         },
        'statusCode': 200,
        'body': json.dumps('Successfuly Deleted ' + file_name)
    }
