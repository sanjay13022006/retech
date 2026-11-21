
import { ArrowRight, ShieldCheck, Recycle } from 'lucide-react'

export default function Hero() {
  return (
    <section className="bg-[#F8F5FA] min-h-[650px] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 grid md:grid-cols-2 gap-12 items-center">

        <div>
          <span className="inline-block bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            ♻️ Better Tech. Better Future.
          </span>

          <h1 className="text-5xl lg:text-7xl font-extrabold text-[#211B2B] leading-tight">
            Technology,
            <span className="text-purple-600"> Renewed.</span>
            <br />
            Possibilities,
            <span className="text-purple-600"> Unlimited.</span>
          </h1>

          <p className="text-gray-600 text-lg mt-7 max-w-lg leading-relaxed">
            Discover professionally refurbished smartphones,
            laptops and electronics. Premium technology,
            tested quality and prices you'll love.
          </p>

          <div className="flex flex-wrap gap-4 mt-9">
            <a
              href="#shop"
              className="bg-purple-600 text-white px-7 py-4 rounded-xl font-bold flex items-center gap-3 hover:bg-purple-700 transition"
            >
              Explore Collection
              <ArrowRight size={20} />
            </a>

            <a
              href="#why-retech"
              className="border border-gray-300 px-7 py-4 rounded-xl font-bold text-gray-800 hover:bg-white transition"
            >
              How It Works
            </a>
          </div>

          <div className="flex gap-8 mt-12">
            <div>
              <ShieldCheck className="text-purple-600 mb-2" size={25} />
              <p className="font-bold text-gray-900">Quality Tested</p>
              <p className="text-sm text-gray-500">Every device</p>
            </div>

            <div>
              <Recycle className="text-purple-600 mb-2" size={25} />
              <p className="font-bold text-gray-900">Eco Friendly</p>
              <p className="text-sm text-gray-500">Smarter choices</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-5 bg-purple-200 rounded-full blur-3xl opacity-50" />

          <img
            src="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1000"
            alt="Premium smartphone"
            className="relative w-full max-w-lg mx-auto h-[430px] object-cover rounded-[30px] shadow-2xl"
          />

          <div className="absolute bottom-7 left-2 md:-left-8 bg-white p-5 rounded-2xl shadow-xl">
            <p className="text-sm text-gray-500">A smarter way to upgrade</p>
            <p className="text-xl font-extrabold text-purple-700">
              Save more. Waste less.
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}
