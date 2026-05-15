import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { ProductCard } from '../components/ui/ProductCard';
import { products, heroSlides } from '../data/products';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export function Home() {
  const recommendedProducts = products.slice(0, 10);
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setSlideIndex((i) => (i + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(t);
  }, []);

  const slide = heroSlides[slideIndex];

  const next = () => setSlideIndex((i) => (i + 1) % heroSlides.length);
  const prev = () => setSlideIndex((i) => (i - 1 + heroSlides.length) % heroSlides.length);

  return (
    <Layout>
      {/* Hero Section — full-width with lifestyle photo on the right */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: '#EFE6E1', minHeight: '600px' }}
      >
        {/* Background image with soft beige gradient overlay on the left for text legibility */}
        <div className="absolute inset-0">
          {heroSlides.map((s, i) => (
            <div
              key={s.image}
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
              style={{
                backgroundImage: `url(${s.image})`,
                backgroundPosition: 'right center',
                opacity: i === slideIndex ? 1 : 0,
              }}
            />
          ))}
          {/* Left-side beige gradient fading to transparent over the photo */}
          <div
            className="absolute inset-y-0 left-0 w-full lg:w-2/3 pointer-events-none"
            style={{
              background:
                'linear-gradient(to right, #EFE6E1 0%, #EFE6E1 35%, rgba(239,230,225,0.85) 50%, rgba(239,230,225,0) 75%)',
            }}
          />
        </div>

        <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 py-20 md:py-28 lg:py-32 flex flex-col justify-center w-full lg:w-1/2 min-h-[600px]">
          <h1
            className="text-4xl md:text-5xl lg:text-[56px] font-bold text-[#1A1314] mb-6 leading-[1.1]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {slide.title}
          </h1>
          <p className="text-base md:text-lg text-[#1A1314]/85 mb-10 max-w-xl leading-relaxed">
            {slide.subtitle}
          </p>

          {/* Carousel indicators/controls */}
          <div className="flex items-center gap-5 mt-4">
            <button
              onClick={prev}
              className="text-[#680018] hover:text-[#2D020C] transition-colors"
              aria-label="Назад"
            >
              <ArrowLeft className="w-7 h-7" strokeWidth={1.5} />
            </button>
            <div className="flex gap-2.5 items-center">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlideIndex(i)}
                  className="transition-all"
                  aria-label={`Слайд ${i + 1}`}
                >
                  {i === slideIndex ? (
                    <span className="block w-4 h-4 rounded-full border-2 border-[#680018] flex items-center justify-center">
                      <span className="block w-2 h-2 rounded-full bg-[#680018]"></span>
                    </span>
                  ) : (
                    <span className="block w-3 h-3 rounded-full bg-[#680018]/40 hover:bg-[#680018]"></span>
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={next}
              className="text-[#680018] hover:text-[#2D020C] transition-colors"
              aria-label="Вперёд"
            >
              <ArrowRight className="w-7 h-7" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </section>

      {/* Recommended Products Section */}
      <section className="py-16 md:py-20 px-6 md:px-12 max-w-[1400px] mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-medium text-[#1A1314] mb-2">Рекомендуемые продукты</h2>
            <p className="text-[#706567] text-sm">Подборка необходимых вещей для каждого гардероба</p>
          </div>
          <Link
            to="/catalog"
            className="text-sm font-medium flex items-center gap-1 text-[#1A1314] hover:text-[#680018] transition-colors"
          >
            Все <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {recommendedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </Layout>
  );
}
