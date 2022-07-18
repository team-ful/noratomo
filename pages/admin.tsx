import AdminTop from '../components/Admin/AdminTop';
import Require from '../components/Session/Require';

const Admin = () => {
  return (
    <Require path="/oauth-login" loginRequire={true} adminOnly={true}>
      <AdminTop />
    </Require>
  );
};

export default Admin;
