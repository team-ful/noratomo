import path from 'path';
import axios from 'axios';
import formidable from 'formidable';
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

  test('パスを指定してアップロードできる', async () => {
    const s = new CloudStorage();

    const f = randomText(10);

    await expect(s.upload(filePath, `nyancat/${f}`)).resolves.not.toThrow();

    const link = config.publicStorageHost;
    link.pathname = `/${config.bucketName}/nyancat/${f}`;

    const res = await axios.get(link.toString());

    expect(res.status).toBe(200);
  });

  test('削除できる', async () => {
    const s = new CloudStorage();

    const f = randomText(10);

    await expect(s.upload(filePath, f)).resolves.not.toThrow();

    const link = config.publicStorageHost;
    link.pathname = `/${config.bucketName}/${f}`;

    const res = await axios.get(link.toString());
    expect(res.status).toBe(200);

    // 削除する
    await expect(s.delete(f)).resolves.not.toThrow();

    await expect(axios.get(link.toString())).rejects.toThrow();
  });

  test('ファイルがない場合に削除してもエラーは出ない', async () => {
    const s = new CloudStorage();
    const f = randomText(10);

    // 削除する
    await expect(s.delete(f)).resolves.not.toThrow();

    const link = config.publicStorageHost;
    link.pathname = `/${config.bucketName}/${f}`;

    await expect(axios.get(link.toString())).rejects.toThrow();
  });

  test('アバターを新規追加する', async () => {
    const s = new CloudStorage();

    // filepath以外はダミー
    const file = {
      filepath: filePath,
    };

    const url = await s.updateAvatar(file as formidable.File);

    const res = await axios.get(url.toString());
    expect(res.status).toBe(200);
  });

  test('すでに存在するアバターを削除してアバターを更新する', async () => {
    const s = new CloudStorage();

    const f = randomText(10);

    await expect(s.upload(filePath, f)).resolves.not.toThrow();

    const link = config.publicStorageHost;
    link.pathname = `/${config.bucketName}/${f}`;

    const oldImageURL = link.toString();

    const res = await axios.get(link.toString());
    expect(res.status).toBe(200);

    const file = {
      filepath: filePath,
    };

    // 更新
    const url = await s.updateAvatar(file as formidable.File, link);

    const resNew = await axios.get(url.toString());
    expect(resNew.status).toBe(200);

    // すでに存在するアバターは削除されている
    await expect(axios.get(oldImageURL)).rejects.toThrow();
  });

  test('すでに存在するアバターで、bucket nameが違う場合は削除しない', async () => {
    const s = new CloudStorage();

    const f = randomText(10);

    const link = config.publicStorageHost;
    link.pathname = `/test/${f}`;

    const file = {
      filepath: filePath,
    };

    // 更新
    const url = await s.updateAvatar(file as formidable.File, link);

    const resNew = await axios.get(url.toString());
    expect(resNew.status).toBe(200);

    // TODO 違うバケットのものを用意できなかった
  });
});
