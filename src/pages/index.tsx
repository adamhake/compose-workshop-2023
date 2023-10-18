import Bookshelf from '~/components/Bookshelf';
import Footer from '~/components/ui/Footer';
import Hero from '~/components/Hero';

export default function Home() {
  return (
    <section>
      <Hero />
      <Bookshelf />
      <Footer />
    </section>
  );
}
