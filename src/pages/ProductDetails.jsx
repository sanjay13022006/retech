
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  ArrowLeft,
  ShoppingCart,
  Zap,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Minus,
  Plus,
  Package,
  Info,
  Battery,
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react'

import { supabase } from '../lib/supabase'
import { products } from '../components/Products'
import { useCart } from '../context/CartContext'

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const [quantity, setQuantity] = useState(1)

  // Device Health Report state
  const [healthReport, setHealthReport] = useState(null)
  const [healthLoading, setHealthLoading] = useState(true)
  const [healthError, setHealthError] = useState('')

  const product = products.find(
    (item) => String(item.id) === String(id)
  )

  // Fetch published health report for this product
  useEffect(() => {
    let active = true

    const fetchHealthReport = async () => {
      setHealthLoading(true)
      setHealthError('')
      setHealthReport(null)

      try {
        const { data, error } = await supabase
          .from('device_health_reports')
          .select('*')
          .eq('product_id', Number(id))
          .eq('status', 'published')
          .maybeSingle()

        if (error) {
          throw error
        }

        if (active) {
          setHealthReport(data)
        }

      } catch (error) {
        console.error('Health report fetch error:', error)

        if (active) {
          setHealthError(
            'Unable to load the device health report.'
          )
        }

      } finally {
        if (active) {
          setHealthLoading(false)
        }
      }
    }

    fetchHealthReport()

    return () => {
      active = false
    }
  }, [id])

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(Number(price) || 0)

  const formatDate = (date) => {
    if (!date) return 'N/A'

    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4">
        <Package size={60} className="text-purple-500 mb-5" />

        <h1 className="text-3xl font-bold mb-3">
          Product Not Found
        </h1>

        <p className="text-gray-400 mb-6">
          Sorry, this product is not available.
        </p>

        <button
          onClick={() => navigate('/shop')}
          className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl"
        >
          Back to Shop
        </button>
      </div>
    )
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
  }

  const handleBuyNow = () => {
    handleAddToCart()
    navigate('/cart')
  }

  const discount =
    product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) /
            product.originalPrice) * 100
        )
      : 0

  const generalInformation = [
    { label: 'Product Name', value: product.name },
    { label: 'Category', value: product.category },
    { label: 'Condition', value: product.condition },
    { label: 'Customer Rating', value: `${product.rating} / 5` },
    { label: 'Product ID', value: product.id }
  ]

  // Convert specification keys into readable labels.
  const formatLabel = (label) => {
    const specialLabels = {
      RAM: 'RAM',
      CPU: 'CPU',
      GPU: 'GPU',
      SSD: 'SSD',
      USB: 'USB',
      HDMI: 'HDMI',
      OLED: 'OLED',
      AMOLED: 'AMOLED',
      ECG: 'ECG',
      GPS: 'GPS',
      NFC: 'NFC',
      SpO2: 'SpO2',
      WiFi: 'Wi-Fi'
    }

    if (specialLabels[label]) return specialLabels[label]

    return label
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .trim()
  }

  const specifications = Object.entries(
    product.specifications || {}
  ).map(([label, value]) => ({
    label: formatLabel(label),
    value
  }))

  const relatedProducts = products
    .filter(
      (item) =>
        item.category === product.category &&
        item.id !== product.id
    )
    .slice(0, 4)

  // Health report styling
  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-400'
    if (score >= 75) return 'text-blue-400'
    if (score >= 50) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreBarColor = (score) => {
    if (score >= 90) return 'bg-green-500'
    if (score >= 75) return 'bg-blue-500'
    if (score >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getTestStyle = (status) => {
    switch (status) {
      case 'Passed':
        return 'bg-green-500/10 text-green-400 border-green-500/30'

      case 'Failed':
        return 'bg-red-500/10 text-red-400 border-red-500/30'

      case 'Needs attention':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'

      default:
        return 'bg-gray-800 text-gray-400 border-gray-700'
    }
  }

  const getTestIcon = (status) => {
    switch (status) {
      case 'Passed':
        return <CheckCircle2 size={16} />

      case 'Failed':
        return <XCircle size={16} />

      case 'Needs attention':
        return <AlertCircle size={16} />

      default:
        return <Info size={16} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">

        {/* Back Button */}
        <button
          onClick={() => navigate('/shop')}
          className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition mb-8"
        >
          <ArrowLeft size={20} />
          Back to Shop
        </button>

        {/* PRODUCT SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">

          {/* Product Image */}
          <div className="bg-gray-900 rounded-3xl p-6 sm:p-10 flex items-center justify-center min-h-[350px] lg:min-h-[500px]">
            <img
              src={product.image}
              alt={product.name}
              className="w-full max-h-[450px] object-contain rounded-xl"
            />
          </div>

          {/* Product Information */}
          <div className="flex flex-col justify-center">

            <span className="text-purple-400 uppercase tracking-widest text-sm font-semibold mb-3">
              {product.category}
            </span>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <Star
                size={19}
                fill="currentColor"
                className="text-yellow-400"
              />

              <span className="text-gray-300">
                {product.rating} / 5
              </span>

              <span className="text-gray-500 text-sm">
                Quality inspected
              </span>
            </div>

            {/* Condition */}
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 border border-green-500/30 px-4 py-2 rounded-full text-sm">
                <ShieldCheck size={16} />
                {product.condition} Condition
              </span>
            </div>

            {/* Price */}
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="text-3xl font-bold text-purple-400">
                {formatPrice(product.price)}
              </span>

              {product.originalPrice > product.price && (
                <span className="text-gray-500 line-through text-lg">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {discount > 0 && (
              <p className="text-green-400 text-sm font-semibold mb-6">
                Save {discount}% compared to the listed original price
              </p>
            )}

            {/* Description */}
            <p className="text-gray-400 leading-relaxed mb-8">
              Explore this pre-owned {product.name} at ReTech.
              Check the condition and technical specifications
              before making your purchase.
            </p>

            {/* Quantity */}
            <div className="mb-7">
              <p className="text-sm text-gray-400 mb-3">
                Select Quantity
              </p>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700"
                  aria-label="Decrease quantity"
                >
                  <Minus size={18} />
                </button>

                <span className="text-lg font-semibold min-w-6 text-center">
                  {quantity}
                </span>

                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700"
                  aria-label="Increase quantity"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* Total */}
            <div className="mb-6 text-gray-300">
              Total:
              <span className="text-white font-bold text-xl ml-2">
                {formatPrice(product.price * quantity)}
              </span>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 py-4 rounded-xl font-semibold transition"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 flex items-center justify-center gap-2 bg-white text-gray-950 hover:bg-gray-200 py-4 rounded-xl font-semibold transition"
              >
                <Zap size={20} />
                Buy Now
              </button>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-gray-800 pt-6">

              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <ShieldCheck className="text-purple-400" size={22} />
                Quality Checked
              </div>

              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Truck className="text-purple-400" size={22} />
                Delivery Available
              </div>

              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <RotateCcw className="text-purple-400" size={22} />
                Return Policy
              </div>

            </div>

          </div>
        </div>

        {/* GENERAL INFORMATION */}
        <div className="mt-20 mb-16">

          <p className="text-purple-400 uppercase text-xs font-bold tracking-widest mb-2">
            PRODUCT DETAILS
          </p>

          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            General Information
          </h2>

          <div className="bg-gray-900 rounded-2xl overflow-hidden">
            {generalInformation.map((spec, index) => (
              <div
                key={spec.label}
                className={`flex justify-between gap-4 px-6 py-5 ${
                  index !== generalInformation.length - 1
                    ? 'border-b border-gray-800'
                    : ''
                }`}
              >
                <span className="text-gray-400">
                  {spec.label}
                </span>

                <span className="text-white font-medium text-right">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* TECHNICAL SPECIFICATIONS */}
        <div className="mb-20">

          <p className="text-purple-400 uppercase text-xs font-bold tracking-widest mb-2">
            TECHNICAL DETAILS
          </p>

          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Technical Specifications
          </h2>

          <p className="text-gray-400 mb-8">
            Detailed technical information about {product.name}.
          </p>

          <div className="bg-gray-900 rounded-2xl overflow-hidden">

            <div className="px-6 py-5 bg-purple-600/10 border-b border-gray-800">
              <h3 className="text-purple-400 font-semibold">
                {product.category} Specifications
              </h3>
            </div>

            {specifications.length > 0 ? (
              specifications.map((spec, index) => (
                <div
                  key={spec.label}
                  className={`flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 px-6 py-5 ${
                    index !== specifications.length - 1
                      ? 'border-b border-gray-800'
                      : ''
                  }`}
                >
                  <span className="text-gray-400">
                    {spec.label}
                  </span>

                  <span className="text-white font-medium sm:text-right sm:max-w-[65%]">
                    {spec.value}
                  </span>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center">
                <Info size={32} className="mx-auto text-gray-500 mb-3" />

                <p className="text-gray-400">
                  Technical specifications are not available yet.
                </p>
              </div>
            )}

          </div>

          <p className="text-gray-500 text-xs mt-4">
            Confirm the exact product model and configuration before purchase.
          </p>
        </div>

        {/* DEVICE HEALTH REPORT */}
        <section className="mb-20">

          <div className="mb-8">
            <p className="text-purple-400 uppercase text-xs font-bold tracking-widest mb-2">
              RETECH QUALITY ASSURANCE
            </p>

            <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <ClipboardCheck className="text-purple-400" size={30} />
              Device Health Report
            </h2>

            <p className="text-gray-400 mt-3">
              Inspection results recorded by the ReTech team for this device.
            </p>
          </div>

          {/* Loading */}
          {healthLoading ? (
            <div className="bg-gray-900 rounded-2xl p-10 text-center">
              <RefreshCw
                size={30}
                className="animate-spin mx-auto text-purple-400 mb-4"
              />

              <p className="text-gray-400">
                Loading device health report...
              </p>
            </div>

          ) : healthError ? (

            /* Error */
            <div className="bg-gray-900 border border-red-500/20 rounded-2xl p-8 text-center">
              <AlertCircle
                size={35}
                className="mx-auto text-red-400 mb-3"
              />

              <p className="text-red-400 font-semibold">
                {healthError}
              </p>
            </div>

          ) : !healthReport ? (

            /* No published report */
            <div className="bg-gray-900 rounded-2xl p-10 text-center">
              <ShieldCheck
                size={45}
                className="mx-auto text-gray-500 mb-4"
              />

              <h3 className="text-xl font-bold mb-2">
                Health Report Coming Soon
              </h3>

              <p className="text-gray-400 text-sm max-w-lg mx-auto">
                Our team has not published an inspection report
                for this product yet. Please check back later.
              </p>
            </div>

          ) : (

            /* Published Health Report */
            <div className="space-y-6">

              {/* Overall Score */}
              <div className="bg-gray-900 rounded-2xl p-6 sm:p-8 border border-gray-800">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">

                  <div>
                    <p className="text-gray-400 text-sm mb-2">
                      Overall Device Score
                    </p>

                    <div className="flex items-baseline gap-2">
                      <span className={`text-5xl font-extrabold ${getScoreColor(healthReport.overall_score)}`}>
                        {healthReport.overall_score}
                      </span>

                      <span className="text-gray-500 text-xl">
                        / 100
                      </span>
                    </div>

                    <p className="text-gray-400 text-sm mt-3">
                      Overall condition based on device inspection.
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <span className="inline-flex items-center gap-2 bg-purple-500/10 text-purple-400 border border-purple-500/30 px-4 py-2 rounded-full font-semibold">
                      <ShieldCheck size={17} />
                      {healthReport.condition_grade}
                    </span>

                    <p className="text-gray-500 text-xs mt-3">
                      Inspected on {formatDate(healthReport.inspection_date)}
                    </p>
                  </div>

                </div>

                <div className="mt-7">
                  <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span>Device condition</span>
                    <span>{healthReport.overall_score}%</span>
                  </div>

                  <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${getScoreBarColor(healthReport.overall_score)}`}
                      style={{
                        width: `${healthReport.overall_score}%`
                      }}
                    />
                  </div>
                </div>

              </div>

              {/* Battery Health */}
              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">

                <div className="flex items-center gap-3 mb-5">
                  <div className="bg-green-500/10 text-green-400 p-3 rounded-xl">
                    <Battery size={25} />
                  </div>

                  <div>
                    <h3 className="font-bold text-lg">
                      Battery Health
                    </h3>

                    <p className="text-gray-500 text-sm">
                      Measured remaining battery capacity
                    </p>
                  </div>
                </div>

                {healthReport.battery_health !== null &&
                healthReport.battery_health !== undefined ? (

                  <>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl font-extrabold text-green-400">
                        {healthReport.battery_health}%
                      </span>

                      <span className="text-sm text-gray-400">
                        Battery capacity
                      </span>
                    </div>

                    <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{
                          width: `${healthReport.battery_health}%`
                        }}
                      />
                    </div>
                  </>

                ) : (

                  <p className="text-gray-400 text-sm">
                    Battery health was not measured or is not applicable to this device.
                  </p>

                )}

              </div>

              {/* Component Inspection */}
              <div className="bg-gray-900 rounded-2xl p-6 sm:p-8 border border-gray-800">

                <h3 className="text-xl font-bold mb-2">
                  Component Inspection
                </h3>

                <p className="text-gray-500 text-sm mb-6">
                  Individual component test results recorded during inspection.
                </p>

                {healthReport.test_results &&
                Object.keys(healthReport.test_results).length > 0 ? (

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    {Object.entries(healthReport.test_results).map(
                      ([test, status]) => (

                        <div
                          key={test}
                          className="flex items-center justify-between gap-3 bg-gray-800/70 rounded-xl p-4"
                        >

                          <span className="text-gray-300 font-medium capitalize">
                            {formatLabel(test)}
                          </span>

                          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold whitespace-nowrap ${getTestStyle(status)}`}>
                            {getTestIcon(status)}
                            {status}
                          </span>

                        </div>

                      )
                    )}

                  </div>

                ) : (

                  <p className="text-gray-400 text-sm">
                    No component inspection results available.
                  </p>

                )}

              </div>

              {/* Physical Condition */}
              {healthReport.physical_condition && (
                <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">

                  <h3 className="text-lg font-bold mb-3">
                    Physical Condition
                  </h3>

                  <p className="text-gray-400 leading-relaxed">
                    {healthReport.physical_condition}
                  </p>

                </div>
              )}

              {/* Inspector Notes */}
              {healthReport.inspector_notes && (
                <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">

                  <h3 className="text-lg font-bold mb-3">
                    Inspection Notes
                  </h3>

                  <p className="text-gray-400 leading-relaxed">
                    {healthReport.inspector_notes}
                  </p>

                </div>
              )}

              {/* Report Footer */}
              <div className="flex items-center gap-3 bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                <ShieldCheck
                  size={23}
                  className="text-purple-400 shrink-0"
                />

                <p className="text-sm text-gray-300">
                  This report contains inspection information recorded
                  by the ReTech team. Results reflect the device's
                  condition at the time of inspection.
                </p>
              </div>

            </div>
          )}

        </section>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="mb-16">

            <p className="text-purple-400 uppercase text-xs font-bold tracking-widest mb-2">
              EXPLORE MORE
            </p>

            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              You May Also Like
            </h2>

            <p className="text-gray-400 mb-8">
              More products from the {product.category} collection.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

              {relatedProducts.map(item => (
                <div
                  key={item.id}
                  className="bg-gray-900 rounded-2xl p-4 hover:bg-gray-800 transition"
                >

                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      navigate(`/product/${item.id}`)
                      window.scrollTo(0, 0)
                      setQuantity(1)
                    }}
                  >
                    <div className="bg-gray-800 rounded-xl p-3 mb-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-40 object-contain"
                      />
                    </div>

                    <p className="text-purple-400 text-xs font-semibold mb-2">
                      {item.category}
                    </p>

                    <h3 className="font-semibold mb-3">
                      {item.name}
                    </h3>

                    <div className="flex items-center justify-between gap-2">
                      <p className="text-purple-400 font-bold">
                        {formatPrice(item.price)}
                      </p>

                      <span className="text-yellow-400 text-sm flex items-center gap-1">
                        <Star size={14} fill="currentColor" />
                        {item.rating}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      navigate(`/product/${item.id}`)
                      window.scrollTo(0, 0)
                      setQuantity(1)
                    }}
                    className="w-full mt-4 border border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white py-2 rounded-lg text-sm font-semibold transition"
                  >
                    View Product
                  </button>

                </div>
              ))}

            </div>
          </div>
        )}

      </div>
    </div>
  )
}
