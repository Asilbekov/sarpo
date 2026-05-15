import { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { products } from '../data/products';
import { Trash2, User, Phone, Map, Wallet, CreditCard } from 'lucide-react';

export function Cart() {
  const [cartItems, setCartItems] = useState([
    { ...products[3], qty: 1 },
    { ...products[5], qty: 1 },
    { ...products[3], qty: 1 },
  ]);

  const updateQty = (index: number, newQty: number) => {
    if (newQty < 1) return;
    const newItems = [...cartItems];
    newItems[index].qty = newQty;
    setCartItems(newItems);
  };

  const remove = (index: number) => {
    const newItems = [...cartItems];
    newItems.splice(index, 1);
    setCartItems(newItems);
  };

  return (
    <Layout>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-medium text-[#1A1314] mb-2">Корзина оформление заказа</h1>
          <p className="text-[#680018] text-sm">Оформление заказа</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left: Cart Items */}
          <div className="flex-1 bg-white p-6 shadow-sm rounded-md border border-gray-100">
            <div className="grid grid-cols-12 text-sm font-medium text-[#1A1314] border-b border-gray-200 pb-4 mb-4">
              <div className="col-span-2">Фото</div>
              <div className="col-span-4">Наименование продукта</div>
              <div className="col-span-3 text-center">Количество</div>
              <div className="col-span-3 text-right">Общая сумма</div>
            </div>

            <div className="space-y-6">
              {cartItems.map((item, i) => (
                <div key={i} className="grid grid-cols-12 items-center text-sm">
                  <div className="col-span-2">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-20 object-cover rounded-sm"
                      style={{ backgroundColor: '#FBF1DC' }}
                    />
                  </div>
                  <div className="col-span-4 text-base font-medium text-[#1A1314] flex items-center">
                    {item.name}
                  </div>
                  <div className="col-span-3 flex justify-center items-center">
                    <div className="flex items-center">
                      <button
                        onClick={() => updateQty(i, item.qty - 1)}
                        className="w-9 h-9 border flex items-center justify-center hover:bg-[#F2E5D5] transition-colors"
                        style={{ backgroundColor: '#FCF7F1', borderColor: '#EDDCCC' }}
                      >
                        −
                      </button>
                      <div
                        className="w-12 h-9 border-t border-b bg-white flex items-center justify-center font-medium"
                        style={{ borderColor: '#EDDCCC' }}
                      >
                        {item.qty}
                      </div>
                      <button
                        onClick={() => updateQty(i, item.qty + 1)}
                        className="w-9 h-9 border flex items-center justify-center hover:bg-[#F2E5D5] transition-colors"
                        style={{ backgroundColor: '#FCF7F1', borderColor: '#EDDCCC' }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="col-span-3 flex justify-end items-center gap-6">
                    <span className="text-lg font-medium text-[#1A1314]">
                      {(item.price * item.qty).toFixed(0)} $
                    </span>
                    <button
                      onClick={() => remove(i)}
                      className="text-[#680018] hover:text-[#2D020C] transition-colors"
                      aria-label="Удалить"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
              {cartItems.length === 0 && (
                <p className="text-center text-[#706567] py-12">Корзина пуста</p>
              )}
            </div>
          </div>

          {/* Right: Checkout Form */}
          <div className="w-full lg:w-[400px]">
            <div className="p-8 rounded-md border border-gray-200 shadow-sm" style={{ backgroundColor: '#F9F7F5' }}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium text-[#1A1314]">Оформление заказа</h2>
                <Wallet className="w-5 h-5 text-[#706567]" />
              </div>

              <div className="space-y-4 mb-8">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Имя"
                    className="w-full px-4 py-3 rounded-md text-sm outline-none focus:ring-1 focus:ring-[#680018]"
                    style={{ backgroundColor: '#EFE6E1' }}
                  />
                  <User className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#680018]" />
                </div>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="Телефон"
                    className="w-full px-4 py-3 rounded-md text-sm outline-none focus:ring-1 focus:ring-[#680018]"
                    style={{ backgroundColor: '#EFE6E1' }}
                  />
                  <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#680018]" />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Адрес"
                    className="w-full px-4 py-3 rounded-md text-sm outline-none focus:ring-1 focus:ring-[#680018]"
                    style={{ backgroundColor: '#EFE6E1' }}
                  />
                  <Map className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#680018]" />
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-sm text-[#706567] mb-3">Методы оплаты</h3>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <button
                    className="border-2 bg-white rounded-md py-3 flex items-center justify-center font-bold relative"
                    style={{ borderColor: '#680018', color: '#38B2AC' }}
                  >
                    <span className="italic text-lg">payme</span>
                    <div
                      className="absolute top-1 right-1 w-3 h-3 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: '#680018' }}
                    >
                      <svg viewBox="0 0 10 10" className="w-2 h-2 fill-white">
                        <path d="M3.5 7.5L1.5 5.5L2.2 4.8L3.5 6.1L7.8 1.8L8.5 2.5L3.5 7.5Z" />
                      </svg>
                    </div>
                  </button>
                  <button
                    className="border border-gray-200 hover:border-[#680018] bg-white rounded-md py-3 flex items-center justify-center font-bold text-lg"
                    style={{ color: '#3182CE' }}
                  >
                    click
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    className="border border-gray-200 hover:border-[#680018] rounded-md py-3 flex items-center justify-center flex-col gap-1 text-sm text-[#1A1314]"
                    style={{ backgroundColor: '#F9F5F0' }}
                  >
                    <Wallet className="w-5 h-5 text-[#680018]" />
                    Наличные
                  </button>
                  <button
                    className="border border-gray-200 hover:border-[#680018] rounded-md py-3 flex items-center justify-center flex-col gap-1 text-sm text-[#1A1314]"
                    style={{ backgroundColor: '#F9F5F0' }}
                  >
                    <CreditCard className="w-5 h-5 text-[#680018]" />
                    Карта
                  </button>
                </div>
              </div>

              <button
                className="w-full text-white py-4 font-medium rounded-md transition-colors tracking-wide"
                style={{ backgroundColor: '#2D020C' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = '#680018')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2D020C')}
              >
                Оформить заказ
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
