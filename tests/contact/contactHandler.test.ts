import fetchMock from 'fetch-mock-jest';
import FormData from 'form-data';
import {testApiHandler} from 'next-test-api-route-handler';
import config from '../../config';
import {
  handlerWrapper,
  authHandlerWrapper,
} from '../../src/base/handlerWrapper';
import {contactUserHandler} from '../../src/contact/contact';
import {contactHandler} from '../../src/contact/sendContact';
import TestBase from '../../src/tests/base';
import formDataHandler from '../../src/tests/handler';

describe('discord handler', () => {
  const base: TestBase = new TestBase();
  const endpoint = config.discordWebhookURL;

  beforeAll(async () => {
    await base.connection();

    const admin = await base.newUser();
    await admin.addSession(base.db);
  });

  afterAll(async () => {
    await base.end();
  });

  test('handler non User can send', async () => {
    expect.hasAssertions();
    const u = base.users[0];
    fetchMock.post(endpoint, {
      status: 200,
    });

    const form = new FormData();
    form.append('text', 'hogehoge');
    form.append('category', 'hugahuga');
    form.append('mail', 'test@mail.test');

    await testApiHandler({
      handler: formDataHandler(handlerWrapper(contactHandler, 'POST')),
      requestPatcher: async req => {
        req.headers = {
          ...req.headers,
          cookie: u.sessionCookie,
        };
      },
      test: async ({fetch}) => {
        const res = await fetch({
          method: 'POST',
          body: form,
        });

        expect(res.status).toBe(200);
        expect(fetchMock).toHaveLastFetched(endpoint);
      },
    });
  });
  test('handler User can send', async () => {
    expect.hasAssertions();
    const u = base.users[0];
    fetchMock.post(
      endpoint,
      {
        status: 200,
      },
      {overwriteRoutes: false}
    );

    const form = new FormData();
    form.append('text', 'hogehoge');
    form.append('category', 'hugahuga');
    form.append('mail', 'test@mail.test');

    await testApiHandler({
      handler: formDataHandler(authHandlerWrapper(contactUserHandler, 'POST')),
      requestPatcher: async req => {
        req.headers = {
          ...req.headers,
          cookie: u.sessionCookie,
        };
      },
      test: async ({fetch}) => {
        const res = await fetch({
          method: 'POST',
          body: form,
        });

        expect(res.status).toBe(200);
        expect(fetchMock).toHaveLastFetched(endpoint);
      },
    });
  });
});
