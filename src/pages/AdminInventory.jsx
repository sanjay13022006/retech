
import { useEffect, useMemo, useState } from 'react'
import {
  Boxes,
  Package,
  AlertTriangle,
  RefreshCw,
  Save,
  Search,
  CheckCircle,
  XCircle
} from 'lucide-react'

import { supabase } from '../lib/supabase'
import { products } from '../components/Products'

const DEFAULT_THRESHOLD = 5

export default function AdminInventory() {
  const [inventory, setInventory] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [savingIds, setSavingIds] = useState([])
  const [message, setMessage] = useState('')

  // Fetch inventory records from Supabase
  const fetchInventory = async () => {
    setLoading(true)
    setError('')
    setMessage('')

    const { data, error } = await supabase
      .from('inventory')
      .select('product_id, stock_quantity, low_stock_threshold')

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    const inventoryMap = {}

    ;(data || []).forEach(item => {
      inventoryMap[item.product_id] = {
        stock_quantity: item.stock_quantity,
        low_stock_threshold: item.low_stock_threshold
      }
    })

    setInventory(inventoryMap)
    setLoading(false)
  }

  useEffect(() => {
    fetchInventory()
  }, [])

  // Update stock fields locally
  const handleChange = (productId, field, value) => {
    setInventory(prev => ({
      ...prev,
      [productId]: {
        stock_quantity:
          prev[productId]?.stock_quantity ?? 0,
        low_stock_threshold:
          prev[productId]?.low_stock_threshold ?? DEFAULT_THRESHOLD,
        [field]: value
      }
    }))

    setMessage('')
  }

  // Save stock for one product
  const saveStock = async (product) => {
    const productId = product.id
    const current = inventory[productId] || {}

    const stock = Number(current.stock_quantity)
    const threshold = Number(current.low_stock_threshold)

    if (
      !Number.isInteger(stock) ||
      stock < 0 ||
      !Number.isInteger(threshold) ||
      threshold < 0
    ) {
      setError('Stock quantity and low-stock threshold must be non-negative whole numbers.')
      return
    }

    setSavingIds(prev => [...prev, productId])
    setError('')
    setMessage('')

    const { error } = await supabase
      .from('inventory')
      .upsert(
        {
          product_id: productId,
          stock_quantity: stock,
          low_stock_threshold: threshold
        },
        {
          onConflict: 'product_id'
        }
      )

    if (error) {
      setError(`Unable to save ${product.name}: ${error.message}`)
    } else {
      setMessage(`Stock updated successfully for ${product.name}.`)
    }

    setSavingIds(prev =>
      prev.filter(id => id !== productId)
    )
  }

  // Build product list with inventory information
  const inventoryProducts = useMemo(() => {
    return products.map(product => {
      const record = inventory[product.id]

      return {
        ...product,
        stock_quantity: record?.stock_quantity ?? 0,
        low_stock_threshold:
          record?.low_stock_threshold ?? DEFAULT_THRESHOLD
      }
    })
  }, [inventory])

  // Search products
  const filteredProducts = inventoryProducts.filter(product => {
    const term = search.toLowerCase().trim()

    if (!term) return true

    return (
      product.name.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term) ||
      String(product.id).includes(term)
    )
  })

  // Dashboard statistics
  const totalProducts = inventoryProducts.length

  const totalStock = inventoryProducts.reduce(
    (sum, product) =>
      sum + Number(product.stock_quantity || 0),
    0
  )

  const lowStockProducts = inventoryProducts.filter(
    product =>
      Number(product.stock_quantity) > 0 &&
      Number(product.stock_quantity) <=
        Number(product.low_stock_threshold)
  ).length

  const outOfStockProducts = inventoryProducts.filter(
    product => Number(product.stock_quantity) === 0
  ).length

  const getStockStatus = (product) => {
    const stock = Number(product.stock_quantity)
    const threshold = Number(product.low_stock_threshold)

    if (stock === 0) {
      return {
        label: 'Out of Stock',
        className: 'bg-red-100 text-red-700'
      }
    }

    if (stock <= threshold) {
      return {
        label: 'Low Stock',
        className: 'bg-yellow-100 text-yellow-700'
      }
    }

    return {
      label: 'In Stock',
      className: 'bg-green-100 text-green-700'
    }
  }

  const stats = [
    {
      title: 'Total Products',
      value: totalProducts,
      icon: Package,
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    },
    {
      title: 'Total Stock Units',
      value: totalStock,
      icon: Boxes,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      title: 'Low Stock',
      value: lowStockProducts,
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bg: 'bg-yellow-100'
    },
    {
      title: 'Out of Stock',
      value: outOfStockProducts,
      icon: XCircle,
      color: 'text-red-600',
      bg: 'bg-red-100'
    }
  ]

  return (
    <div className="min-h-screen bg-[#F8F5FA]">

      {/* Header */}
      <header className="bg-white border-b px-5 sm:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between gap-4 sm:items-center">

          <div>
            <h1 className="text-2xl font-extrabold text-[#211B2B]">
              Inventory Management
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Manage product stock and low-stock alerts.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">

            <button
              onClick={fetchInventory}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border bg-white hover:bg-gray-50 text-sm font-semibold disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={loading ? 'animate-spin' : ''}
              />
              Refresh
            </button>

            <a
              href="/admin"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold"
            >
              Back to Dashboard
            </a>

          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-5 py-8">

        {/* Page heading */}
        <div className="mb-8">
          <p className="text-purple-600 text-xs font-bold uppercase">
            RETECH ADMIN
          </p>

          <h2 className="text-3xl font-extrabold text-[#211B2B] mt-2">
            Stock Overview
          </h2>

          <p className="text-gray-500 mt-2">
            Update the available quantity and low-stock threshold for each product.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

          {stats.map(stat => {
            const Icon = stat.icon

            return (
              <div
                key={stat.title}
                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm"
              >
                <div className="flex justify-between items-center">

                  <div>
                    <p className="text-sm text-gray-500">
                      {stat.title}
                    </p>

                    <h3 className="text-3xl font-extrabold text-[#211B2B] mt-2">
                      {stat.value}
                    </h3>
                  </div>

                  <div className={`${stat.bg} ${stat.color} p-4 rounded-xl`}>
                    <Icon size={23} />
                  </div>

                </div>
              </div>
            )
          })}

        </div>

        {/* Messages */}
        {error && (
          <div className="mb-5 p-4 rounded-xl bg-red-50 text-red-700 flex items-start gap-2 text-sm">
            <XCircle size={19} className="shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        {message && (
          <div className="mb-5 p-4 rounded-xl bg-green-50 text-green-700 flex items-start gap-2 text-sm">
            <CheckCircle size={19} className="shrink-0 mt-0.5" />
            {message}
          </div>
        )}

        {/* Inventory table */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          <div className="p-5 sm:p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between gap-4">

            <div>
              <h3 className="text-xl font-bold text-[#211B2B]">
                Product Inventory
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                {filteredProducts.length} products displayed
              </p>
            </div>

            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-3 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full md:w-72 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-purple-500"
              />
            </div>

          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-500">
              <RefreshCw
                size={25}
                className="animate-spin mx-auto mb-3"
              />
              Loading inventory...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No products found.
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[850px] text-left">

                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="p-5">Product</th>
                    <th className="p-5">Category</th>
                    <th className="p-5">Available Stock</th>
                    <th className="p-5">Low Stock Alert</th>
                    <th className="p-5">Status</th>
                    <th className="p-5">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map(product => {
                    const status = getStockStatus(product)
                    const isSaving = savingIds.includes(product.id)

                    return (
                      <tr
                        key={product.id}
                        className="border-t border-gray-100 hover:bg-gray-50"
                      >

                        {/* Product */}
                        <td className="p-5">
                          <div className="flex items-center gap-3">

                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-14 h-14 rounded-xl object-cover bg-gray-100"
                            />

                            <div>
                              <p className="font-semibold text-[#211B2B]">
                                {product.name}
                              </p>

                              <p className="text-xs text-gray-400 mt-1">
                                Product ID: {product.id}
                              </p>
                            </div>

                          </div>
                        </td>

                        {/* Category */}
                        <td className="p-5 text-sm text-gray-600">
                          {product.category}
                        </td>

                        {/* Stock quantity */}
                        <td className="p-5">
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={product.stock_quantity}
                            onChange={e =>
                              handleChange(
                                product.id,
                                'stock_quantity',
                                e.target.value
                              )
                            }
                            className="w-24 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-purple-500"
                          />
                        </td>

                        {/* Threshold */}
                        <td className="p-5">
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={product.low_stock_threshold}
                            onChange={e =>
                              handleChange(
                                product.id,
                                'low_stock_threshold',
                                e.target.value
                              )
                            }
                            className="w-24 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-purple-500"
                          />
                        </td>

                        {/* Status */}
                        <td className="p-5">
                          <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${status.className}`}>
                            {status.label}
                          </span>
                        </td>

                        {/* Save */}
                        <td className="p-5">
                          <button
                            onClick={() => saveStock(product)}
                            disabled={isSaving}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white text-sm font-semibold transition"
                          >
                            {isSaving ? (
                              <>
                                <RefreshCw size={16} className="animate-spin" />
                                Saving
                              </>
                            ) : (
                              <>
                                <Save size={16} />
                                Save
                              </>
                            )}
                          </button>
                        </td>

                      </tr>
                    )
                  })}
                </tbody>

              </table>
            </div>
          )}

        </section>

        {/* Information */}
        <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-5">
          <h3 className="font-bold text-blue-900 mb-2">
            How stock alerts work
          </h3>

          <ul className="text-sm text-blue-800 space-y-2">
            <li>
              <strong>In Stock:</strong> Quantity is greater than the low-stock threshold.
            </li>
            <li>
              <strong>Low Stock:</strong> Quantity is above zero but at or below the threshold.
            </li>
            <li>
              <strong>Out of Stock:</strong> Quantity is zero.
            </li>
            <li>
              <strong>Save:</strong> Saves the selected product's stock information to Supabase.
            </li>
          </ul>
        </div>

      </main>
    </div>
  )
}
