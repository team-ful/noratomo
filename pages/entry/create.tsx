import EntryForm from '../../components/Entry/EntryForm';
import Require from '../../components/Session/Require';

const CreateEntry = () => {
  return (
    <Require loginRequire={true} path="/" title="募集作成 | 野良友">
      <EntryForm />
    </Require>
  );
};

export default CreateEntry;
