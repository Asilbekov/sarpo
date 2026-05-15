import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { products, productGallery, Product } from '../data/products';
import { ProductCard } from '../components/ui/ProductCard';

export function ProductDetails() {
  const { id } = useParams();
  const product: Product =
    products.find((p) => p.id === id) || {
      id: '1',
      name: 'Cable Knit Jumper Dress',
      price: 29.99,
      image: '/images/product_blue_grey.jpg',
      category: "Women's Essentials",
      collection: 'Весенняя коллекция',
    };

  // Build gallery: main product image first, then other variants
  const gallery = [product.image, ...productGallery.filter((p) => p !== product.image)].slice(0, 4);

  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const recommendedProducts = products.slice(0, 8);

  return (
    <Layout>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 mb-20">
          {/* Large Image */}
          <div
            className="aspect-[3/4] flex items-center justify-center overflow-hidden rounded-sm"
            style={{ backgroundColor: '#FBF1DC' }}
          >
            <img
              src={gallery[activeImg]}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Product Info */}
          <div>
            {/* Thumbnails Row */}
            <div className="grid grid-cols-4 gap-4 mb-10">
              {gallery.map((img, i) => (
                <button
                  key={img + i}
                  onClick={() => setActiveImg(i)}
                  className={
                    'aspect-[3/4] overflow-hidden transition-all rounded-sm ' +
                    (activeImg === i ? 'ring-2 ring-[#680018]' : 'ring-1 ring-transparent hover:ring-[#680018]/40')
                  }
                  style={{ backgroundColor: '#FBF1DC' }}
                >
                  <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover object-center" />
                </button>
              ))}
            </div>

            <p className="text-sm text-[#680018] mb-2 tracking-wide">{product.category}</p>
            <h1 className="text-3xl md:text-4xl font-medium text-[#1A1314] mb-4">{product.name}</h1>
            <p className="text-2xl font-light text-[#1A1314] mb-6">${product.price.toFixed(2)}</p>

            {product.description && (
              <p className="text-[15px] text-[#1A1314]/70 mb-8 leading-relaxed">{product.description}</p>
            )}

            <div className="mb-8">
              <p className="text-sm text-[#706567] mb-3 block">Количество</p>
              <div className="flex items-center">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-11 h-11 border flex items-center justify-center transition-colors hover:bg-[#F2E5D5]"
                  style={{ backgroundColor: '#FCF7F1', borderColor: '#EDDCCC' }}
                >
                  −
                </button>
                <div
                  className="w-14 h-11 border-t border-b bg-white flex items-center justify-center text-sm font-medium"
                  style={{ borderColor: '#EDDCCC' }}
                >
                  {quantity}
                </div>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-11 h-11 border flex items-center justify-center transition-colors hover:bg-[#F2E5D5]"
                  style={{ backgroundColor: '#FCF7F1', borderColor: '#EDDCCC' }}
                >
                  +
                </button>
              </div>
            </div>

            <button
              className="w-full text-white py-4 font-medium transition-colors tracking-wide"
              style={{ backgroundColor: '#2D020C' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = '#680018')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2D020C')}
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* Recommended Products Section */}
        <div className="mt-24">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-3xl font-medium text-[#1A1314]">Рекомендуемые продукты</h2>
            <a
              href="/catalog"
              className="text-[#680018] text-sm font-medium flex items-center gap-1 hover:underline"
            >
              Все →
            </a>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
