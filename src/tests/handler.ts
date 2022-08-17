import {NextApiHandler, PageConfig} from 'next';

/**
 * bodyParser = falseにしてFormDataを対応させる
 *
 * @param {NextApiHandler} handler - handler
 * @returns {typeof handler & {config?: PageConfig}} - configを含むhandler
 */
export default function formDataHandler<T = void>(
  handler: NextApiHandler<T>
): typeof handler & {config?: PageConfig} {
  const h: typeof handler & {config?: PageConfig} = handler;
  const config: PageConfig = {
    api: {
      bodyParser: false,
    },
  };
  h.config = config;

  return h;
}
