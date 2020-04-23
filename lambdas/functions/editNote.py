import json, boto3, uuid

def main(event, context):
    s3 = boto3.client('s3')
    dynamodb = boto3.client('dynamodb')
    polly_client = boto3.client('polly')
    bucket_name = "text-to-speech-kw"
    old_version = event['pathParameters']['version']
    event = json.loads(event['body'])
    version = str(uuid.uuid4())
    #get audio for new message
    response = polly_client.synthesize_speech(VoiceId = event['voice'], OutputFormat = 'mp3', Text = event['message'])
    stream = response["AudioStream"]
    filename = str(old_version) + ".mp3"
    s3.delete_object(Key=filename, Bucket=bucket_name)
    dynamodb.delete_item(
        TableName='mynotes',
        Key ={
            'version': {'S': old_version}
        }
    )

    #edit details in dynamodb
    dynamodb.put_item(
        TableName = 'mynotes',
        Item = {
            'title': {'S': event['title']},
            'message': {'S': event['message']},
            'version': {'S': str(version)},
            'voice': {'S': event['voice']}
        }
    )
    #update mp3 file to s3
    filename = str(version) + ".mp3"
    s3.put_object(Key=filename, Bucket=bucket_name, Body=stream.read())
    event.update( {'version': str(version)})
    
    
    return {
        'statusCode': 200,
        #cors headers
        'headers': {
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-Credentials' : 'true',
            'Access-Control-Expose-Headers': '*',
            'Access-Control-Expose-Headers': '*'
         },
        'body': json.dumps(event)
        
    }
