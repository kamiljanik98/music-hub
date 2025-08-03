import UserInfo from '../UserInfo';
import RouteLinks from './RouteLinks';
import LogoutButton from '@/components/common/buttons/LogoutButton';

const Menu = ({ collapsed = false }) => (
  <>
    <UserInfo collapsed={collapsed} />
    {!collapsed && <RouteLinks />}
    {collapsed && (
      <div className="w-full flex justify-center mt-2 p-2 rounded-lg items-center bg-red-500">
        <UserInfo collapsed={false} />
        <LogoutButton />
      </div>
    )}
  </>
);

export default Menu;
