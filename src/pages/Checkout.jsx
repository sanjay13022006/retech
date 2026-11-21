
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  MapPin,
  CreditCard,
  Truck,
  ShieldCheck,
  ArrowLeft,
  CheckCircle,
  ShoppingBag
} from 'lucide-react'

import { useCart } from '../context/CartContext'
import { supabase } from '../lib/supabase'

const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Number(price) || 0)

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart()
  const navigate = useNavigate()

  const deliveryCharge =
    cartTotal >= 50000 || cartTotal === 0 ? 0 : 99

  const finalTotal = cartTotal + deliveryCharge

  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [emailStatus, setEmailStatus] = useState('')

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Place order and automatically deduct inventory
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (cartItems.length === 0 || loading) return

    setLoading(true)
    setErrorMessage('')
    setEmailStatus('')

    try {
      // Validate cart quantities and product IDs
      for (const item of cartItems) {
        if (
          !Number.isInteger(Number(item.id)) ||
          Number(item.id) <= 0 ||
          !Number.isInteger(Number(item.quantity)) ||
          Number(item.quantity) <= 0
        ) {
          throw new Error(
            `Invalid product or quantity in your cart: ${item.name}`
          )
        }
      }

      const newOrderId = crypto.randomUUID()

      const orderReference =
        'RT' + Date.now().toString().slice(-8)

      // Prepare order information
      const orderData = {
        id: newOrderId,
        order_reference: orderReference,
        customer_name: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
        payment_method:
          paymentMethod === 'cod'
            ? 'Cash on Delivery'
            : 'UPI (Demo)',
        subtotal: cartTotal,
        delivery_charge: deliveryCharge,
        total_amount: finalTotal,
        status: 'pending'
      }

      // Prepare purchased products
      const orderItems = cartItems.map((item) => ({
        product_id: Number(item.id),
        product_name: item.name,
        price: Number(item.price),
        quantity: Number(item.quantity)
      }))

      // Call the Supabase transaction function.
      // It checks stock, creates the order, saves items
      // and deducts inventory together.
      const { data: result, error: orderError } =
        await supabase.rpc(
          'place_order_with_inventory',
          {
            p_order: orderData,
            p_items: orderItems
          }
        )

      if (orderError) {
        throw orderError
      }

      if (!result?.success || !result?.order_reference) {
        throw new Error(
          'The order could not be completed. Please try again.'
        )
      }

      // Order and inventory update succeeded.
      // Send the customer confirmation email.
      try {
        const {
          data: emailData,
          error: emailError
        } = await supabase.functions.invoke(
          'send-order-confirmation',
          {
            body: {
              order_reference: result.order_reference,
              email: formData.email.trim()
            }
          }
        )

        if (
          emailError ||
          emailData?.error ||
          !emailData?.success
        ) {
          console.error(
            'Order email could not be sent:',
            emailError || emailData
          )

          setEmailStatus(
            'Your order is confirmed, but we could not send the confirmation email. Please contact support if needed.'
          )
        } else {
          setEmailStatus(
            'Your order confirmation email has been sent successfully.'
          )
        }
      } catch (emailError) {
        console.error(
          'Email function error:',
          emailError
        )

        setEmailStatus(
          'Your order is confirmed, but the confirmation email could not be sent.'
        )
      }

      // Show order confirmation
      setOrderId(result.order_reference)
      setOrderPlaced(true)

      // Clear cart only after successful order placement
      clearCart()

    } catch (error) {
      console.error('Order placement error:', error)

      setErrorMessage(
        error.message ||
        'Something went wrong. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  // Order confirmation
  if (orderPlaced) {
    return (
      <section className="min-h-screen bg-[#F8F5FA] flex items-center justify-center px-5 py-16">
        <div className="bg-white max-w-lg w-full rounded-3xl p-10 text-center shadow-lg">

          <div className="w-20 h-20 bg-green-100 flex items-center justify-center rounded-full mx-auto mb-6">
            <CheckCircle size={42} className="text-green-600" />
          </div>

          <h1 className="text-3xl font-extrabold text-[#211B2B]">
            Order Confirmed!
          </h1>

          <p className="text-gray-500 mt-4">
            Thank you for shopping with ReTech.
            Your order has been saved successfully.
          </p>

          <div className="bg-purple-50 rounded-xl p-5 mt-7">
            <p className="text-sm text-gray-500">
              Order Reference
            </p>

            <p className="text-xl font-extrabold text-purple-600 mt-2">
              {orderId}
            </p>
          </div>

          <div
            className={`mt-5 p-3 rounded-xl text-sm ${
              emailStatus.includes('successfully')
                ? 'bg-green-50 text-green-700'
                : 'bg-yellow-50 text-yellow-800'
            }`}
          >
            {emailStatus}
          </div>

          <p className="text-sm text-gray-500 mt-5">
            Payment method: {
              paymentMethod === 'cod'
                ? 'Cash on Delivery'
                : 'Demo UPI'
            }
          </p>

          <button
            onClick={() => navigate('/track-order')}
            className="w-full mt-5 border border-purple-600 text-purple-600 hover:bg-purple-50 py-4 rounded-xl font-bold transition"
          >
            Track Your Order
          </button>

          <button
            onClick={() => navigate('/shop')}
            className="w-full mt-3 bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-xl font-bold transition"
          >
            Continue Shopping
          </button>

          <p className="text-xs text-gray-400 mt-5">
            Your order information has been stored in Supabase.
            No real payment has been processed.
          </p>

        </div>
      </section>
    )
  }

  // Empty cart
  if (cartItems.length === 0) {
    return (
      <section className="min-h-screen bg-[#F8F5FA] flex items-center justify-center px-5">
        <div className="text-center bg-white rounded-3xl p-10 shadow-sm">

          <ShoppingBag
            size={48}
            className="mx-auto text-purple-500 mb-5"
          />

          <h2 className="text-2xl font-bold text-[#211B2B]">
            Your cart is empty
          </h2>

          <p className="text-gray-500 mt-3">
            Add some products before checking out.
          </p>

          <Link
            to="/shop"
            className="inline-block mt-6 bg-purple-600 text-white px-7 py-3 rounded-xl font-semibold"
          >
            Explore Products
          </Link>

        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen bg-[#F8F5FA] py-14 px-5 sm:px-8">

      <div className="max-w-7xl mx-auto">

        <div className="mb-10">
          <p className="text-purple-600 font-bold text-xs uppercase mb-2">
            ALMOST THERE
          </p>

          <h1 className="text-3xl md:text-4xl font-extrabold text-[#211B2B]">
            Secure Checkout
          </h1>

          <p className="text-gray-500 mt-2">
            Complete your details to place your ReTech order.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >

          {/* Customer details */}
          <div className="lg:col-span-2 space-y-7">

            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm">

              <div className="flex items-center gap-3 mb-7">
                <div className="w-11 h-11 bg-purple-100 rounded-xl flex items-center justify-center">
                  <MapPin className="text-purple-600" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-[#211B2B]">
                    Delivery Information
                  </h2>

                  <p className="text-sm text-gray-500">
                    Where should we deliver your order?
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold mb-2">
                    Full Name
                  </label>

                  <input
                    required
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Email Address
                  </label>

                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Phone Number
                  </label>

                  <input
                    required
                    type="tel"
                    name="phone"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-purple-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold mb-2">
                    Complete Address
                  </label>

                  <textarea
                    required
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    placeholder="House number, street and landmark"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-purple-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    City
                  </label>

                  <input
                    required
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Your city"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    State
                  </label>

                  <input
                    required
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Your state"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    PIN Code
                  </label>

                  <input
                    required
                    name="pincode"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="6-digit PIN code"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-purple-500"
                  />
                </div>

              </div>
            </div>

            {/* Payment method */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm">

              <div className="flex items-center gap-3 mb-7">
                <div className="w-11 h-11 bg-purple-100 rounded-xl flex items-center justify-center">
                  <CreditCard className="text-purple-600" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-[#211B2B]">
                    Payment Method
                  </h2>

                  <p className="text-sm text-gray-500">
                    Select how you want to pay.
                  </p>
                </div>
              </div>

              <label
                className={`flex items-center gap-4 border rounded-xl p-5 cursor-pointer transition ${
                  paymentMethod === 'cod'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200'
                }`}
              >

                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="accent-purple-600"
                />

                <Truck className="text-purple-600" size={25} />

                <div>
                  <p className="font-bold text-[#211B2B]">
                    Cash on Delivery
                  </p>

                  <p className="text-sm text-gray-500">
                    Pay when your product arrives.
                  </p>
                </div>

              </label>

              <label
                className={`flex items-center gap-4 border rounded-xl p-5 cursor-pointer mt-4 transition ${
                  paymentMethod === 'upi'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200'
                }`}
              >

                <input
                  type="radio"
                  name="payment"
                  value="upi"
                  checked={paymentMethod === 'upi'}
                  onChange={() => setPaymentMethod('upi')}
                  className="accent-purple-600"
                />

                <CreditCard className="text-purple-600" size={25} />

                <div>
                  <p className="font-bold text-[#211B2B]">
                    UPI Payment
                  </p>

                  <p className="text-sm text-gray-500">
                    Demo option – no real transaction.
                  </p>
                </div>

              </label>

            </div>

          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">

            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-28">

              <h2 className="text-xl font-bold text-[#211B2B] mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 max-h-64 overflow-y-auto mb-6">

                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3"
                  >

                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">
                        {item.name}
                      </p>

                      <p className="text-xs text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                    </div>

                    <p className="font-bold text-sm">
                      {formatPrice(item.price * item.quantity)}
                    </p>

                  </div>
                ))}

              </div>

              <div className="border-t border-gray-100 pt-5 space-y-4 text-sm">

                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className="text-green-600 font-semibold">
                    {deliveryCharge === 0
                      ? 'FREE'
                      : formatPrice(deliveryCharge)}
                  </span>
                </div>

                <div className="border-t border-gray-100 pt-4 flex justify-between text-lg font-extrabold">
                  <span>Total</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>

              </div>

              {errorMessage && (
                <div className="mt-5 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-7 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold transition"
              >
                {loading
                  ? 'Checking Stock & Placing Order...'
                  : `Place Order · ${formatPrice(finalTotal)}`}
              </button>

              <p className="text-xs text-center text-gray-400 mt-4">
                Demo checkout. No real payment is processed.
              </p>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-5">
                <ShieldCheck size={17} className="text-green-600" />
                Secure checkout experience
              </div>

              <Link
                to="/cart"
                className="flex items-center justify-center gap-2 text-purple-600 text-sm font-semibold mt-6"
              >
                <ArrowLeft size={16} />
                Back to Cart
              </Link>

            </div>

          </div>

        </form>

      </div>

    </section>
  )
}
