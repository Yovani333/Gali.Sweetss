import FeaturedProducts from './components/FeaturedProducts.jsx';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import InfoBand from './components/InfoBand.jsx';
import usePageMotion from './hooks/usePageMotion.js';
import { useState } from 'react';
import ImageViewer from './components/ImageViewer.jsx';
import ChatWidget from './components/chat/ChatWidget.jsx';

export default function App() {
  usePageMotion();
  const [preview, setPreview] = useState(null);
  return (
    <>
      <Header />
      <main>
        <Hero />
        <FeaturedProducts onPreview={setPreview} />
        <InfoBand />
      </main>
      <Footer />
      <ChatWidget onPreview={setPreview} />
      {preview && <ImageViewer image={preview} onClose={() => setPreview(null)} />}
    </>
  );
}
