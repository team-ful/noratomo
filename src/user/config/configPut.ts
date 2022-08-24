import {ApiError} from '../../base/apiError';
import AuthedBase from '../../base/authedBase';
import {gender as ge} from '../../models/common';
import {findUserByUserName, updateUser} from '../../services/user';
import * as check from '../../syntax/check';

/**
 * ユーザ設定を更新する
 *
 * @param {AuthedBase} base - base
 */
export async function setConfigHandler(base: AuthedBase<void>) {
  const displayName = base.getPostURLForm('display_name');
  const profile = base.getPostURLForm('profile');
  const userName = base.getPostURLForm('user_name');
  const age = base.getPostURLForm('age');
  const gender = base.getPostURLForm('gender');

  const option: {[key: string]: string | number | null} = {};

  if (typeof displayName !== 'undefined') {
    if (displayName.length !== 0) {
      check.checkDisplayName(displayName);
      option['display_name'] = displayName;
    } else {
      // 指定されているが要素が空の場合はnullを入れる
      option['display_name'] = null;
    }
  }
  if (typeof profile !== 'undefined') {
    if (profile.length !== 0) {
      check.checkProfile(profile);
      option['profile'] = profile;
    } else {
      // 指定されているが要素が空の場合はnullを入れる
      option['profile'] = null;
    }
  }
  if (userName) {
    check.checkUserName(userName);

    // ユーザ名はユニークなのですでに使われているかチェックする
    if ((await findUserByUserName(await base.db(), userName)) !== null) {
      throw new ApiError(400, 'user name is already used');
    }

    option['user_name'] = userName;
  }
  if (age) {
    const a = parseInt(age);
    if (Number.isNaN(a)) {
      throw new ApiError(400, 'parse failed');
    }

    check.checkAge(a);
    option['age'] = a;
  }
  if (gender) {
    option['gender'] = ge(parseInt(gender));
  }

  await updateUser(await base.db(), base.user.id, option);
}
