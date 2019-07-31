import json, boto3

def main(event, context):
    s3 = boto3.resource('s3')
    dynamo = boto3.client('dynamodb')
    result = dynamo.get_item(TableName='notes', Key ={'title':{'S':event['pathParameters']['title'].replace("_", " ")}})
    version = result['Item']['version']['S']
    bucket_name = 'kwtexttospeech'
    #only title is passed in, need to add .mp3 file extension
    file_name = event['pathParameters']['title'] + version + ".mp3"
    #delete mp3 file from s3 bucket
    s3.Object(bucket_name, file_name).delete()
    file_name = file_name.replace("_", " ")
    #delete details from dynamodb table
    dynamo.delete_item(
        TableName='notes',
        Key ={
            'title': {'S': event['pathParameters']['title'].replace("_", " ")}
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
