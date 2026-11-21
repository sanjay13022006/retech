
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

import {
  ShoppingBag,
  IndianRupee,
  Users,
  Package,
  Search,
  RefreshCw,
  ArrowLeft,
  Eye,
  X,
  AlertCircle,
  CheckCircle,
  Truck,
  ClipboardCheck,
  Boxes
} from 'lucide-react'

const ADMIN_STATUSES = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled'
]

const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Number(price) || 0)

const formatDate = (date) => {
  if (!date) return 'N/A'

  return new Date(date).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  })
}

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-indigo-100 text-indigo-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700'
}

export default function Admin() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  const [selectedOrder, setSelectedOrder] = useState(null)

  const [orderItems, setOrderItems] = useState([])
  const [itemsLoading, setItemsLoading] = useState(false)
  const [itemsError, setItemsError] = useState('')

  // Status management
  const [statusDraft, setStatusDraft] = useState('pending')
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [statusError, setStatusError] = useState('')

  // Fetch orders
  const fetchOrders = async () => {
    setLoading(true)
    setError('')

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError(error.message)
      setOrders([])
    } else {
      setOrders(data || [])
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  // Fetch products for selected order
  useEffect(() => {
    if (!selectedOrder) {
      setOrderItems([])
      setItemsError('')
      return
    }

    let active = true

    const fetchOrderItems = async () => {
      setItemsLoading(true)
      setItemsError('')
      setOrderItems([])

      const { data, error } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', selectedOrder.id)

      if (!active) return

      if (error) {
        setItemsError(error.message)
        setOrderItems([])
      } else {
        setOrderItems(data || [])
      }

      setItemsLoading(false)
    }

    fetchOrderItems()

    return () => {
      active = false
    }
  }, [selectedOrder?.id])

  // Keep status dropdown synchronized with selected order
  useEffect(() => {
    if (selectedOrder) {
      setStatusDraft(
        (selectedOrder.status || 'pending').toLowerCase()
      )
      setStatusMessage('')
      setStatusError('')
    }
  }, [selectedOrder?.id, selectedOrder?.status])

  // Update order status and notify customer by email
  const handleStatusUpdate = async () => {
    if (!selectedOrder || updatingStatus) return

    const currentStatus = (
      selectedOrder.status || 'pending'
    ).toLowerCase()

    if (!ADMIN_STATUSES.includes(statusDraft)) {
      setStatusError('Please select a valid order status.')
      return
    }

    if (statusDraft === currentStatus) {
      setStatusMessage('Order status is already up to date.')
      setStatusError('')
      return
    }

    setUpdatingStatus(true)
    setStatusMessage('')
    setStatusError('')

    try {
      // 1. Save the new status in Supabase
      const { data, error } = await supabase
        .from('orders')
        .update({
          status: statusDraft
        })
        .eq('id', selectedOrder.id)
        .select()
        .single()

      if (error) throw error

      // 2. Update the dashboard immediately
      setOrders(prev =>
        prev.map(order =>
          order.id === data.id ? data : order
        )
      )

      setSelectedOrder(data)

      // 3. Send the status update email
      const { data: emailData, error: emailError } =
        await supabase.functions.invoke(
          'send-order-status-email',
          {
            body: {
              order_reference: data.order_reference,
              status: data.status
            }
          }
        )

      // 4. Show email delivery result
      if (emailError || !emailData?.success) {
        console.error(
          'Status email error:',
          emailError || emailData?.error
        )

        setStatusMessage(
          `Order status changed to ${data.status.toUpperCase()}, but the customer notification email could not be sent.`
        )
      } else {
        setStatusMessage(
          `Order status changed to ${data.status.toUpperCase()}. Customer notification email sent successfully.`
        )
      }

    } catch (error) {
      console.error('Status update error:', error)

      setStatusError(
        error.message || 'Unable to update order status.'
      )
    } finally {
      setUpdatingStatus(false)
    }
  }

  // Dashboard calculations
  const totalRevenue = orders.reduce(
    (sum, order) =>
      sum + Number(order.total_amount || 0),
    0
  )

  const totalCustomers = new Set(
    orders.map(order => order.email).filter(Boolean)
  ).size

  const pendingOrders = orders.filter(
    order =>
      (order.status || 'pending').toLowerCase() === 'pending'
  ).length

  // Search orders
  const filteredOrders = useMemo(() => {
    const term = search.toLowerCase().trim()

    if (!term) return orders

    return orders.filter(order =>
      [
        order.order_reference,
        order.customer_name,
        order.email,
        order.phone,
        order.status
      ].some(value =>
        String(value || '').toLowerCase().includes(term)
      )
    )
  }, [orders, search])

  // Dashboard statistics
  const stats = [
    {
      title: 'Total Orders',
      value: orders.length,
      icon: ShoppingBag,
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    },
    {
      title: 'Total Revenue',
      value: formatPrice(totalRevenue),
      icon: IndianRupee,
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    {
      title: 'Total Customers',
      value: totalCustomers,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      title: 'Pending Orders',
      value: pendingOrders,
      icon: Package,
      color: 'text-orange-600',
      bg: 'bg-orange-100'
    }
  ]

  return (
    <div className="min-h-screen bg-[#F8F5FA]">

      {/* Header */}
      <header className="bg-white border-b px-6 py-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

          <div>
            <Link
              to="/"
              className="text-2xl font-extrabold text-[#211B2B]"
            >
              retech<span className="text-purple-600">.</span>
            </Link>

            <p className="text-sm text-gray-500 mt-1">
              Administration Dashboard
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">

            {/* Device Health Reports button */}
            <Link
              to="/admin/health-reports"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition"
            >
              <ClipboardCheck size={17} />
              Device Health Reports
            </Link>

            {/* Inventory Management button */}
            <Link
              to="/admin/inventory"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition"
            >
              <Boxes size={17} />
              Inventory Management
            </Link>

            {/* Refresh */}
            <button
              onClick={fetchOrders}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-gray-50 text-sm font-semibold disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={loading ? 'animate-spin' : ''}
              />
              Refresh
            </button>

            {/* Store */}
            <Link
              to="/"
              className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-purple-600"
            >
              <ArrowLeft size={17} />
              Store
            </Link>

          </div>

        </div>
      </header>

      <main className="max-w-7xl mx-auto px-5 py-10">

        {/* Heading */}
        <div className="mb-8">
          <p className="text-purple-600 text-xs font-bold uppercase">
            RE TECH MANAGEMENT
          </p>

          <h1 className="text-3xl font-extrabold text-[#211B2B] mt-2">
            Dashboard Overview
          </h1>

          <p className="text-gray-500 mt-2">
            Monitor your store performance and customer orders.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">

          {stats.map((stat) => {
            const Icon = stat.icon

            return (
              <div
                key={stat.title}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
              >
                <div className="flex justify-between items-center">

                  <div>
                    <p className="text-sm text-gray-500">
                      {stat.title}
                    </p>

                    <h2 className="text-2xl font-extrabold text-[#211B2B] mt-3">
                      {stat.value}
                    </h2>
                  </div>

                  <div className={`${stat.bg} ${stat.color} p-4 rounded-xl`}>
                    <Icon size={23} />
                  </div>

                </div>
              </div>
            )
          })}

        </div>

        {/* Orders Table */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between gap-4">

            <div>
              <h2 className="text-xl font-bold text-[#211B2B]">
                Recent Orders
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Customer orders from your Supabase database.
              </p>
            </div>

            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-3 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search orders..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 w-full md:w-72 outline-none focus:border-purple-500"
              />
            </div>

          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-500">
              <RefreshCw className="animate-spin mx-auto mb-3" />
              Loading orders...
            </div>
          ) : error ? (
            <div className="p-10 text-center">
              <AlertCircle
                className="mx-auto text-red-500 mb-3"
                size={30}
              />

              <p className="font-semibold text-red-600">
                Unable to load orders
              </p>

              <p className="text-sm text-gray-500 mt-2">
                {error}
              </p>

              <button
                onClick={fetchOrders}
                className="mt-4 bg-purple-600 text-white px-5 py-2 rounded-lg"
              >
                Try Again
              </button>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No orders found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[850px]">

                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="p-5">Order ID</th>
                    <th className="p-5">Customer</th>
                    <th className="p-5">Date</th>
                    <th className="p-5">Payment</th>
                    <th className="p-5">Amount</th>
                    <th className="p-5">Status</th>
                    <th className="p-5">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.map(order => {
                    const status = (
                      order.status || 'pending'
                    ).toLowerCase()

                    return (
                      <tr
                        key={order.id}
                        className="border-t border-gray-100 hover:bg-gray-50"
                      >

                        <td className="p-5 font-semibold text-purple-600">
                          {order.order_reference}
                        </td>

                        <td className="p-5">
                          <p className="font-semibold text-[#211B2B]">
                            {order.customer_name}
                          </p>

                          <p className="text-xs text-gray-500 mt-1">
                            {order.email}
                          </p>
                        </td>

                        <td className="p-5 text-sm text-gray-500">
                          {formatDate(order.created_at)}
                        </td>

                        <td className="p-5 text-sm text-gray-600">
                          {order.payment_method || 'N/A'}
                        </td>

                        <td className="p-5 font-bold text-[#211B2B]">
                          {formatPrice(order.total_amount)}
                        </td>

                        <td className="p-5">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${statusStyles[status] || 'bg-gray-100 text-gray-600'}`}>
                            {status}
                          </span>
                        </td>

                        <td className="p-5">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="flex items-center gap-2 text-purple-600 font-semibold text-sm hover:text-purple-800"
                          >
                            <Eye size={16} />
                            View
                          </button>
                        </td>

                      </tr>
                    )
                  })}
                </tbody>

              </table>
            </div>
          )}

          <div className="p-5 border-t text-sm text-gray-500">
            Showing {filteredOrders.length} of {orders.length} orders
          </div>

        </section>
      </main>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedOrder(null)
            }
          }}
        >

          <div className="bg-white rounded-2xl w-full max-w-2xl p-7 max-h-[90vh] overflow-y-auto">

            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-[#211B2B]">
                  Order Details
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Customer order information
                </p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label="Close order details"
              >
                <X size={20} />
              </button>
            </div>

            {/* Order Reference */}
            <div className="bg-purple-50 rounded-xl p-4 mb-6 flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500">
                  ORDER REFERENCE
                </p>

                <p className="text-purple-600 font-bold text-lg mt-1">
                  {selectedOrder.order_reference}
                </p>
              </div>

              <span className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${statusStyles[(selectedOrder.status || 'pending').toLowerCase()] || 'bg-gray-100 text-gray-600'}`}>
                {selectedOrder.status || 'Pending'}
              </span>
            </div>

            {/* Customer Information */}
            <h3 className="font-bold text-[#211B2B] mb-4">
              Customer Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm mb-7">

              <div>
                <p className="text-gray-500">Customer Name</p>
                <p className="font-semibold mt-1">
                  {selectedOrder.customer_name || 'N/A'}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Email</p>
                <p className="font-semibold mt-1 break-all">
                  {selectedOrder.email || 'N/A'}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Phone</p>
                <p className="font-semibold mt-1">
                  {selectedOrder.phone || 'N/A'}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Order Date</p>
                <p className="font-semibold mt-1">
                  {formatDate(selectedOrder.created_at)}
                </p>
              </div>

            </div>

            {/* Delivery Address */}
            <div className="border-t border-gray-100 pt-5 mb-6">
              <h3 className="font-bold text-[#211B2B] mb-3">
                Delivery Address
              </h3>

              <p className="text-sm text-gray-600 leading-6">
                {selectedOrder.address || 'N/A'}
                {selectedOrder.city ? `, ${selectedOrder.city}` : ''}
                {selectedOrder.state ? `, ${selectedOrder.state}` : ''}
                {selectedOrder.pincode ? ` - ${selectedOrder.pincode}` : ''}
              </p>
            </div>

            {/* Products Ordered */}
            <div className="border-t border-gray-100 pt-5 mb-6">
              <h3 className="font-bold text-[#211B2B] mb-4">
                Products Ordered
              </h3>

              {itemsLoading ? (
                <div className="text-center py-6 text-gray-500">
                  <RefreshCw
                    className="animate-spin mx-auto mb-2"
                    size={22}
                  />
                  Loading products...
                </div>
              ) : itemsError ? (
                <div className="bg-red-50 text-red-600 rounded-xl p-4 text-sm">
                  Unable to load products: {itemsError}
                </div>
              ) : orderItems.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-5 text-center text-gray-500 text-sm">
                  No products found for this order.
                </div>
              ) : (
                <div className="space-y-3">
                  {orderItems.map(item => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center bg-[#F8F5FA] p-4 rounded-xl gap-3"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-[#211B2B]">
                          {item.product_name || 'Product'}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          Quantity: {item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>

                      <p className="font-bold text-purple-600 whitespace-nowrap">
                        {formatPrice(item.line_total)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Payment Information */}
            <div className="border-t border-gray-100 pt-5">
              <h3 className="font-bold text-[#211B2B] mb-4">
                Payment Information
              </h3>

              <div className="space-y-3 text-sm">

                <div className="flex justify-between gap-3">
                  <span className="text-gray-500">Payment Method</span>
                  <span className="font-semibold">
                    {selectedOrder.payment_method || 'N/A'}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-semibold">
                    {formatPrice(selectedOrder.subtotal)}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="text-gray-500">Delivery Charge</span>
                  <span className="font-semibold">
                    {formatPrice(selectedOrder.delivery_charge)}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                  <span className="font-bold text-[#211B2B]">
                    Total Amount
                  </span>

                  <span className="font-extrabold text-xl text-purple-600">
                    {formatPrice(selectedOrder.total_amount)}
                  </span>
                </div>

              </div>
            </div>

            {/* ORDER STATUS MANAGEMENT */}
            <div className="border-t border-gray-200 pt-6 mt-6">

              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-100 text-purple-600 p-3 rounded-xl">
                  <Truck size={22} />
                </div>

                <div>
                  <h3 className="font-bold text-[#211B2B]">
                    Order Status Management
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    Change and save the current order status.
                  </p>
                </div>
              </div>

              <label className="block text-sm font-semibold mb-2">
                Select New Status
              </label>

              <select
                value={statusDraft}
                onChange={(e) => {
                  setStatusDraft(e.target.value)
                  setStatusMessage('')
                  setStatusError('')
                }}
                disabled={updatingStatus}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-purple-500 bg-white"
              >
                {ADMIN_STATUSES.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>

              {statusMessage && (
                <div className="mt-4 flex items-start gap-2 bg-green-50 text-green-700 p-3 rounded-xl text-sm">
                  <CheckCircle size={18} className="shrink-0 mt-0.5" />
                  {statusMessage}
                </div>
              )}

              {statusError && (
                <div className="mt-4 flex items-start gap-2 bg-red-50 text-red-600 p-3 rounded-xl text-sm">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  {statusError}
                </div>
              )}

              <button
                onClick={handleStatusUpdate}
                disabled={
                  updatingStatus ||
                  statusDraft === (selectedOrder.status || 'pending').toLowerCase()
                }
                className="w-full mt-5 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition"
              >
                {updatingStatus ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    Updating Status...
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    Update Order Status
                  </>
                )}
              </button>

            </div>

            {/* Close */}
            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full mt-4 border border-gray-200 hover:bg-gray-50 text-gray-700 py-3 rounded-xl font-semibold transition"
            >
              Close Details
            </button>

          </div>
        </div>
      )}

    </div>
  )
}
