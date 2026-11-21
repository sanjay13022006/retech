
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowUp } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-white">
              ReTech
            </h2>

            <p className="text-sm text-gray-400 mt-3 leading-6">
              Giving technology a second life.
              Discover quality-tested refurbished
              electronics at affordable prices.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              Quick Links
            </h3>

            <div className="flex flex-col gap-3 text-sm">
              <Link to="/" className="hover:text-white">
                Home
              </Link>

              <Link to="/shop" className="hover:text-white">
                Shop
              </Link>

              <Link to="/track-order" className="hover:text-white">
                Track Order
              </Link>

              <Link to="/compare" className="hover:text-white">
                Compare Products
              </Link>
            </div>
          </div>

          {/* Admin Access */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              Admin Access
            </h3>

            <Link
              to="/admin/login"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
            >
              <ShieldCheck size={17} />
              Admin Login
            </Link>

            <p className="text-xs text-gray-500 mt-3">
              Authorized administrators only.
            </p>
          </div>

        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">

          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} ReTech. All rights reserved.
          </p>

          <button
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: 'smooth'
              })
            }
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-white"
          >
            Back to top
            <ArrowUp size={15} />
          </button>

        </div>

      </div>
    </footer>
  );
}
