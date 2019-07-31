import json, boto3, uuid

def main(event, context):
    s3 = boto3.client('s3')
    dynamodb = boto3.client('dynamodb')
    polly_client = boto3.client('polly')
    bucket_name = "kwtexttospeech"
    title = event['pathParameters']['title']
    title = title.replace("%20", " ")
    event = json.loads(event['body'])
    result = dynamodb.get_item(TableName='notes', Key ={'title':{'S':title}})
    current_version = result['Item']['version']['S']
    version = str(uuid.uuid4())
    #get audio for new message
    response = polly_client.synthesize_speech(VoiceId = event['voice'], OutputFormat = 'mp3', Text = event['message'])
    stream = response["AudioStream"]
    filename = title.replace(" ", "_") + str(current_version) + ".mp3"
    s3.delete_object(Key=filename, Bucket=bucket_name)
    event.update( {'version': str(version)})

    #edit details in dynamodb
    dynamodb.put_item(
        TableName = 'notes',
        Item = {
            'title': {'S': event['title']},
            'message': {'S': event['message']},
            'version': {'S': str(version)},
            'voice': {'S': event['voice']}
        }
    )
    #update mp3 file to s3
    filename = title.replace(" ", "_") + str(version) + ".mp3"
    s3.put_object(Key=filename, Bucket=bucket_name, Body=stream.read())
    
    
    return {
        'statusCode': 200,
        #cors headers
        'headers': {
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-Credentials' : 'true'
         },
        'body': json.dumps(event)
        
    }
