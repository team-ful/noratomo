import {join} from 'path';
import {makeSchema} from 'nexus';
import * as types from './types';

export const schema = makeSchema({
  types,
  // Nexusが生成するファイルをどこに保存するかを指定する
  outputs: {
    // 型定義ファイルを`node_modules/@types/nexus-typegen/index.d.ts`に生成する設定
    typegen: join(
      process.cwd(),
      'node_modules',
      '@types',
      'nexus-typegen',
      'index.d.ts'
    ),
    // GraphQL SDLファイルを`src/graphql/schema.graphql`に生成する設定
    schema: join(process.cwd(), 'src', 'graphql', 'schema.graphql'),
  },
});
