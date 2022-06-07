import {ApiError} from 'next/dist/server/api-utils';
import * as check from '../../syntax/check';
import AuthedBase from 'src/base/authedBase';
import {gender as ge, Gender} from 'src/models/common';
import {findUserByUserName, updateUser} from 'src/services/user';

/**
 * ユーザ設定を更新する
 *
 * @param {AuthedBase} base - base
 */
export async function setConfigHandler(base: AuthedBase<void>) {
  const displayName = base.getPostForm('display_name');
  const profile = base.getPostForm('profile');
  const userName = base.getPostForm('user_name');
  const age = base.getPostForm('age');
  const gender = base.getPostForm('gender');

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
    if (!(await findUserByUserName(await base.db(), userName))) {
      throw new ApiError(400, 'user name is already used');
    }
  }
  if (age) {
    let a = NaN;
    try {
      a = parseInt(age);
    } catch (e) {
      throw new ApiError(400, 'parse failed');
    }

    check.checkAge(a);
    option['age'] = a;
  }
  if (gender) {
    let g = Gender.NotNone;
    try {
      g = ge(parseInt(gender));
    } catch (e) {
      throw new ApiError(400, 'parse failed');
    }

    option['gender'] = g;
  }

  await updateUser(await base.db(), base.user.id, option);
}
