
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Scale, X } from 'lucide-react'
import { useCompare } from '../context/CompareContext'

export default function CompareBar() {
  const navigate = useNavigate()

  const {
    compareProducts,
    removeFromCompare,
    clearCompare
  } = useCompare()

  // Hide the bar when no products are selected
  if (compareProducts.length === 0) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-3xl">

      <div className="bg-[#211B2B] text-white rounded-2xl shadow-2xl p-4">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

          {/* Comparison heading */}
          <div className="flex items-center gap-3">

            <div className="bg-purple-600 p-3 rounded-xl">
              <Scale size={20} />
            </div>

            <div>
              <p className="font-bold">
                Compare products
              </p>

              <p className="text-xs text-purple-200">
                {compareProducts.length} of 4 products selected
              </p>
            </div>

          </div>

          {/* Selected products */}
          <div className="flex flex-wrap items-center gap-2">

            {compareProducts.map((product) => (

              <span
                key={product.id}
                className="inline-flex items-center gap-1 bg-white/10 rounded-full px-3 py-1 text-xs"
              >
                {product.name}

                <button
                  onClick={() => removeFromCompare(product.id)}
                  aria-label={`Remove ${product.name} from comparison`}
                  className="hover:text-purple-300"
                >
                  <X size={13} />
                </button>

              </span>

            ))}

          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">

            <button
              onClick={clearCompare}
              className="text-sm text-purple-200 hover:text-white px-2 py-2"
            >
              Clear
            </button>

            <button
              onClick={() => navigate('/compare')}
              disabled={compareProducts.length < 2}
              className="bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl px-4 py-3 text-sm font-bold flex items-center gap-2"
            >
              Compare
              <ArrowRight size={16} />
            </button>

          </div>

        </div>

      </div>

    </div>
  )
}
