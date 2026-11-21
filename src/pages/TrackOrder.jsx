
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import {
  Package,
  Search,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
} from 'lucide-react';

const statuses = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
];

const statusLabels = {
  pending: 'Order Placed',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

function formatPrice(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));
}

function TrackOrder() {
  const [orderReference, setOrderReference] = useState('');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrackOrder = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const { data, error } = await supabase.rpc('track_order', {
        p_order_reference: orderReference.trim(),
        p_phone: phone.trim(),
      });

      if (error) throw error;

      if (!data) {
        setError(
          'No matching order found. Check your order reference and phone number.'
        );
        return;
      }

      setOrder(data);
    } catch (err) {
      console.error('Order tracking error:', err);
      setError('Unable to track your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentStatus = order?.status?.toLowerCase();
  const isCancelled = currentStatus === 'cancelled';
  const currentIndex = statuses.indexOf(currentStatus);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-2xl">

        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
            <Package className="h-8 w-8 text-purple-700" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900">
            Track Your Order
          </h1>

          <p className="mt-2 text-gray-500">
            Enter your order details to check the latest status.
          </p>
        </div>

        <form
          onSubmit={handleTrackOrder}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Order Reference
            </label>

            <input
              type="text"
              value={orderReference}
              onChange={(e) => setOrderReference(e.target.value)}
              placeholder="Example: RT39786069"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
            />
          </div>

          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Checkout Phone Number
            </label>

            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your registered phone number"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
            />
          </div>

          {error && (
            <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-700 px-4 py-3 font-semibold text-white transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="h-5 w-5" />
                Track Order
              </>
            )}
          </button>
        </form>

        {order && (
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-5">
              <div>
                <p className="text-sm text-gray-500">Order Reference</p>
                <h2 className="text-xl font-bold text-gray-900">
                  {order.order_reference}
                </h2>
              </div>

              <span className={`rounded-full px-4 py-2 text-sm font-semibold ${
                isCancelled
                  ? 'bg-red-100 text-red-700'
                  : 'bg-purple-100 text-purple-700'
              }`}>
                {statusLabels[currentStatus] || currentStatus}
              </span>
            </div>

            <div className="py-5">
              <p className="mb-4 font-semibold text-gray-900">
                Order Progress
              </p>

              {isCancelled ? (
                <div className="flex items-center gap-3 rounded-lg bg-red-50 p-4 text-red-700">
                  <XCircle className="h-6 w-6" />
                  <span className="font-medium">This order has been cancelled.</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {statuses.map((status, index) => {
                    const completed = currentIndex >= index;
                    const active = currentIndex === index;

                    return (
                      <div key={status} className="flex items-center gap-3">
                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                          completed
                            ? 'bg-purple-700 text-white'
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          {completed ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <Clock className="h-5 w-5" />
                          )}
                        </div>

                        <div>
                          <p className={`font-medium ${
                            completed ? 'text-gray-900' : 'text-gray-400'
                          }`}>
                            {statusLabels[status]}
                          </p>
                          {active && (
                            <p className="text-xs text-purple-700">
                              Current status
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="border-t border-gray-100 pt-5">
              <p className="mb-3 font-semibold text-gray-900">
                Products
              </p>

              <div className="space-y-3">
                {order.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <span className="text-gray-700">
                      {item.product_name} × {item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-5">
              <span className="font-semibold text-gray-700">
                Total Amount
              </span>
              <span className="text-xl font-bold text-purple-700">
                {formatPrice(order.total_amount)}
              </span>
            </div>

            <p className="mt-4 text-xs text-gray-400">
              Order placed on{' '}
              {new Date(order.created_at).toLocaleDateString('en-IN')}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

export default TrackOrder;
