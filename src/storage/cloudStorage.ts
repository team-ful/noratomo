import {Bucket, Storage} from '@google-cloud/storage';
import config from '../../config';

class CloudStorage {
  private storage: Storage;
  private bucket: Bucket;

  constructor() {
    // Instantiates a client. If you don't specify credentials when constructing
    // the client, the client library will look for credentials in the
    // environment.
    // ref. https://cloud.google.com/docs/authentication/getting-started#auth-cloud-implicit-nodejs
    this.storage = new Storage(config.storageOptions);

    this.bucket = this.storage.bucket(config.bucketName);
  }

  public async upload(filePath: string, cloudPath: string) {
    await this.bucket.upload(filePath, {
      destination: cloudPath,
    });
  }
}

export default CloudStorage;
