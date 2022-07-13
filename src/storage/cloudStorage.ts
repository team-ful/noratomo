import {URL} from 'url';
import {Bucket, Storage} from '@google-cloud/storage';
import formidable from 'formidable';
import config from '../../config';
import {randomText} from '../utils/random';

const AVATAR_PATH = 'avatar';

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

  public async delete(file: string) {
    await this.bucket.deleteFiles({
      prefix: file,
    });
  }

  // アバターを新規追加、更新する
  public async updateAvatar(
    image: formidable.File,
    oldImageURL?: URL
  ): Promise<URL> {
    //古いstorage画像がある場合は削除する
    if (oldImageURL) {
      // https://storage.google.com/bucketname/avatar/imagename
      // → avatar/imagename を取得する
      const pathname = oldImageURL.pathname.split('/');
      // bucket nameを除いたパス
      const storagePath = pathname.slice(2).join('/');

      await this.delete(storagePath);
    }

    // 衝突困難性は評価していないのでもしかしたら衝突するかもしれないけどそんなこと知らん
    const fileName = randomText(20);
    const storagePath = `${AVATAR_PATH}/${fileName}`;

    await this.upload(image.filepath, storagePath);

    const url = config.publicStorageHost;
    url.pathname = `${config.bucketName}/${storagePath}`;

    return url;
  }
}

export default CloudStorage;
