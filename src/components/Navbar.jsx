
import { useState } from 'react'

import {
  Search,
  ShoppingBag,
  Heart,
  Menu,
  UserRound,
  X,
  Package
} from 'lucide-react'

import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Navbar() {

  const { cartCount } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">

      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-extrabold tracking-tight text-[#211B2B]"
        >
          retech<span className="text-purple-600">.</span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-9 text-sm font-semibold text-gray-600">

          <Link
            to="/"
            className="hover:text-purple-600 transition"
          >
            Home
          </Link>

          <Link
            to="/shop"
            className="hover:text-purple-600 transition"
          >
            Shop
          </Link>

          <Link
            to="/#categories"
            className="hover:text-purple-600 transition"
          >
            Categories
          </Link>

          <Link
            to="/#why-retech"
            className="hover:text-purple-600 transition"
          >
            Why ReTech
          </Link>

          {/* Track Order */}
          <Link
            to="/track-order"
            className="hover:text-purple-600 transition flex items-center gap-1.5"
          >
            <Package size={17} />
            Track Order
          </Link>

        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-5">

          {/* Search */}
          <Link
            to="/shop"
            aria-label="Search products"
            className="text-gray-700 hover:text-purple-600 transition"
          >
            <Search size={21} />
          </Link>

          {/* Wishlist */}
          <button
            aria-label="Wishlist"
            className="hidden sm:block text-gray-700 hover:text-purple-600 transition"
          >
            <Heart size={21} />
          </button>

          {/* Account */}
          <button
            aria-label="Account"
            className="hidden sm:block text-gray-700 hover:text-purple-600 transition"
          >
            <UserRound size={21} />
          </button>

          {/* Shopping Cart */}
          <Link
            to="/cart"
            aria-label={`Shopping cart, ${cartCount} items`}
            className="relative text-gray-700 hover:text-purple-600 transition"
          >
            <ShoppingBag size={21} />

            {cartCount > 0 && (
              <span className="absolute -top-2.5 -right-3 bg-purple-600 text-white text-[10px] font-bold min-w-5 h-5 px-1 rounded-full flex items-center justify-center">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="md:hidden text-gray-700 hover:text-purple-600"
          >
            {menuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>

        </div>
      </div>

      {/* Mobile navigation */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-5 space-y-5 shadow-lg">

          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="block text-gray-700 font-semibold hover:text-purple-600"
          >
            Home
          </Link>

          <Link
            to="/shop"
            onClick={() => setMenuOpen(false)}
            className="block text-gray-700 font-semibold hover:text-purple-600"
          >
            Shop
          </Link>

          <Link
            to="/#categories"
            onClick={() => setMenuOpen(false)}
            className="block text-gray-700 font-semibold hover:text-purple-600"
          >
            Categories
          </Link>

          <Link
            to="/#why-retech"
            onClick={() => setMenuOpen(false)}
            className="block text-gray-700 font-semibold hover:text-purple-600"
          >
            Why ReTech
          </Link>

          {/* Track Order */}
          <Link
            to="/track-order"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 text-gray-700 font-semibold hover:text-purple-600"
          >
            <Package size={19} />
            Track Order
          </Link>

          <Link
            to="/cart"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 text-purple-600 font-semibold"
          >
            <ShoppingBag size={19} />
            Shopping Cart ({cartCount})
          </Link>

        </div>
      )}

    </nav>
  )
}
