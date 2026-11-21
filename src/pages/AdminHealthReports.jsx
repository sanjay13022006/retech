
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { products } from '../components/Products'
import { Save, ClipboardCheck } from 'lucide-react'

const testOptions = {
  Smartphones: [
    'display',
    'touchscreen',
    'camera',
    'speaker',
    'microphone',
    'chargingPort',
    'buttons',
    'wifi',
    'bluetooth',
    'fingerprint'
  ],
  Laptops: [
    'display',
    'keyboard',
    'trackpad',
    'webcam',
    'speaker',
    'microphone',
    'battery',
    'chargingPort',
    'wifi',
    'bluetooth'
  ],
  Audio: [
    'soundQuality',
    'leftChannel',
    'rightChannel',
    'microphone',
    'bluetooth',
    'charging',
    'physicalButtons'
  ],
  Wearables: [
    'display',
    'touchscreen',
    'heartRateSensor',
    'bluetooth',
    'battery',
    'charging',
    'buttons',
    'strapCondition'
  ]
}

const formatLabel = (key) =>
  key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (letter) => letter.toUpperCase())

const emptyTests = (category) => {
  const tests = testOptions[category] || [
    'display',
    'battery',
    'buttons',
    'charging',
    'connectivity'
  ]

  return Object.fromEntries(
    tests.map((test) => [test, 'Not tested'])
  )
}

