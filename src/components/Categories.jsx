
import { ArrowUpRight } from 'lucide-react'

const categories = [
  {
    name: 'Smartphones',
    count: 'Explore phones',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=700',
  },
  {
    name: 'Laptops',
    count: 'Explore laptops',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=700',
  },
  {
    name: 'Audio',
    count: 'Explore audio',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700',
  },
  {
    name: 'Wearables',
    count: 'Explore wearables',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700',
  },
]

export default function Categories() {
  return (
    <section id="categories" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="text-purple-600 font-bold text-sm mb-3">
              FIND YOUR NEXT DEVICE
            </p>
            <h2 className="text-4xl font-extrabold text-[#211B2B]">
              Shop by Category
            </h2>
            <p className="text-gray-500 mt-3">
              Quality technology for every part of your life.
            </p>
          </div>

          <a href="#shop" className="hidden sm:flex items-center gap-2 text-purple-700 font-bold">
            View all <ArrowUpRight size={18} />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <a
              href="#shop"
              key={category.name}
              className="group bg-[#F8F5FA] rounded-2xl overflow-hidden hover:shadow-xl transition duration-300"
            >
              <div className="h-56 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>

              <div className="p-6 flex justify-between items-center">
                <div>
                  <h3 className="font-extrabold text-xl text-[#211B2B]">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {category.count}
                  </p>
                </div>

                <ArrowUpRight className="text-purple-600" />
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  )
}
