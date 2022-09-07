import Head from 'next/head';
import React from 'react';

const Title: React.FC<{children?: string}> = ({children}) => {
  return (
    <Head>
      <title>
        {children ??
          '野良友 | 一人で行く勇気がないお店に行ってくれる人を探せるサービス'}
      </title>
    </Head>
  );
};

export default Title;
