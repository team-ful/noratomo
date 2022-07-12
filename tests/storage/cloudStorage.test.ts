import path from 'path';
import axios from 'axios';
import config from '../../config';
import CloudStorage from '../../src/storage/cloudStorage';
import {randomText} from '../../src/utils/random';

describe('cloudStorage', () => {
  const filePath = path.join(__dirname, 'cloudStorage.test.ts');

  test('アップロードできる', async () => {
    const s = new CloudStorage();

    const f = randomText(10);

    await expect(s.upload(filePath, f)).resolves.not.toThrow();

    const link = config.publicStorageHost;
    link.pathname = `/${config.bucketName}/${f}`;

    const res = await axios.get(link.toString());

    expect(res.status).toBe(200);
  });
});
