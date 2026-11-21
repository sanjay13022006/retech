
import { useCart } from '../context/CartContext'
import { Link } from 'react-router-dom'
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  ShieldCheck,
  Truck
} from 'lucide-react'

const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price)

export default function Cart() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    cartTotal
  } = useCart()

  const deliveryCharge = cartTotal >= 50000 || cartTotal === 0
    ? 0
    : 99

  const finalTotal = cartTotal + deliveryCharge

  return (
    <section className="min-h-screen bg-[#F8F5FA] py-16 px-5 sm:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="mb-10">
          <p className="text-purple-600 font-bold text-xs uppercase mb-2">
            YOUR SHOPPING BAG
          </p>

          <h1 className="text-3xl md:text-4xl font-extrabold text-[#211B2B]">
            Shopping Cart
          </h1>

          <p className="text-gray-500 mt-2">
            Review your selected devices before checkout.
          </p>
        </div>

        {cartItems.length === 0 ? (

          /* Empty cart */
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm">
            <ShoppingBag
              size={55}
              className="mx-auto text-purple-500 mb-5"
            />

            <h2 className="text-2xl font-bold text-[#211B2B]">
              Your cart is empty
            </h2>

            <p className="text-gray-500 mt-3">
              Looks like you haven't added any devices yet.
            </p>

            <Link
              to="/shop"
              className="inline-flex items-center gap-2 mt-7 bg-purple-600 text-white px-7 py-3 rounded-xl font-semibold hover:bg-purple-700 transition"
            >
              <ArrowLeft size={18} />
              Explore Products
            </Link>
          </div>

        ) : (

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Cart items */}
            <div className="lg:col-span-2 space-y-5">

              {cartItems.map((item) => (

                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row gap-5"
                >

                  {/* Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full sm:w-36 h-36 object-cover rounded-xl bg-gray-100"
                  />

                  {/* Product details */}
                  <div className="flex-1">

                    <p className="text-purple-600 text-xs font-bold mb-2">
                      {item.category}
                    </p>

                    <h3 className="text-lg font-bold text-[#211B2B]">
                      {item.name}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Condition: {item.condition}
                    </p>

                    <p className="font-bold text-lg mt-3">
                      {formatPrice(item.price)}
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between mt-4 flex-wrap gap-3">

                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">

                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          className="p-2 hover:bg-gray-100 disabled:opacity-30"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={16} />
                        </button>

                        <span className="px-4 font-semibold">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="p-2 hover:bg-gray-100"
                          aria-label="Increase quantity"
                        >
                          <Plus size={16} />
                        </button>

                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm font-semibold"
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>

                    </div>
                  </div>

                  {/* Item total */}
                  <div className="sm:text-right">
                    <p className="text-xs text-gray-400">
                      Item total
                    </p>

                    <p className="text-lg font-bold text-[#211B2B] mt-1">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>

                </div>
              ))}

              {/* Continue shopping */}
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-purple-600 font-semibold hover:gap-3 transition-all"
              >
                <ArrowLeft size={18} />
                Continue Shopping
              </Link>

            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">

              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-28">

                <h2 className="text-xl font-bold text-[#211B2B] mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 text-sm">

                  <div className="flex justify-between text-gray-600">
                    <span>Items ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span>
                    <span className={deliveryCharge === 0 ? 'text-green-600 font-semibold' : ''}>
                      {deliveryCharge === 0
                        ? 'FREE'
                        : formatPrice(deliveryCharge)}
                    </span>
                  </div>

                  <div className="border-t border-gray-100 pt-4 flex justify-between text-lg font-extrabold text-[#211B2B]">
                    <span>Total</span>
                    <span>{formatPrice(finalTotal)}</span>
                  </div>

                </div>

                <Link
                  to="/checkout"
                  className="mt-7 w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition"
                >
                  Proceed to Checkout
                </Link>

                <div className="mt-6 space-y-4">

                  <div className="flex items-center gap-3 text-gray-500 text-xs">
                    <ShieldCheck size={20} className="text-green-600" />
                    Quality inspected devices
                  </div>

                  <div className="flex items-center gap-3 text-gray-500 text-xs">
                    <Truck size={20} className="text-purple-600" />
                    Secure delivery
                  </div>

                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  )
}
