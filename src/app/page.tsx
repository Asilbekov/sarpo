'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Search,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  SlidersHorizontal,
  ChevronDown,
  Trash2,
  User,
  Phone,
  MapPin,
  Wallet,
  Facebook,
  Instagram,
  Twitter,
  Menu,
  X,
  ArrowUpDown,
  ChevronUp,
} from 'lucide-react';
import { Product, formatPrice } from '@/lib/sarpo-data';
import { useProducts, useHeroSlides, useCollections, useProductGallery, useRecommendedProducts, useNewProducts, apiPostDirect } from '@/lib/use-api-data';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useCartStore } from '@/lib/cart-store';
import { toast } from 'sonner';

/* ──────────────── Types ──────────────── */
type PageView = 'home' | 'catalog' | 'product' | 'cart';

/* ──────────────── Header ──────────────── */
function Header({ onNavigate, currentPage, onSearch, onCollectionNavigate, onContactClick }: { onNavigate: (page: PageView) => void; currentPage: PageView; onSearch: (query: string) => void; onCollectionNavigate: (collection: string) => void; onContactClick: () => void }) {
  const cartCount = useCartStore((s) => s.items.reduce((sum, item) => sum + item.quantity, 0));
  const [headerSearch, setHeaderSearch] = useState('');
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const navLinks = [
    { title: 'Весенняя коллекция', collection: 'Весенняя коллекция' },
    { title: 'Летняя коллекция', collection: 'Летняя коллекция' },
    { title: 'Осенняя коллекция', collection: 'Осенняя коллекция' },
    { title: 'Зимняя коллекция', collection: 'Зимняя коллекция' },
    { title: 'Новинки', collection: 'Новинки' },
  ];

  const handleHeaderSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (headerSearch.trim()) {
      onSearch(headerSearch.trim());
    }
  };

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          if (currentScrollY > lastScrollY && currentScrollY > 80) {
            setVisible(false);
          } else {
            setVisible(true);
          }
          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (page: PageView) => {
    setMenuOpen(false);
    onNavigate(page);
  };

  return (
    <>
      <header
        className="w-full flex flex-col sticky top-0 z-50 transition-transform duration-300 ease-in-out"
        style={{ transform: visible ? 'translateY(0)' : 'translateY(-100%)' }}
      >
        {/* Top bar — ruby background */}
        <div
          className="text-white px-4 md:px-12 flex items-center justify-between relative"
          style={{ backgroundColor: '#680018', minHeight: '56px' }}
        >
          {/* Left side: hamburger + logo */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 -ml-2 text-white"
              aria-label="Меню"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <button
              onClick={() => onNavigate('home')}
              className="flex items-center py-2 md:py-3"
            >
              <img
                src="/images/sarpo_logo.svg"
                alt="SARPO"
                className="h-10 md:h-14 w-auto select-none"
                draggable={false}
              />
            </button>
          </div>

          {/* Right side: search + phone + cart */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Mobile: Search icon button */}
            <button
              onClick={() => onNavigate('catalog')}
              className="md:hidden bg-white p-2 rounded-full"
              style={{ color: '#680018' }}
              aria-label="Поиск"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Desktop: Search form */}
            <form onSubmit={handleHeaderSearch} className="relative hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#680018]" />
              <input
                type="text"
                placeholder="Search"
                value={headerSearch}
                onChange={(e) => setHeaderSearch(e.target.value)}
                className="bg-white text-gray-800 text-sm rounded-full pl-10 pr-5 py-2.5 w-[280px] lg:w-[320px] outline-none border-0 focus:ring-2 focus:ring-white/30"
              />
            </form>

            {/* Operator bilan bog'lanish button */}
            <button
              onClick={onContactClick}
              className="bg-white p-2 md:p-2.5 rounded-full hover:scale-105 transition-all duration-300"
              style={{ color: '#680018' }}
              aria-label="Связаться с оператором"
            >
              <Phone className="w-4 h-4 md:w-5 md:h-5" />
            </button>

            <button
              onClick={() => onNavigate('cart')}
              className="bg-white p-2 md:p-2.5 rounded-full relative hover:scale-105 transition-transform"
              style={{ color: '#680018' }}
              aria-label="Корзина"
            >
              <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#680018] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu — collections only, opens from top to bottom */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            menuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
          }`}
          style={{ backgroundColor: '#680018' }}
        >
          <div className="flex flex-col items-start gap-4 p-4">
            <button onClick={() => { onCollectionNavigate('Весенняя коллекция'); setMenuOpen(false); }} className="text-sm text-white/80 hover:text-white transition-colors">Весенняя коллекция</button>
            <button onClick={() => { onCollectionNavigate('Летняя коллекция'); setMenuOpen(false); }} className="text-sm text-white/80 hover:text-white transition-colors">Летняя коллекция</button>
            <button onClick={() => { onCollectionNavigate('Осенняя коллекция'); setMenuOpen(false); }} className="text-sm text-white/80 hover:text-white transition-colors">Осенняя коллекция</button>
            <button onClick={() => { onCollectionNavigate('Зимняя коллекция'); setMenuOpen(false); }} className="text-sm text-white/80 hover:text-white transition-colors">Зимняя коллекция</button>
            <button onClick={() => { onCollectionNavigate('Новинки'); setMenuOpen(false); }} className="text-sm text-white/80 hover:text-white transition-colors">Новинки</button>
          </div>
        </div>

        {/* Nav bar — warm beige background — hidden on mobile */}
        <div style={{ backgroundColor: '#EFE6E1' }} className="border-b border-black/5 hidden md:block">
          <nav className="max-w-[1400px] mx-auto px-4 md:px-12">
            <ul className="flex items-center w-full justify-between py-3 md:py-4 text-xs md:text-[15px] text-[#1A1314] overflow-x-auto">
              {navLinks.map((link) => (
                <li key={link.collection}>
                  <button
                    onClick={() => onCollectionNavigate(link.collection)}
                    className="transition-colors hover:text-[#680018] whitespace-nowrap px-1"
                  >
                    {link.title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
}

/* ──────────────── Footer ──────────────── */
function Footer({ onCollectionNavigate }: { onCollectionNavigate: (collection: string) => void }) {
  return (
    <footer
      className="text-white pt-8 md:pt-16 pb-6 md:pb-8 px-4 md:px-12 mt-auto"
      style={{ backgroundColor: '#2D020C' }}
    >
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 border-b border-white/15 pb-10 md:pb-12 mb-8">
        <div>
          <h3 className="font-medium text-lg mb-6 tracking-wide">Продукты</h3>
          <ul className="space-y-4 text-sm text-white/75">
            <li><button onClick={() => onCollectionNavigate('Весенняя коллекция')} className="hover:text-white transition-colors">Весенняя коллекция</button></li>
            <li><button onClick={() => onCollectionNavigate('Летняя коллекция')} className="hover:text-white transition-colors">Летняя коллекция</button></li>
            <li><button onClick={() => onCollectionNavigate('Осенняя коллекция')} className="hover:text-white transition-colors">Осенняя коллекция</button></li>
            <li><button onClick={() => onCollectionNavigate('Зимняя коллекция')} className="hover:text-white transition-colors">Зимняя коллекция</button></li>
          </ul>
        </div>
        <div>
          <h3 className="font-medium text-lg mb-6 tracking-wide">Компания</h3>
          <ul className="space-y-4 text-sm text-white/75">
            <li><span className="hover:text-white transition-colors cursor-pointer">О нас</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Карьера</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Устойчивое развитие</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Пресса</span></li>
          </ul>
        </div>
        <div>
          <h3 className="font-medium text-lg mb-6 tracking-wide">Связаться</h3>
          <div className="flex gap-4 mb-8">
            <a href="#" className="hover:text-white/70 transition-colors" aria-label="Facebook"><Facebook className="w-5 h-5" /></a>
            <a href="#" className="hover:text-white/70 transition-colors" aria-label="Instagram"><Instagram className="w-5 h-5" /></a>
            <a href="#" className="hover:text-white/70 transition-colors" aria-label="Twitter"><Twitter className="w-5 h-5" /></a>
          </div>
          <p className="text-sm text-white/75 mb-4">Подпишитесь на нашу рассылку</p>
          <form className="flex flex-col sm:flex-row w-full gap-2 sm:gap-0" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Email address"
              className="bg-black/30 border border-white/15 text-white placeholder-white/40 px-4 py-2.5 text-sm outline-none flex-grow focus:border-white/40 sm:border-r-0"
            />
            <button
              type="submit"
              className="bg-white/10 hover:bg-white/20 border border-white/15 sm:border-l-0 transition-colors px-6 py-2.5 text-sm font-medium"
            >
              Join
            </button>
          </form>
        </div>
      </div>
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center text-xs text-white/50">
        <p>&copy; 2026 SARPO. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <span className="hover:text-white transition-colors cursor-pointer">Политика конфиденциальности</span>
          <span className="hover:text-white transition-colors cursor-pointer">Условия использования</span>
          <span className="hover:text-white transition-colors cursor-pointer">Публичная оферта</span>
        </div>
      </div>
    </footer>
  );
}

/* ──────────────── ContactModal ──────────────── */
function ContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      toast.error('Заполните все поля');
      return;
    }
    setSending(true);
    try {
      const res = await apiPostDirect('contact', {
        name: name.trim(),
        phone: phone.trim(),
        message: message.trim(),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = data?.error?.message || data?.message || 'Ошибка при отправке';
        throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
      }
      toast.success('Сообщение отправлено!', {
        description: 'Оператор свяжется с вами в ближайшее время',
      });
      setName('');
      setPhone('');
      setMessage('');
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ошибка при отправке сообщения';
      toast.error(msg);
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium text-[#1A1314]">Связаться с оператором</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label className="text-xs font-medium text-[#706567] mb-1.5 block">Имя</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ваше имя"
              className="border-gray-200 focus:border-[#680018] focus:ring-[#680018]"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[#706567] mb-1.5 block">Телефон</label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+998 90 123 45 67"
              className="border-gray-200 focus:border-[#680018] focus:ring-[#680018]"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[#706567] mb-1.5 block">Сообщение</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Опишите ваш вопрос..."
              rows={4}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-[#680018] focus:ring-1 focus:ring-[#680018] resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={sending}
            className="w-full text-white py-3 font-medium tracking-wide rounded-sm transition-colors disabled:opacity-60"
            style={{ backgroundColor: '#2D020C' }}
          >
            {sending ? 'Отправка...' : 'Отправить'}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ──────────────── ProductCard ──────────────── */
function ProductCard({
  product,
  onSelect,
}: {
  product: Product;
  onSelect: (product: Product) => void;
}) {
  return (
    <button
      onClick={() => onSelect(product)}
      className="group block text-left w-full"
    >
      <div
        className="relative aspect-[3/4] overflow-hidden rounded-sm group-hover:shadow-xl transition-all duration-300 border border-gray-100"
        style={{ backgroundColor: '#FFFFFF' }}
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
            <ShoppingBag className="w-12 h-12" />
          </div>
        )}
        {/* Category badge */}
        {product.category && (
        <div
          className="absolute bottom-2 left-2 md:bottom-3 md:left-3 text-white text-[9px] md:text-[11px] px-1.5 py-0.5 md:px-2.5 md:py-1 tracking-wide"
          style={{ backgroundColor: '#680018' }}
        >
          {product.category}
        </div>
        )}
        {/* "Новинка" sash */}
        {product.isNew && (
          <div
            className="absolute top-3 -left-6 text-white text-[10px] font-medium px-6 py-0.5 -rotate-45 text-center w-28 shadow-sm tracking-wide"
            style={{ backgroundColor: '#1A1314' }}
          >
            Новинка
          </div>
        )}
      </div>
      <div className="mt-2 md:mt-3">
        <h3 className="text-[11px] md:text-sm font-medium text-[#1A1314] line-clamp-1 group-hover:text-[#680018] transition-colors">
          {product.name}
        </h3>
        <p className="text-[11px] md:text-sm text-[#706567] mt-1">
          {formatPrice(product.price)}
        </p>
      </div>
    </button>
  );
}

/* ──────────────── HomePage ──────────────── */
function HomePage({
  onNavigate,
  onSelectProduct,
  onCollectionNavigate,
}: {
  onNavigate: (page: PageView) => void;
  onSelectProduct: (product: Product) => void;
  onCollectionNavigate: (collection: string) => void;
}) {
  const { data: recommendedProducts, loading: loadingRecommended } = useRecommendedProducts();
  const { data: newProducts, loading: loadingNew } = useNewProducts();
  const { data: heroSlides, loading: loadingSlides } = useHeroSlides();
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const t = setInterval(() => {
      setSlideIndex((i) => (i + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(t);
  }, [heroSlides.length]);

  const slide = heroSlides[slideIndex] || heroSlides[0];
  const next = () => setSlideIndex((i) => heroSlides.length > 0 ? (i + 1) % heroSlides.length : 0);
  const prev = () => setSlideIndex((i) => heroSlides.length > 0 ? (i - 1 + heroSlides.length) % heroSlides.length : 0);

  if (loadingSlides || loadingRecommended || loadingNew) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#680018] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (heroSlides.length === 0 && recommendedProducts.length === 0 && newProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[#706567]">
        <p className="text-lg mb-2">Данные загружаются...</p>
        <p className="text-sm">Скоро здесь появятся товары</p>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      {heroSlides.length > 0 && (
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: '#EFE6E1', minHeight: '280px' }}
      >
        <div className="absolute inset-0">
          {heroSlides.map((s, i) => (
            <div
              key={s.image}
              className="absolute inset-0 bg-cover transition-opacity duration-1000 ease-in-out"
              style={{
                backgroundImage: `url(${s.image})`,
                backgroundPosition: 'center 20%',
                backgroundSize: 'cover',
                opacity: i === slideIndex ? 1 : 0,
              }}
            />
          ))}
          {/* Left-side beige gradient — full width on mobile */}
          <div
            className="absolute inset-y-0 left-0 w-full lg:w-3/5 pointer-events-none"
            style={{
              background:
                'linear-gradient(to right, #EFE6E1 0%, #EFE6E1 30%, rgba(239,230,225,0.9) 45%, rgba(239,230,225,0.4) 65%, rgba(239,230,225,0) 80%)',
            }}
          />
        </div>

        <div className="relative max-w-[1400px] mx-auto px-4 md:px-12 py-8 md:py-20 lg:py-24 flex flex-col justify-center min-h-[280px] md:min-h-[500px]">
          <div className="w-full lg:w-1/2 xl:w-2/5">
            <h1
              className="text-xl md:text-4xl lg:text-[44px] font-bold text-[#1A1314] mb-3 md:mb-6 leading-[1.1]"
            >
              {slide?.title || ''}
            </h1>
            <p className="text-[11px] md:text-sm lg:text-base text-[#1A1314]/85 mb-6 md:mb-10 max-w-lg leading-relaxed">
              {slide?.subtitle || ''}
            </p>
          </div>

        </div>

        {/* Carousel controls — at the bottom of hero */}
        <div className="relative flex items-center justify-center gap-3 md:gap-6 w-full pb-4 md:pb-6">
          <button
            onClick={prev}
            className="text-[#680018] hover:text-[#2D020C] transition-colors p-1"
            aria-label="Назад"
          >
            <ArrowLeft className="w-6 h-6 md:w-10 md:h-10" strokeWidth={1.5} />
          </button>
          <div className="flex gap-2 md:gap-4 items-center">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlideIndex(i)}
                className="transition-all"
                aria-label={`Слайд ${i + 1}`}
              >
                {i === slideIndex ? (
                  <span className="block w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-[#680018] flex items-center justify-center">
                    <span className="block w-3 h-3 md:w-4 md:h-4 rounded-full bg-[#680018]"></span>
                  </span>
                ) : (
                  <span className="block w-4 h-4 md:w-6 md:h-6 rounded-full bg-[#680018]/40 hover:bg-[#680018]"></span>
                )}
              </button>
            ))}
          </div>
          <button
            onClick={next}
            className="text-[#680018] hover:text-[#2D020C] transition-colors p-1"
            aria-label="Вперёд"
          >
            <ArrowRight className="w-6 h-6 md:w-10 md:h-10" strokeWidth={1.5} />
          </button>
        </div>
      </section>
      )}

      {/* Recommended Products Section */}
      <section className="py-10 md:py-20 px-4 md:px-12 max-w-[1400px] mx-auto">
        <div className="flex justify-between items-end mb-6 md:mb-10">
          <div>
            <h2 className="text-xl md:text-4xl font-medium text-[#1A1314] mb-1 md:mb-2">
              Рекомендуемые продукты
            </h2>
            <p className="text-[#706567] text-[11px] md:text-sm">
              Подборка новых товаров для каждого сезона
            </p>
          </div>
          <button
            onClick={() => onNavigate('catalog')}
            className="text-[11px] md:text-sm font-medium flex items-center gap-1 text-[#680018] hover:text-[#2D020C] transition-colors"
          >
            Все <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
          </button>
        </div>

        {recommendedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
            {recommendedProducts.map((product) => (
              <ProductCard key={product.id} product={product} onSelect={onSelectProduct} />
            ))}
          </div>
        ) : (
          <p className="text-[#706567] text-sm">Рекомендуемые товары скоро появятся</p>
        )}
      </section>

      {/* Новинки Section */}
      {newProducts.length > 0 && (
        <section className="py-10 md:py-20 px-4 md:px-12 max-w-[1400px] mx-auto">
          <div className="flex justify-between items-end mb-6 md:mb-10">
            <div>
              <h2 className="text-xl md:text-4xl font-medium text-[#1A1314] mb-1 md:mb-2">
                Новинки
              </h2>
              <p className="text-[#706567] text-[11px] md:text-sm">
                Свежие поступления этого сезона
              </p>
            </div>
            <button
              onClick={() => onCollectionNavigate('Новинки')}
              className="text-[11px] md:text-sm font-medium flex items-center gap-1 text-[#680018] hover:text-[#2D020C] transition-colors"
            >
              Все <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} onSelect={onSelectProduct} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

/* ──────────────── CatalogPage ──────────────── */
function CatalogPage({
  onSelectProduct,
  initialSearch = '',
  initialCollection = '',
}: {
  onSelectProduct: (product: Product) => void;
  initialSearch?: string;
  initialCollection?: string;
}) {
  const { data: products, loading: loadingProducts } = useProducts();
  const { data: collections, loading: loadingCollections } = useCollections();
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCollections, setSelectedCollections] = useState<string[]>(initialCollection ? [initialCollection] : []);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const PRICE_MIN = 0;
  const PRICE_MAX = 15000000;
  const [priceMin, setPriceMin] = useState(PRICE_MIN);
  const [priceMax, setPriceMax] = useState(PRICE_MAX);

  const toggleCollection = (col: string) => {
    setSelectedCollections((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );
  };

  if (loadingProducts || loadingCollections) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 md:px-12 py-8 md:py-10">
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#680018] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const filteredProducts = products
    .filter((p) => {
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (selectedCollections.length > 0) {
        const nonNovinkiCollections = selectedCollections.filter((c) => c !== 'Новинки');
        const wantsNovinki = selectedCollections.includes('Новинки');
        // Product passes if it matches a regular collection OR it's new and user wants novinki
        const matchesRegularCollection = nonNovinkiCollections.length > 0 && nonNovinkiCollections.includes(p.collection);
        const matchesNovinki = wantsNovinki && p.isNew;
        if (!matchesRegularCollection && !matchesNovinki) return false;
      }
      if (p.price < priceMin || p.price > priceMax) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'popular': return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        default: return 0;
      }
    });

  const sortOptions = [
    { value: 'newest', label: 'По новизне' },
    { value: 'price-asc', label: 'Цена: по возрастанию' },
    { value: 'price-desc', label: 'Цена: по убыванию' },
    { value: 'popular', label: 'Популярные' },
  ];

  const filterContent = (
    <>
      <div className="mb-6 md:mb-8">
        <h3 className="text-xs md:text-sm font-medium mb-3 md:mb-4 text-[#1A1314]">Коллекции</h3>
        <ul className="space-y-2.5 md:space-y-3">
          {collections.map((col) => (
            <li key={col} className="flex items-center justify-between">
              <label className="text-xs md:text-sm text-[#1A1314]/80 cursor-pointer">
                {col}
              </label>
              <input
                type="checkbox"
                checked={selectedCollections.includes(col)}
                onChange={() => toggleCollection(col)}
                className="w-3.5 h-3.5 md:w-4 md:h-4 rounded border-gray-300 cursor-pointer accent-[#680018]"
              />
            </li>
          ))}
        </ul>
      </div>

      {/* Price Filter */}
      <div>
        <h3 className="text-xs md:text-sm font-medium mb-3 md:mb-4 text-[#1A1314]">Цена</h3>
        <div className="w-full relative h-1.5 bg-gray-200 rounded mb-3 md:mb-4">
          {/* Active track between the two thumbs */}
          <div
            className="absolute h-1.5 rounded"
            style={{
              backgroundColor: '#680018',
              left: `${((priceMin - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100}%`,
              right: `${100 - ((priceMax - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100}%`,
            }}
          />
          {/* Min thumb */}
          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={1}
            value={priceMin}
            onChange={(e) => {
              const val = Number(e.target.value);
              setPriceMin(Math.min(val, priceMax - 1));
            }}
            className="absolute w-full h-1.5 appearance-none bg-transparent pointer-events-none z-20 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#680018] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#680018] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer"
            style={{ top: '50%', transform: 'translateY(-50%)' }}
          />
          {/* Max thumb */}
          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={1}
            value={priceMax}
            onChange={(e) => {
              const val = Number(e.target.value);
              setPriceMax(Math.max(val, priceMin + 1));
            }}
            className="absolute w-full h-1.5 appearance-none bg-transparent pointer-events-none z-20 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#680018] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#680018] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer"
            style={{ top: '50%', transform: 'translateY(-50%)' }}
          />
        </div>
        <div className="flex justify-between text-[10px] md:text-xs text-[#706567]">
          <span>{formatPrice(priceMin)}</span>
          <span>{formatPrice(priceMax)}</span>
        </div>
      </div>
    </>
  );

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-12 py-8 md:py-10">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-medium text-[#1A1314] mb-2">Каталог товаров</h1>
        <p className="text-[#706567] text-xs md:text-sm">Подборка необходимых вещей для каждого гардероба</p>
      </div>

      <div className="flex gap-6 md:gap-10 flex-col md:flex-row">
        {/* Mobile: Filter toggle button */}
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="md:hidden flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-md bg-white text-sm text-[#1A1314] font-medium w-full justify-center"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {filtersOpen ? 'Скрыть фильтры' : 'Фильтры'}
        </button>

        {/* Sidebar — hidden on mobile unless filtersOpen, always visible on md+ */}
        <aside className={`w-full md:w-56 lg:w-64 flex-shrink-0 ${filtersOpen ? '' : 'hidden md:block'}`}>
          <div className="flex items-center justify-between font-medium mb-5 md:mb-6 text-[#1A1314]">
            <span className="text-base md:text-lg">Фильтры</span>
            <SlidersHorizontal className="w-4 h-4 md:w-5 md:h-5 text-[#1A1314]" />
          </div>
          {filterContent}
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Search and Sort Row */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-5 md:mb-6 gap-3 md:gap-6">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Поиск продуктов"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-[#1A1314] text-xs md:text-sm rounded-md pl-9 md:pl-10 pr-4 py-2.5 md:py-3 outline-none border border-gray-200 focus:ring-1 focus:ring-[#680018] focus:border-[#680018]"
              />
              <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400" />
            </div>

            <div className="relative">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="w-full sm:w-52 md:w-64 border border-gray-200 bg-white rounded-md p-2.5 md:p-3 flex justify-between items-center cursor-pointer"
              >
                <span className="text-xs md:text-sm text-[#1A1314]">
                  {sortOptions.find((o) => o.value === sortBy)?.label || 'Сортировка'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500" />
              </button>
              {sortOpen && (
                <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-md mt-1 shadow-lg z-10">
                  <ul className="py-2 text-xs md:text-sm text-[#1A1314]">
                    {sortOptions.map((opt) => (
                      <li key={opt.value}>
                        <button
                          onClick={() => { setSortBy(opt.value); setSortOpen(false); }}
                          className="w-full px-3 md:px-4 py-2 hover:bg-[#F9F7F5] flex justify-between items-center text-left"
                        >
                          {opt.label}
                          {sortBy === opt.value && (
                            <span className="w-2.5 h-2.5 rounded-full bg-[#680018]" />
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onSelect={onSelectProduct} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16 text-[#706567]">
              <p className="text-lg">Товары не найдены</p>
              <p className="text-sm mt-2">Попробуйте изменить фильтры</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ──────────────── ProductPage ──────────────── */
function ProductPage({
  product,
  onNavigate,
  onSelectProduct,
}: {
  product: Product;
  onNavigate: (page: PageView) => void;
  onSelectProduct: (product: Product) => void;
}) {
  const { data: products } = useProducts();
  const { data: productGallery } = useProductGallery();
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const addToCart = useCartStore((s) => s.addItem);

  const gallery = [
    product.image,
    ...productGallery.filter((p) => p !== product.image),
  ].slice(0, 4);

  const recommendedProducts = products.filter((p) => p.id !== product.id).slice(0, 10);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${product.name} добавлен в корзину`, {
      description: `Количество: ${quantity}`,
    });
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-12 py-8 md:py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-20 mb-16 md:mb-20">
        {/* Image Section — full width on mobile */}
        <div>
          {/* Large Image */}
          <div
            className="aspect-[3/4] flex items-center justify-center overflow-hidden rounded-sm border border-gray-100"
            style={{ backgroundColor: '#FFFFFF' }}
          >
            {gallery[activeImg] ? (
            <img
              src={gallery[activeImg]}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                <ShoppingBag className="w-20 h-20" />
              </div>
            )}
          </div>

          {/* Mobile: Circular thumbnails below main image */}
          <div className="flex gap-3 mt-3 md:hidden justify-center">
            {gallery.map((img, i) => (
              <button
                key={img + i}
                onClick={() => setActiveImg(i)}
                className={
                  'w-12 h-12 rounded-full overflow-hidden transition-all ' +
                  (activeImg === i
                    ? 'ring-2 ring-[#680018]'
                    : 'ring-1 ring-transparent hover:ring-[#680018]/40')
                }
                style={{ backgroundColor: '#FFFFFF' }}
              >
                <img
                  src={img}
                  alt={`${product.name} ${i + 1}`}
                  className="w-full h-full object-cover object-center"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          {/* Desktop: Thumbnails Row (above product info) */}
          <div className="hidden md:grid grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-10">
            {gallery.map((img, i) => (
              <button
                key={img + i}
                onClick={() => setActiveImg(i)}
                className={
                  'aspect-[3/4] overflow-hidden transition-all rounded-sm ' +
                  (activeImg === i
                    ? 'ring-2 ring-[#680018]'
                    : 'ring-1 ring-transparent hover:ring-[#680018]/40')
                }
                style={{ backgroundColor: '#FFFFFF' }}
              >
                <img
                  src={img}
                  alt={`${product.name} ${i + 1}`}
                  className="w-full h-full object-cover object-center"
                />
              </button>
            ))}
          </div>

          {product.category && (
          <p className="text-xs md:text-sm text-[#680018] mb-1.5 md:mb-2 tracking-wide">
            {product.category}
          </p>
          )}
          <h1 className="text-2xl md:text-4xl font-medium text-[#1A1314] mb-3 md:mb-4">
            {product.name}
          </h1>
          <p className="text-xl md:text-2xl font-light text-[#1A1314] mb-4 md:mb-6">
            {formatPrice(product.price)}
          </p>

          {product.description && (
            <p className="text-sm md:text-[15px] text-[#1A1314]/70 mb-6 md:mb-8 leading-relaxed">
              {product.description}
            </p>
          )}

          <div className="mb-6 md:mb-8">
            <p className="text-xs md:text-sm text-[#706567] mb-2.5 md:mb-3 block">Количество</p>
            <div className="flex items-center">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 md:w-11 md:h-11 border flex items-center justify-center transition-colors hover:bg-[#F2E5D5] text-sm md:text-base"
                style={{ backgroundColor: '#FCF7F1', borderColor: '#EDDCCC' }}
              >
                −
              </button>
              <div
                className="w-10 h-9 md:w-14 md:h-11 border-t border-b bg-white flex items-center justify-center text-xs md:text-sm font-medium"
                style={{ borderColor: '#EDDCCC' }}
              >
                {quantity}
              </div>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-9 h-9 md:w-11 md:h-11 border flex items-center justify-center transition-colors hover:bg-[#F2E5D5] text-sm md:text-base"
                style={{ backgroundColor: '#FCF7F1', borderColor: '#EDDCCC' }}
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full text-white py-3 md:py-4 font-medium transition-colors tracking-wide rounded-sm hover:bg-[#680018]"
            style={{ backgroundColor: '#2D020C' }}
          >
            Добавить в корзину
          </button>
        </div>
      </div>

      {/* Recommended Products Section */}
      <div className="mt-12 md:mt-24">
        <div className="flex justify-between items-end mb-6 md:mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-medium text-[#1A1314]">
              Рекомендуемые продукты
            </h2>
            <p className="text-[#706567] text-xs md:text-sm mt-1">
              Подборка новых товаров для каждого сезона
            </p>
          </div>
          <button
            onClick={() => onNavigate('catalog')}
            className="text-[#680018] text-xs md:text-sm font-medium flex items-center gap-1 hover:underline"
          >
            Все →
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
          {recommendedProducts.map((p) => (
            <ProductCard key={p.id} product={p} onSelect={onSelectProduct} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ──────────────── CartPage ──────────────── */
type CartSortColumn = 'name' | 'quantity' | 'total' | 'status';
type CartSortDirection = 'desc' | 'asc';

interface CartSortState {
  column: CartSortColumn | null;
  direction: CartSortDirection;
}

function CartPage({ onNavigate }: { onNavigate: (page: PageView) => void }) {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const total = useCartStore((s) => s.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0));
  const [paymentMethod, setPaymentMethod] = useState('payme');
  const [cartSort, setCartSort] = useState<CartSortState>({ column: null, direction: 'asc' });
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [orderLoading, setOrderLoading] = useState(false);
  const orderPlaced = useCartStore((s) => s.orderPlaced);
  const setOrderPlaced = useCartStore((s) => s.setOrderPlaced);

  // Cycle sort: null → desc → asc → null
  const handleColumnSort = (column: CartSortColumn) => {
    setCartSort((prev) => {
      if (prev.column !== column) {
        // New column: start with desc
        return { column, direction: 'desc' };
      }
      if (prev.direction === 'desc') {
        return { column, direction: 'asc' };
      }
      // asc → reset (no sort)
      return { column: null, direction: 'asc' };
    });
  };

  // Sort cart items
  const sortedItems = [...items].sort((a, b) => {
    if (!cartSort.column) return 0;
    switch (cartSort.column) {
      case 'name': {
        const cmp = a.product.name.localeCompare(b.product.name, 'ru');
        return cartSort.direction === 'asc' ? cmp : -cmp;
      }
      case 'quantity': {
        const cmp = a.quantity - b.quantity;
        return cartSort.direction === 'asc' ? cmp : -cmp;
      }
      case 'total': {
        const cmp = (a.product.price * a.quantity) - (b.product.price * b.quantity);
        return cartSort.direction === 'asc' ? cmp : -cmp;
      }
      case 'status': {
        const statusA = orderPlaced ? 'оформлен' : 'в корзине';
        const statusB = orderPlaced ? 'оформлен' : 'в корзине';
        const cmp = statusA.localeCompare(statusB, 'ru');
        return cartSort.direction === 'asc' ? cmp : -cmp;
      }
      default: return 0;
    }
  });

  const SortIcon = ({ column }: { column: CartSortColumn }) => {
    const isActive = cartSort.column === column;
    if (!isActive) {
      return <ArrowUpDown className="w-3 h-3 md:w-3.5 md:h-3.5 text-gray-300 ml-1" />;
    }
    return (
      <ChevronUp
        className={`w-3.5 h-3.5 md:w-4 md:h-4 ml-1 transition-transform duration-200 text-[#680018] ${
          cartSort.direction === 'desc' ? 'rotate-180' : ''
        }`}
      />
    );
  };

  const handleOrder = async () => {
    if (items.length === 0) {
      toast.error('Корзина пуста');
      return;
    }
    if (!customerName.trim()) {
      toast.error('Введите имя');
      return;
    }
    if (!phone.trim()) {
      toast.error('Введите номер телефона');
      return;
    }
    if (!address.trim()) {
      toast.error('Введите адрес');
      return;
    }

    setOrderLoading(true);
    try {
      const res = await apiPostDirect('orders', {
        customer: {
          name: customerName.trim(),
          phone: phone.trim(),
          address: address.trim(),
        },
        paymentMethod,
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        totalPrice: total,
      });

      const data = await res.json();
      if (!res.ok) {
        // Parse API error
        const apiError = data?.error;
        if (apiError?.fields) {
          // Validation errors — show specific field errors
          const fieldErrors = Object.values(apiError.fields).flat().join(', ');
          throw new Error(fieldErrors || apiError.message || 'Ошибка валидации');
        }
        const msg = apiError?.message || data?.message || 'Ошибка при создании заказа';
        throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
      }

      toast.success('Заказ оформлен!', {
        description: `Статус: оформлен | Сумма: ${formatPrice(total)}`,
      });
      setOrderPlaced(true);
      setCustomerName('');
      setPhone('');
      setAddress('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Ошибка при оформлении заказа';
      toast.error(message);
    } finally {
      setOrderLoading(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-12 py-8 md:py-12">
      <div className="mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-medium text-[#1A1314] mb-2">
          Корзина оформление заказа
        </h1>
        <p className="text-[#680018] text-xs md:text-sm">Оформление заказа</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 md:gap-12">
        {/* Left: Cart Items */}
        <div className="flex-1 bg-white p-4 md:p-6 shadow-sm rounded-md border border-gray-100">

          {/* Table header — clickable columns */}
          <div className="hidden md:grid grid-cols-12 text-xs md:text-sm font-medium text-[#1A1314] border-b border-gray-200 pb-3 md:pb-4 mb-3 md:mb-4">
            <div className="col-span-1">Фото</div>
            <button
              onClick={() => handleColumnSort('name')}
              className="col-span-3 flex items-center hover:text-[#680018] transition-colors select-none text-left"
            >
              Наименование продукта
              <SortIcon column="name" />
            </button>
            <button
              onClick={() => handleColumnSort('quantity')}
              className="col-span-2 flex items-center justify-center hover:text-[#680018] transition-colors select-none"
            >
              Количество
              <SortIcon column="quantity" />
            </button>
            <button
              onClick={() => handleColumnSort('total')}
              className="col-span-3 flex items-center justify-center hover:text-[#680018] transition-colors select-none"
            >
              Общая сумма
              <SortIcon column="total" />
            </button>
            <button
              onClick={() => handleColumnSort('status')}
              className="col-span-3 flex items-center justify-center hover:text-[#680018] transition-colors select-none"
            >
              Статус
              <SortIcon column="status" />
            </button>
          </div>

          {/* Mobile: sort buttons row */}
          {items.length > 0 && (
            <div className="md:hidden flex flex-wrap gap-2 mb-3 pb-3 border-b border-gray-200">
              <button
                onClick={() => handleColumnSort('name')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs border transition-colors ${
                  cartSort.column === 'name'
                    ? 'border-[#680018] text-[#680018] bg-[#680018]/5'
                    : 'border-gray-200 text-[#1A1314] bg-white'
                }`}
              >
                Наименование <SortIcon column="name" />
              </button>
              <button
                onClick={() => handleColumnSort('quantity')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs border transition-colors ${
                  cartSort.column === 'quantity'
                    ? 'border-[#680018] text-[#680018] bg-[#680018]/5'
                    : 'border-gray-200 text-[#1A1314] bg-white'
                }`}
              >
                Кол-во <SortIcon column="quantity" />
              </button>
              <button
                onClick={() => handleColumnSort('total')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs border transition-colors ${
                  cartSort.column === 'total'
                    ? 'border-[#680018] text-[#680018] bg-[#680018]/5'
                    : 'border-gray-200 text-[#1A1314] bg-white'
                }`}
              >
                Сумма <SortIcon column="total" />
              </button>
              <button
                onClick={() => handleColumnSort('status')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs border transition-colors ${
                  cartSort.column === 'status'
                    ? 'border-[#680018] text-[#680018] bg-[#680018]/5'
                    : 'border-gray-200 text-[#1A1314] bg-white'
                }`}
              >
                Статус <SortIcon column="status" />
              </button>
            </div>
          )}

          <div className="space-y-4 md:space-y-6">
            {sortedItems.map((item) => (
              <div
                key={item.product.id}
                className="grid grid-cols-12 items-center text-xs md:text-sm gap-2"
              >
                {/* Photo */}
                <div className="col-span-2 md:col-span-1 flex items-center justify-center">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-12 h-16 md:w-16 md:h-20 object-cover rounded-sm"
                    style={{ backgroundColor: '#FFFFFF' }}
                  />
                </div>
                {/* Name */}
                <div className="col-span-4 md:col-span-3 text-sm md:text-base font-medium text-[#1A1314]">
                  {item.product.name}
                </div>
                {/* Quantity */}
                <div className="col-span-3 md:col-span-2 flex justify-center items-center">
                  <div className="flex items-center">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-7 h-7 md:w-9 md:h-9 border flex items-center justify-center hover:bg-[#F2E5D5] transition-colors text-xs md:text-sm"
                      style={{ backgroundColor: '#FCF7F1', borderColor: '#EDDCCC' }}
                    >
                      −
                    </button>
                    <div
                      className="w-8 h-7 md:w-12 md:h-9 border-t border-b bg-white flex items-center justify-center font-medium text-xs md:text-sm"
                      style={{ borderColor: '#EDDCCC' }}
                    >
                      {item.quantity}
                    </div>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-7 h-7 md:w-9 md:h-9 border flex items-center justify-center hover:bg-[#F2E5D5] transition-colors text-xs md:text-sm"
                      style={{ backgroundColor: '#FCF7F1', borderColor: '#EDDCCC' }}
                    >
                      +
                    </button>
                  </div>
                </div>
                {/* Total */}
                <div className="col-span-3 md:col-span-3 flex justify-center items-center">
                  <span className="text-sm md:text-lg font-medium text-[#1A1314]">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
                {/* Status */}
                <div className="hidden md:flex col-span-3 items-center justify-center">
                  <span className={`text-sm font-medium px-3 py-1 rounded-md whitespace-nowrap ${
                    orderPlaced
                      ? 'bg-[#680018] text-white'
                      : 'bg-gray-100 text-[#706567]'
                  }`}>
                    {orderPlaced ? 'оформлен' : 'в корзине'}
                  </span>
                </div>

              </div>
            ))}
            {items.length === 0 && (
              <div className="text-center py-10 md:py-12">
                <p className="text-[#706567] text-base md:text-lg mb-4">Корзина пуста</p>
                <button
                  onClick={() => onNavigate('catalog')}
                  className="text-[#680018] text-sm font-medium hover:underline"
                >
                  Перейти в каталог →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Checkout Form */}
        <div className="w-full lg:w-[380px] md:w-[400px]">
          <div
            className="p-5 md:p-8 rounded-md border border-gray-200 shadow-sm"
            style={{ backgroundColor: '#F9F7F5' }}
          >
            <div className="flex justify-between items-center mb-5 md:mb-6">
              <h2 className="text-lg md:text-xl font-medium text-[#1A1314]">
                Оформление заказа
              </h2>
              <Wallet className="w-4 h-4 md:w-5 md:h-5 text-[#706567]" />
            </div>

            <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Имя"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-md text-xs md:text-sm outline-none focus:ring-1 focus:ring-[#680018]"
                  style={{ backgroundColor: '#EFE6E1' }}
                />
                <User className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 text-[#680018]" />
              </div>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="Телефон"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-md text-xs md:text-sm outline-none focus:ring-1 focus:ring-[#680018]"
                  style={{ backgroundColor: '#EFE6E1' }}
                />
                <Phone className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 text-[#680018]" />
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Адрес"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-md text-xs md:text-sm outline-none focus:ring-1 focus:ring-[#680018]"
                  style={{ backgroundColor: '#EFE6E1' }}
                />
                <MapPin className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 text-[#680018]" />
              </div>
            </div>

            <div className="mb-6 md:mb-8">
              <h3 className="text-xs md:text-sm text-[#706567] mb-2.5 md:mb-3">Методы оплаты</h3>
              <div className="grid grid-cols-3 gap-2.5 md:gap-3">
                {/* Payme */}
                <button
                  onClick={() => setPaymentMethod('payme')}
                  className={
                    'border-2 bg-white rounded-md py-3 md:py-4 flex items-center justify-center font-bold relative text-sm md:text-lg transition-all duration-300 ' +
                    (paymentMethod === 'payme' ? 'border-[#680018]' : 'border-gray-200 hover:border-[#680018]')
                  }
                  style={{ color: '#38B2AC' }}
                >
                  <span className="italic">payme</span>
                  {paymentMethod === 'payme' && (
                    <div
                      className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: '#680018' }}
                    >
                      <svg viewBox="0 0 10 10" className="w-2.5 h-2.5 fill-white">
                        <path d="M3.5 7.5L1.5 5.5L2.2 4.8L3.5 6.1L7.8 1.8L8.5 2.5L3.5 7.5Z" />
                      </svg>
                    </div>
                  )}
                </button>
                {/* Uzum */}
                <button
                  onClick={() => setPaymentMethod('uzum')}
                  className={
                    'border-2 bg-white rounded-md py-3 md:py-4 flex items-center justify-center font-bold relative text-sm md:text-lg transition-all duration-300 ' +
                    (paymentMethod === 'uzum' ? 'border-[#680018]' : 'border-gray-200 hover:border-[#680018]')
                  }
                  style={{ color: '#7B2FF2' }}
                >
                  uzum
                  {paymentMethod === 'uzum' && (
                    <div
                      className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: '#680018' }}
                    >
                      <svg viewBox="0 0 10 10" className="w-2.5 h-2.5 fill-white">
                        <path d="M3.5 7.5L1.5 5.5L2.2 4.8L3.5 6.1L7.8 1.8L8.5 2.5L3.5 7.5Z" />
                      </svg>
                    </div>
                  )}
                </button>
                {/* Click */}
                <button
                  onClick={() => setPaymentMethod('click')}
                  className={
                    'border-2 bg-white rounded-md py-3 md:py-4 flex items-center justify-center font-bold relative text-sm md:text-lg transition-all duration-300 ' +
                    (paymentMethod === 'click' ? 'border-[#680018]' : 'border-gray-200 hover:border-[#680018]')
                  }
                  style={{ color: '#3182CE' }}
                >
                  click
                  {paymentMethod === 'click' && (
                    <div
                      className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: '#680018' }}
                    >
                      <svg viewBox="0 0 10 10" className="w-2.5 h-2.5 fill-white">
                        <path d="M3.5 7.5L1.5 5.5L2.2 4.8L3.5 6.1L7.8 1.8L8.5 2.5L3.5 7.5Z" />
                      </svg>
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Total */}
            {items.length > 0 && (
              <div className="flex justify-between items-center mb-4 md:mb-6 pb-3 md:pb-4 border-b border-gray-200">
                <span className="text-sm text-[#706567]">Итого:</span>
                <span className="text-lg md:text-xl font-medium text-[#1A1314]">
                  {formatPrice(total)}
                </span>
              </div>
            )}

            {/* Operator bilan bog'lanish */}
            <button
              onClick={() => window.open('tel:+998901234567')}
              className="w-full flex items-center justify-center gap-2 py-3 md:py-4 font-medium rounded-md transition-all duration-300 tracking-wide border-2 border-[#680018] text-[#680018] hover:bg-[#680018] hover:text-white mb-3"
            >
              <Phone className="w-4 h-4 md:w-5 md:h-5" />
              Связаться с оператором
            </button>

            <button
              onClick={handleOrder}
              disabled={orderLoading || orderPlaced}
              className="w-full text-white py-3 md:py-4 font-medium rounded-md transition-colors tracking-wide hover:bg-[#680018] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#2D020C' }}
            >
              {orderLoading ? 'Оформление...' : orderPlaced ? 'Заказ оформлен' : 'Оформить заказ'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────── Main Page ──────────────── */
export default function Home() {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogCollection, setCatalogCollection] = useState('');
  const [contactOpen, setContactOpen] = useState(false);

  const navigate = useCallback((page: PageView) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const selectProduct = useCallback((product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F9F7F5' }}>
      <Header onNavigate={navigate} currentPage={currentPage} onSearch={(query) => { setCatalogSearch(query); setCatalogCollection(''); setCurrentPage('catalog'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} onCollectionNavigate={(col) => { setCatalogCollection(col); setCatalogSearch(''); setCurrentPage('catalog'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} onContactClick={() => setContactOpen(true)} />
      <main className="flex-1">
        <div
          key={currentPage + (selectedProduct?.id || '')}
          className="animate-fadeIn"
          style={{ animation: 'fadeIn 0.4s ease-out' }}
        >
          {currentPage === 'home' && (
            <HomePage onNavigate={navigate} onSelectProduct={selectProduct} onCollectionNavigate={(col) => { setCatalogCollection(col); setCatalogSearch(''); setCurrentPage('catalog'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
          )}
          {currentPage === 'catalog' && (
            <CatalogPage key={`${catalogSearch}-${catalogCollection}`} onSelectProduct={selectProduct} initialSearch={catalogSearch} initialCollection={catalogCollection} />
          )}
          {currentPage === 'product' && selectedProduct && (
            <ProductPage product={selectedProduct} onNavigate={navigate} onSelectProduct={selectProduct} />
          )}
          {currentPage === 'cart' && (
            <CartPage onNavigate={navigate} />
          )}
        </div>
        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </main>
      <Footer onCollectionNavigate={(col) => { setCatalogCollection(col); setCatalogSearch(''); setCurrentPage('catalog'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}