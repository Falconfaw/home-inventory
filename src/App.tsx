import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAppStore } from '@/store';
import { HomePage } from '@/pages/Home';
import { ItemsPage } from '@/pages/Items';
import { LocationsPage } from '@/pages/Locations';
import { SearchPage } from '@/pages/Search';

export default function App() {
  const { initializeData, subscribeRealtime, isLoaded } = useAppStore();

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  useEffect(() => {
    if (isLoaded) {
      const unsubscribe = subscribeRealtime();
      return () => unsubscribe();
    }
  }, [isLoaded, subscribeRealtime]);

  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/items" element={<ItemsPage />} />
        <Route path="/locations" element={<LocationsPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </Router>
  );
}