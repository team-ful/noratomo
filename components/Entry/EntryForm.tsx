import {useRouter} from 'next/router';
import React from 'react';
import EntryFormByUserEdit from './EntryFormByUserEdit';
import EntryFormByShop from './EntryFromByShop';

const EntryForm = () => {
  const router = useRouter();
  const [hotpepper, setHotpepper] = React.useState<string>();

  React.useEffect(() => {
    if (!router.isReady) return;

    if (typeof router.query['hotpepper_id'] === 'string') {
      setHotpepper(router.query['hotpepper_id']);
    }
  }, [router.isReady, router.query]);

  if (typeof hotpepper === 'undefined') {
    return <EntryFormByUserEdit />;
  } else {
    return <EntryFormByShop hotppepper={hotpepper} />;
  }
};

export default EntryForm;
