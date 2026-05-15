import { Facebook, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer
      className="text-white pt-16 pb-8 px-6 md:px-12 mt-auto"
      style={{ backgroundColor: '#2D020C' }}
    >
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-white/15 pb-12 mb-8">
        <div>
          <h3 className="font-medium text-lg mb-6 tracking-wide">Продукты</h3>
          <ul className="space-y-4 text-sm text-white/75">
            <li><Link to="/catalog?collection=spring" className="hover:text-white transition-colors">Весенняя коллекция</Link></li>
            <li><Link to="/catalog?collection=summer" className="hover:text-white transition-colors">Летняя коллекция</Link></li>
            <li><Link to="/catalog?collection=autumn" className="hover:text-white transition-colors">Осенняя коллекция</Link></li>
            <li><Link to="/catalog?collection=winter" className="hover:text-white transition-colors">Зимняя коллекция</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-medium text-lg mb-6 tracking-wide">Компания</h3>
          <ul className="space-y-4 text-sm text-white/75">
            <li><Link to="/about" className="hover:text-white transition-colors">О нас</Link></li>
            <li><Link to="/careers" className="hover:text-white transition-colors">Карьера</Link></li>
            <li><Link to="/sustainability" className="hover:text-white transition-colors">Устойчивое развитие</Link></li>
            <li><Link to="/press" className="hover:text-white transition-colors">Пресса</Link></li>
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
          <form className="flex w-full" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Email address"
              className="bg-black/30 border border-white/15 text-white placeholder-white/40 px-4 py-2.5 text-sm outline-none flex-grow focus:border-white/40"
            />
            <button
              type="submit"
              className="bg-white/10 hover:bg-white/20 border border-transparent transition-colors px-6 py-2.5 text-sm font-medium"
            >
              Join
            </button>
          </form>
        </div>
      </div>
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center text-xs text-white/50">
        <p>© 2026 SARPO. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <Link to="/privacy" className="hover:text-white transition-colors">Политика конфиденциальности</Link>
          <Link to="/terms" className="hover:text-white transition-colors">Условия использования</Link>
          <Link to="/legal" className="hover:text-white transition-colors">Публичная оферта</Link>
        </div>
      </div>
    </footer>
  );
}
