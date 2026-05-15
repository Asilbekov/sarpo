import { Link } from 'react-router-dom';
import { Product } from '../../data/products';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div
        className="relative aspect-[3/4] overflow-hidden rounded-sm group-hover:shadow-xl transition-all duration-300"
        style={{ backgroundColor: '#FBF1DC' }}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Category badge — bottom-left, ruby red */}
        <div
          className="absolute bottom-4 left-4 text-white text-[11px] px-2.5 py-1 tracking-wide"
          style={{ backgroundColor: '#680018' }}
        >
          {product.category}
        </div>

        {/* "Новинка" sash — top-left rotated, near-black */}
        {product.isNew && (
          <div
            className="absolute top-4 -left-7 text-white text-[11px] font-medium px-8 py-1 -rotate-45 text-center w-32 shadow-sm tracking-wide"
            style={{ backgroundColor: '#1A1314' }}
          >
            Новинка
          </div>
        )}
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-medium text-[#1A1314] line-clamp-1 group-hover:text-[#680018] transition-colors">
          {product.name}
        </h3>
      </div>
    </Link>
  );
}
