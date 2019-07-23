import json
import boto3


def main(event, context):
    # TODO implement
    polly_client = boto3.client('polly')
    s3 = boto3.client('s3')
    dynamo = boto3.client('dynamodb')
    bucket_name = "texttomp3"
    event = json.loads(event['body'])
    response = polly_client.synthesize_speech(VoiceId = 'Brian', OutputFormat = 'mp3', Text = event['message'])
    
    stream = response["AudioStream"]
    filename = event['title'].replace(" ", "_") + ".mp3"
    #tries to delete an s3 object, if it exists
    try:
        s3.delete_object(Key=filename, Bucket=bucket_name)
    #if not, pass 
    except:
        pass
    #add details to dynamoDB
    dynamo.put_item(
        TableName = 'notes',
        Item = {
            'title': {'S': event['title']},
            'message': {'S': event['message']},
            'voice': {'S': 'jeebs'}
        }
    )
    #add mp3 file to s3
    s3.put_object(Key=filename, Bucket=bucket_name, Body=stream.read())
    
    
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-Credentials' : 'true'
         },
        'body': json.dumps('Put file '+ filename + ' into text to mp3 bucket.')
    }
