import boto3
from botocore.exceptions import ClientError
from typing import Optional
import io
from .config import settings


class CloudflareR2:
    def __init__(self):
        self.account_id = settings.CLOUDFLARE_ACCOUNT_ID
        self.access_key_id = settings.CLOUDFLARE_ACCESS_KEY_ID
        self.secret_access_key = settings.CLOUDFLARE_SECRET_ACCESS_KEY
        self.bucket = settings.CLOUDFLARE_R2_BUCKET

        # Only initialize the client if all required settings are provided
        if self.account_id and self.access_key_id and self.secret_access_key and self.bucket:
            # Initialize the S3 client with Cloudflare R2 configuration
            self.client = boto3.client(
                's3',
                endpoint_url=f'https://{self.account_id}.r2.cloudflarestorage.com',
                aws_access_key_id=self.access_key_id,
                aws_secret_access_key=self.secret_access_key,
            )
        else:
            # If settings are not provided, set client to None
            self.client = None

    def upload_content(self, key: str, content: str, content_type: str = 'text/plain') -> bool:
        """
        Upload content to Cloudflare R2 bucket
        """
        if not self.client:
            print("R2 client not configured. Skipping upload.")
            return False

        try:
            self.client.put_object(
                Bucket=self.bucket,
                Key=key,
                Body=content,
                ContentType=content_type
            )
            return True
        except ClientError as e:
            print(f"Error uploading to R2: {e}")
            return False

    def download_content(self, key: str) -> Optional[str]:
        """
        Download content from Cloudflare R2 bucket
        """
        if not self.client:
            print("R2 client not configured. Cannot download.")
            return None

        try:
            response = self.client.get_object(Bucket=self.bucket, Key=key)
            content = response['Body'].read().decode('utf-8')
            return content
        except ClientError as e:
            print(f"Error downloading from R2: {e}")
            return None

    def delete_content(self, key: str) -> bool:
        """
        Delete content from Cloudflare R2 bucket
        """
        if not self.client:
            print("R2 client not configured. Cannot delete.")
            return False

        try:
            self.client.delete_object(Bucket=self.bucket, Key=key)
            return True
        except ClientError as e:
            print(f"Error deleting from R2: {e}")
            return False

    def content_exists(self, key: str) -> bool:
        """
        Check if content exists in Cloudflare R2 bucket
        """
        if not self.client:
            print("R2 client not configured. Cannot check existence.")
            return False

        try:
            self.client.head_object(Bucket=self.bucket, Key=key)
            return True
        except ClientError:
            return False


# Global instance
r2_client = CloudflareR2()