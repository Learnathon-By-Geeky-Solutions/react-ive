import Navbar from './Navbar';
import Footer from './Footer';
import Services from './Services';
import About from './About';
import Hero from './Hero';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import LatestJobPosts from './LatestPosts';

const Home = () => {
  const { logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <div className="bg-gray-100 text-gray-800">
      <Navbar toggleDrawer={toggleDrawer} />
      <Hero />
      <LatestJobPosts />
      <About />
      <Services />
      <Footer />
    </div>
  );
};

export default Home;