export default function AdminHealthReports() {
  const [productId, setProductId] = useState(
    products[0]?.id?.toString() || ''
  )

  const selectedProduct = products.find(
    (product) => product.id.toString() === productId
  )

  const [overallScore, setOverallScore] = useState('')
  const [conditionGrade, setConditionGrade] = useState('Good')
  const [batteryHealth, setBatteryHealth] = useState('')
  const [physicalCondition, setPhysicalCondition] = useState('')
  const [inspectorNotes, setInspectorNotes] = useState('')
  const [status, setStatus] = useState('draft')
  const [testResults, setTestResults] = useState(
    emptyTests(selectedProduct?.category)
  )

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('success')

  const availableTests = Object.keys(testResults)

  const handleProductChange = (value) => {
    setProductId(value)

    const product = products.find(
      (item) => item.id.toString() === value
    )

    setTestResults(emptyTests(product?.category))
    setOverallScore('')
    setConditionGrade('Good')
    setBatteryHealth('')
    setPhysicalCondition('')
    setInspectorNotes('')
    setStatus('draft')
    setMessage('')
  }

  const handleTestChange = (test, value) => {
    setTestResults((current) => ({
      ...current,
      [test]: value
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!selectedProduct) {
      setMessage('Please select a product.')
      setMessageType('error')
      return
    }

    if (
      overallScore === '' ||
      Number(overallScore) < 0 ||
      Number(overallScore) > 100
    ) {
      setMessage('Enter an overall score between 0 and 100.')
      setMessageType('error')
      return
    }

    if (
      batteryHealth !== '' &&
      (
        Number(batteryHealth) < 0 ||
        Number(batteryHealth) > 100
      )
    ) {
      setMessage('Battery health must be between 0 and 100.')
      setMessageType('error')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser()

      if (userError || !user) {
        throw new Error('Please log in as admin again.')
      }

      const report = {
        product_id: Number(productId),
        overall_score: Number(overallScore),
        condition_grade: conditionGrade,
        battery_health:
          batteryHealth === '' ? null : Number(batteryHealth),
        test_results: testResults,
        physical_condition: physicalCondition.trim(),
        inspector_notes: inspectorNotes.trim(),
        status,
        created_by: user.id,
        updated_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('device_health_reports')
        .upsert(report, {
          onConflict: 'product_id'
        })

      if (error) {
        throw error
      }

      setMessage(
        status === 'published'
          ? 'Device health report published successfully!'
          : 'Device health report saved as draft!'
      )

      setMessageType('success')

    } catch (error) {
      console.error('Health report error:', error)

      setMessage(
        error.message || 'Unable to save the report.'
      )

      setMessageType('error')

    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#F8F5FA] px-4 py-10 sm:px-8">

      <div className="max-w-4xl mx-auto">

        {/* Heading */}
        <div className="mb-8">

          <div className="flex items-center gap-3 mb-3">

            <div className="bg-purple-100 text-purple-700 p-3 rounded-xl">
              <ClipboardCheck size={25} />
            </div>

            <div>
              <p className="text-purple-600 text-xs font-bold tracking-wider">
                RETECH ADMIN
              </p>

              <h1 className="text-3xl font-extrabold text-[#211B2B]">
                Device Health Report
              </h1>
            </div>

          </div>

          <p className="text-gray-500">
            Inspect a device and create its health report.
          </p>

        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Product selection */}
          <section className="bg-white rounded-2xl p-6 shadow-sm">

            <h2 className="text-lg font-bold text-gray-800 mb-4">
              1. Select Product
            </h2>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product
            </label>

            <select
              value={productId}
              onChange={(e) => handleProductChange(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-purple-500"
              required
            >
              {products.map((product) => (
                <option
                  key={product.id}
                  value={product.id}
                >
                  {product.name} — {product.category}
                </option>
              ))}
            </select>

            {selectedProduct && (
              <div className="flex items-center gap-4 mt-5 p-4 bg-gray-50 rounded-xl">

                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />

                <div>
                  <p className="font-bold text-gray-800">
                    {selectedProduct.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    {selectedProduct.category}
                  </p>

                  <p className="text-sm text-purple-700 font-semibold">
                    Product ID: {selectedProduct.id}
                  </p>
                </div>

              </div>
            )}

          </section>

          {/* Overall condition */}
          <section className="bg-white rounded-2xl p-6 shadow-sm">

            <h2 className="text-lg font-bold text-gray-800 mb-4">
              2. Overall Device Condition
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Overall Score (0–100)
                </label>

                <input
                  type="number"
                  min="0"
                  max="100"
                  value={overallScore}
                  onChange={(e) => setOverallScore(e.target.value)}
                  placeholder="Example: 92"
                  className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Condition Grade
                </label>

                <select
                  value={conditionGrade}
                  onChange={(e) => setConditionGrade(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-purple-500"
                >
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Battery Health (%)
                </label>

                <input
                  type="number"
                  min="0"
                  max="100"
                  value={batteryHealth}
                  onChange={(e) => setBatteryHealth(e.target.value)}
                  placeholder="Example: 92"
                  className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-purple-500"
                />

                <p className="text-xs text-gray-400 mt-1">
                  Leave blank if not applicable or not measured.
                </p>
              </div>

            </div>

          </section>

          {/* Component tests */}
          <section className="bg-white rounded-2xl p-6 shadow-sm">

            <h2 className="text-lg font-bold text-gray-800 mb-2">
              3. Component Inspection
            </h2>

            <p className="text-sm text-gray-500 mb-5">
              Physically test each component and record the result.
            </p>

            <div className="space-y-4">

              {availableTests.map((test) => (

                <div
                  key={test}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4"
                >

                  <label className="font-medium text-gray-700">
                    {formatLabel(test)}
                  </label>

                  <select
                    value={testResults[test]}
                    onChange={(e) =>
                      handleTestChange(test, e.target.value)
                    }
                    className="border border-gray-200 rounded-lg p-2 sm:w-48 outline-none focus:border-purple-500"
                  >
                    <option value="Not tested">Not tested</option>
                    <option value="Passed">Passed</option>
                    <option value="Failed">Failed</option>
                    <option value="Needs attention">Needs attention</option>
                  </select>

                </div>

              ))}

            </div>

          </section>

          {/* Physical condition */}
          <section className="bg-white rounded-2xl p-6 shadow-sm">

            <h2 className="text-lg font-bold text-gray-800 mb-4">
              4. Physical Condition
            </h2>

            <textarea
              value={physicalCondition}
              onChange={(e) => setPhysicalCondition(e.target.value)}
              placeholder="Example: Minor scratches on the back panel. No visible cracks."
              rows={3}
              className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-purple-500"
            />

            <label className="block text-sm font-semibold text-gray-700 mt-5 mb-2">
              Inspector Notes
            </label>

            <textarea
              value={inspectorNotes}
              onChange={(e) => setInspectorNotes(e.target.value)}
              placeholder="Enter additional inspection observations..."
              rows={3}
              className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-purple-500"
            />

          </section>

          {/* Publish settings */}
          <section className="bg-white rounded-2xl p-6 shadow-sm">

            <h2 className="text-lg font-bold text-gray-800 mb-4">
              5. Report Visibility
            </h2>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-purple-500"
            >
              <option value="draft">
                Save as Draft — Only admin can view
              </option>

              <option value="published">
                Publish — Customers can view
              </option>
            </select>

          </section>

          {/* Message */}
          {message && (
            <div
              className={`p-4 rounded-xl text-sm font-medium ${
                messageType === 'success'
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              {message}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl py-4 font-bold flex items-center justify-center gap-2"
          >
            <Save size={19} />

            {loading
              ? 'Saving Report...'
              : status === 'published'
                ? 'Save & Publish Report'
                : 'Save Report as Draft'}
          </button>

        </form>

      </div>

    </main>
  )
}

