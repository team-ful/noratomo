import Shop from '../../src/models/shop';
import {createShopModel} from '../../src/tests/models';

describe('shop', () => {
  test('作成できる', () => {
    const shop = createShopModel();

    const s = new Shop(shop);

    expect(s.hotpepper_id).toBe(shop.hotpepper_id);
    expect(s.id).toBe(shop.id);
  });
});
