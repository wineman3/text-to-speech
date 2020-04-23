import json, boto3, uuid


def main(event, context):
    # TODO implement
    polly_client = boto3.client('polly')
    s3 = boto3.client('s3')
    dynamo = boto3.client('dynamodb')
    bucket_name = "text-to-speech-kw"
    event = json.loads(event['body'])
    version = str(uuid.uuid4())
    response = polly_client.synthesize_speech(VoiceId = event['voice'], OutputFormat = 'mp3', Text = event['message'])
    
    stream = response["AudioStream"]
    filename = str(version) + ".mp3"
    #tries to delete an s3 object, if it exists
    try:
        s3.delete_object(Key=filename, Bucket=bucket_name)
    #if not, pass 
    except:
        pass
    #add details to dynamoDB
    dynamo.put_item(
        TableName = 'mynotes',
        Item = {
            'title': {'S': event['title']},
            'message': {'S': event['message']},
            'version': {'S': version},
            'voice': {'S': event['voice']}
        }
    )
    #add mp3 file to s3
    s3.put_object(Key=filename, Bucket=bucket_name, Body=stream.read())
    
    
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-Credentials' : 'true',
            'Access-Control-Expose-Headers': '*'
         },
        'body': json.dumps({'version': version})
    }
