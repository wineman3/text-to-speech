import json, boto3

def main(event, context):
    s3 = boto3.resource('s3')
    dynamo = boto3.client('dynamodb')
    result = dynamo.get_item(TableName='mynotes', Key ={'version':{'S':event['pathParameters']['version']}})
    version = result['Item']['version']['S']
    bucket_name = 'kwtexttospeech'
    #only version is passed in, need to add .mp3 file extension
    file_name = version + ".mp3"
    #delete mp3 file from s3 bucket
    s3.Object(bucket_name, file_name).delete()
    #delete details from dynamodb table
    dynamo.delete_item(
        TableName='mynotes',
        Key ={
            'version': {'S': event['pathParameters']['version']}
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
