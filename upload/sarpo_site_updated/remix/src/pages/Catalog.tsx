import { Layout } from '../components/layout/Layout';
import { products } from '../data/products';
import { ProductCard } from '../components/ui/ProductCard';
import { SlidersHorizontal, ChevronDown, Search } from 'lucide-react';

export function Catalog() {
  const collections = [
    'Весенняя коллекция',
    'Летняя коллекция',
    'Осенняя коллекция',
    'Зимняя коллекция',
    'Новинки',
  ];

  return (
    <Layout>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-medium text-[#1A1314] mb-2">Каталог товаров</h1>
          <p className="text-[#706567] text-sm">Подборка необходимых вещей для каждого гардероба</p>
        </div>

        <div className="flex gap-10 mt-6 flex-col md:flex-row">
          {/* Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="flex items-center justify-between font-medium mb-6 text-[#1A1314]">
              <span className="text-lg">Фильтры</span>
              <SlidersHorizontal className="w-5 h-5 text-[#1A1314]" />
            </div>

            <div className="mb-8">
              <h3 className="text-sm font-medium mb-4 text-[#1A1314]">Коллекции</h3>
              <ul className="space-y-3">
                {collections.map((col) => (
                  <li key={col} className="flex items-center justify-between">
                    <label className="text-sm text-[#1A1314]/80 cursor-pointer">{col}</label>
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 cursor-pointer accent-[#680018]"
                    />
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Filter */}
            <div>
              <h3 className="text-sm font-medium mb-4 text-[#1A1314]">Цена</h3>
              <div className="w-full relative h-1 bg-gray-200 rounded mb-4">
                <div className="absolute left-0 right-0 h-1 rounded" style={{ backgroundColor: '#680018' }}></div>
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md"
                  style={{ backgroundColor: '#680018' }}
                ></div>
                <div
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md"
                  style={{ backgroundColor: '#680018' }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-[#706567]">
                <span>0 $</span>
                <span>100 000 $</span>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Sort Row */}
            <div className="flex justify-between items-center mb-6 gap-6">
              {/* Search */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Поиск продуктов"
                  className="w-full bg-white text-[#1A1314] text-sm rounded-md pl-10 pr-4 py-3 outline-none border border-gray-200 focus:ring-1 focus:ring-[#680018] focus:border-[#680018]"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>

              {/* Sort */}
              <div className="w-64 border border-gray-200 bg-white rounded-md p-3 flex justify-between items-center cursor-pointer relative group flex-shrink-0">
                <span className="text-sm text-[#1A1314]">Сортировка</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />

                {/* Mock Dropdown */}
                <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-md mt-1 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                  <ul className="py-2 text-sm text-[#1A1314]">
                    <li className="px-4 py-2 hover:bg-[#F9F7F5] flex justify-between items-center">
                      По новизне <input type="radio" name="sort" className="accent-[#680018]" />
                    </li>
                    <li className="px-4 py-2 hover:bg-[#F9F7F5] flex justify-between items-center">
                      Цена: по возрастанию <input type="radio" name="sort" className="accent-[#680018]" />
                    </li>
                    <li className="px-4 py-2 hover:bg-[#F9F7F5] flex justify-between items-center">
                      Цена: по убыванию <input type="radio" name="sort" className="accent-[#680018]" />
                    </li>
                    <li className="px-4 py-2 hover:bg-[#F9F7F5] flex justify-between items-center">
                      Популярные <input type="radio" name="sort" className="accent-[#680018]" />
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
