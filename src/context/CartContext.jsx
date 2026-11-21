
import {
  createContext,
  useContext,
  useState,
  useEffect
} from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {

  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('retech-cart')
      return savedCart ? JSON.parse(savedCart) : []
    } catch {
      return []
    }
  })

  // Save cart whenever it changes
  useEffect(() => {
    localStorage.setItem(
      'retech-cart',
      JSON.stringify(cartItems)
    )
  }, [cartItems])

  // Add product to cart
  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(
        item => item.id === product.id
      )

      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [
        ...prev,
        { ...product, quantity: 1 }
      ]
    })
  }

  // Remove product
  const removeFromCart = (id) => {
    setCartItems(prev =>
      prev.filter(item => item.id !== id)
    )
  }

  // Update quantity
  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return

    setCartItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity }
          : item
      )
    )
  }

  // Clear entire cart
  const clearCart = () => {
    setCartItems([])
  }

  // Calculate total quantity
  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  )

  // Calculate subtotal
  const cartTotal = cartItems.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  )

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// Custom hook
export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error(
      'useCart must be used inside CartProvider'
    )
  }

  return context
}
