import { Search, ShoppingBag } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export function Header() {
  const location = useLocation();
  const navLinks = [
    { title: 'Весенняя коллекция', path: '/catalog?collection=spring' },
    { title: 'Летняя коллекция', path: '/catalog?collection=summer' },
    { title: 'Осенняя коллекция', path: '/catalog?collection=autumn' },
    { title: 'Зимняя коллекция', path: '/catalog?collection=winter' },
    { title: 'Новинки', path: '/catalog?new=true' },
  ];

  const isActive = (path: string) => {
    // Mark autumn as active to match the SVG mockups
    return path.includes('autumn');
  };

  return (
    <header className="w-full flex flex-col sticky top-0 z-50">
      {/* Top bar — deep wine background */}
      <div
        className="text-white px-6 md:px-12 flex items-center justify-between"
        style={{ backgroundColor: '#2D020C', minHeight: '72px' }}
      >
        <Link to="/" className="flex items-center gap-3 py-3">
          {/* SARPO ornate medallion logo */}
          <img
            src="/images/sarpo_logo.png"
            alt="SARPO"
            className="h-12 w-auto select-none"
            draggable={false}
          />
          <span
            className="text-3xl font-display font-medium tracking-[0.25em] text-white"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            SARPO
          </span>
        </Link>

        <div className="flex items-center gap-5">
          <div className="relative hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="bg-white text-gray-800 text-sm rounded-full pl-10 pr-5 py-2.5 w-[320px] outline-none border-0 focus:ring-2 focus:ring-white/30"
            />
          </div>
          <Link
            to="/cart"
            className="bg-white p-2.5 rounded-full relative hover:scale-105 transition-transform"
            style={{ color: '#2D020C' }}
            aria-label="Корзина"
          >
            <ShoppingBag className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Nav bar — warm beige background */}
      <div style={{ backgroundColor: '#EFE6E1' }} className="border-b border-black/5">
        <nav className="max-w-[1400px] mx-auto px-6 md:px-12">
          <ul className="flex items-center w-full justify-between py-4 text-[15px] text-[#1A1314]">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <li key={link.title}>
                  <Link
                    to={link.path}
                    className={
                      'transition-colors ' +
                      (active
                        ? 'underline underline-offset-[6px] decoration-1 decoration-[#1A1314]'
                        : 'hover:text-[#680018]')
                    }
                  >
                    {link.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
