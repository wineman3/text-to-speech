import json
import boto3


def main(event, context):
    # TODO implement
    polly_client = boto3.client('polly')
    s3 = boto3.client('s3')
    bucket_name = "texttomp3"
    response = polly_client.synthesize_speech(VoiceId = 'Joanna', OutputFormat = 'mp3', Text = event['body'])
    
    stream = response["AudioStream"]
    filename = event['title'].replace(" ", "_") + ".mp3"
    
    try:
        s3.delete_object(Key=filename, Bucket=bucket_name)
    except:
        pass
    s3.put_object(Key=filename, Bucket=bucket_name, Body=stream.read())
    
    
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-Credentials' : 'true'
         },
        'body': 'Put file '+ filename + 'into text to mp3 bucket.'
    }
