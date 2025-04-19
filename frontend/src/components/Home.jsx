import Navbar from './Navbar';
import Footer from './Footer';
import Services from './Services';
import About from './About';
import Hero from './Hero';
import LatestJobPosts from './LatestPosts';

const Home = () => {
  

  return (
    <div className="bg-gray-100 text-gray-800">
      <Navbar/>
      <Hero />
      <LatestJobPosts />
      <About />
      <Services />
      <Footer />
    </div>
  );
};

export default Home;