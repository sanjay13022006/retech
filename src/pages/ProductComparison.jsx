
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ShoppingBag,
  X,
  Scale
} from 'lucide-react'

import { useCompare } from '../context/CompareContext'
import { useCart } from '../context/CartContext'

// Format prices in Indian Rupees
const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price)

// Format specification names
const labelFor = (key) =>
  key
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/^./, (letter) => letter.toUpperCase())

export default function ProductComparison() {
  const navigate = useNavigate()

  const { addToCart } = useCart()

  const {
    compareProducts,
    removeFromCompare,
    clearCompare
  } = useCompare()

  const selectedProducts = compareProducts

  // Collect all specification keys
  const specKeys = [
    ...new Set(
      selectedProducts.flatMap((product) =>
        Object.keys(product.specifications || {})
      )
    )
  ]

  // Comparison rows
  const rows = [
    {
      key: 'category',
      label: 'Category',
      value: (p) => p.category
    },
    {
      key: 'price',
      label: 'Current price',
      value: (p) => formatPrice(p.price)
    },
    {
      key: 'originalPrice',
      label: 'Original price',
      value: (p) => formatPrice(p.originalPrice)
    },
    {
      key: 'condition',
      label: 'Condition',
      value: (p) => p.condition
    },
    {
      key: 'rating',
      label: 'Rating',
      value: (p) => `${p.rating} / 5`
    },
    ...specKeys.map((key) => ({
      key,
      label: labelFor(key),
      value: (p) =>
        p.specifications?.[key] || 'Not specified'
    }))
  ]

  return (
    <main className="min-h-screen bg-[#F8F5FA] px-4 sm:px-8 py-12">

      <div className="max-w-7xl mx-auto">

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-purple-700 font-semibold mb-6"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* Page heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">

          <div>
            <p className="text-purple-600 font-bold text-xs tracking-wider uppercase mb-2">
              RETECH PRODUCT COMPARISON
            </p>

            <h1 className="text-3xl md:text-4xl font-extrabold text-[#211B2B]">
              Compare Products
            </h1>

            <p className="text-gray-500 mt-2">
              Compare prices, condition and specifications before choosing.
            </p>
          </div>

          {selectedProducts.length > 0 && (
            <button
              onClick={clearCompare}
              className="text-sm text-red-600 hover:text-red-700 font-semibold"
            >
              Clear all products
            </button>
          )}

        </div>

        {/* Empty comparison state */}
        {selectedProducts.length < 2 ? (

          <div className="bg-white rounded-2xl p-10 text-center shadow-sm">

            <Scale
              size={42}
              className="mx-auto text-purple-400 mb-4"
            />

            <h2 className="text-xl font-bold text-gray-800">
              Select at least 2 products
            </h2>

            <p className="text-gray-500 mt-2 mb-6">
              Return to the shop and choose two or more products from the same category.
            </p>

            <button
              onClick={() => navigate('/shop')}
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-6 py-3 font-semibold"
            >
              Browse products
            </button>

          </div>

        ) : (

          /* Comparison table */
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[720px] border-collapse">

                {/* Product headers */}
                <thead>

                  <tr>

                    <th className="text-left p-5 bg-gray-50 w-44">
                      Product details
                    </th>

                    {selectedProducts.map((product) => (

                      <th
                        key={product.id}
                        className="p-5 text-center align-top min-w-[220px]"
                      >

                        <div className="relative">

                          <button
                            onClick={() => removeFromCompare(product.id)}
                            aria-label={`Remove ${product.name}`}
                            className="absolute -top-2 -right-2 p-2 rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-600"
                          >
                            <X size={15} />
                          </button>

                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-32 h-32 object-cover rounded-xl mx-auto mb-3"
                          />

                          <p className="font-bold text-[#211B2B]">
                            {product.name}
                          </p>

                          <p className="text-xs text-gray-500 mt-1">
                            {product.category}
                          </p>

                          <button
                            onClick={() =>
                              navigate(`/product/${product.id}`)
                            }
                            className="text-purple-600 text-sm font-semibold mt-2 hover:underline"
                          >
                            View details
                          </button>

                        </div>

                      </th>

                    ))}

                  </tr>

                </thead>

                {/* Comparison information */}
                <tbody>

                  {rows.map((row) => (

                    <tr
                      key={row.key}
                      className="border-t border-gray-100"
                    >

                      <th className="text-left p-4 bg-gray-50 text-sm font-semibold text-gray-600">
                        {row.label}
                      </th>

                      {selectedProducts.map((product) => (

                        <td
                          key={product.id}
                          className="p-4 text-center text-sm text-gray-700"
                        >
                          {row.value(product)}
                        </td>

                      ))}

                    </tr>

                  ))}

                  {/* Add to cart row */}
                  <tr className="border-t border-gray-100">

                    <th className="text-left p-4 bg-gray-50 text-sm font-semibold text-gray-600">
                      Purchase
                    </th>

                    {selectedProducts.map((product) => (

                      <td
                        key={product.id}
                        className="p-4 text-center"
                      >

                        <button
                          onClick={() => {
                            addToCart(product)
                            navigate('/cart')
                          }}
                          className="inline-flex items-center justify-center gap-2 bg-[#211B2B] hover:bg-purple-600 text-white rounded-xl px-4 py-3 text-sm font-semibold"
                        >
                          <ShoppingBag size={16} />
                          Add to cart
                        </button>

                      </td>

                    ))}

                  </tr>

                </tbody>

              </table>

            </div>

          </div>

        )}

        <p className="text-xs text-gray-400 mt-5">
          Specifications shown here are based on the product information currently entered in ReTech.
          Confirm the exact configuration and condition of each refurbished unit before purchase.
        </p>

      </div>

    </main>
  )
}
