import json
import boto3

def main(event, context):
    s3 = boto3.client('s3')
    bucket_name = "texttomp3"
    fileList = []
    #iterates through buckets contents for each file name
    try:
        for key in s3.list_objects(Bucket=bucket_name)['Contents']:
            fileList.append((key['Key']))
    except:
        #empty bucket
        pass
    fileList = {
        'files' : fileList
    }
    return {
        'statusCode': 200,
        #cors headers
        'headers': {
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-Credentials' : 'true'
         },
        'body': json.dumps(fileList)
        

    }
