import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './components/dashboard/Dashboard';

function App() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <Dashboard />
      </div>
    </div>
  );
}

export default App;