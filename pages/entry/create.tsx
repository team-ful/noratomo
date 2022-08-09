import EntryForm from '../../components/Entry/EntryForm';
import Require from '../../components/Session/Require';

const CreateEntry = () => {
  return (
    <Require loginRequire={true} path="/">
      <EntryForm />
    </Require>
  );
};

export default CreateEntry;
