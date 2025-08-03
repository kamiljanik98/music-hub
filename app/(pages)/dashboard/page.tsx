import Sidebar from '@/components/navigation/Sidebar';
import View from './view';

export default function DashboardPage() {
  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-neutral-950 p-2 relative overflow-hidden gap-2">
      <Sidebar />
      <View />
    </div>
  );
}
