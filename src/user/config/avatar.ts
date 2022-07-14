import {URL} from 'url';
import AuthedBase from '../../base/authedBase';
import CloudStorage from '../../storage/cloudStorage';

/**
 * アバターを更新する
 *
 * @param {AuthedBase} base - base
 */
export async function updateAvatarHandler(base: AuthedBase<void>) {
  const file = await base.getPostFormFiles('image', true);

  const s = new CloudStorage();

  const oldImagePath = base.user.avatar_url;
  let oldImageURL: URL | undefined = undefined;
  if (oldImagePath) {
    oldImageURL = new URL(oldImagePath);
  }

  // cloud storageにアップロードする
  const newImageURL = await s.updateAvatar(file, oldImageURL);

  await base.updateAvatar(newImageURL.toString());

  base.res.send(newImageURL.toString());
}
