import FeaturedProducts from './components/FeaturedProducts.jsx';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import InfoBand from './components/InfoBand.jsx';
import usePageMotion from './hooks/usePageMotion.js';

export default function App() {
  usePageMotion();
  return (
    <>
      <Header />
      <main>
        <Hero />
        <FeaturedProducts />
        <InfoBand />
      </main>
      <Footer />
    </>
  );
}
