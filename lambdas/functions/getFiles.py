import json
import boto3

def main(event, context):
    # TODO implement
    s3 = boto3.client('s3')
    bucket_name = "texttomp3"
    fileList = []
    try:
        for key in s3.list_objects(Bucket=bucket_name)['Contents']:
            fileList.append((key['Key']))
    except:
        pass

    return {
        'statusCode': 200,
        'body': json.dumps(fileList)
    }
