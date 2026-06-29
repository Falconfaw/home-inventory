import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from '@/pages/Home';
import { ItemsPage } from '@/pages/Items';
import { LocationsPage } from '@/pages/Locations';
import { SearchPage } from '@/pages/Search';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/items" element={<ItemsPage />} />
        <Route path="/locations" element={<LocationsPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </Router>
  );
}