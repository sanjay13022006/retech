
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'

const CompareContext = createContext(null)

const STORAGE_KEY = 'retech-compare'

export function CompareProvider({ children }) {

  // Load previously selected products
  const [compareProducts, setCompareProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Save selected products in localStorage
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(compareProducts)
    )
  }, [compareProducts])

  // Get selected product IDs
  const compareIds = compareProducts.map(
    (product) => product.id
  )

  // Add product to comparison
  const addToCompare = (product) => {

    if (compareIds.includes(product.id)) {
      return
    }

    if (compareProducts.length >= 4) {
      window.alert('You can compare a maximum of 4 products.')
      return
    }

    // Only allow products from the same category
    if (
      compareProducts.length > 0 &&
      compareProducts[0].category !== product.category
    ) {
      window.alert(
        `Choose products from the same category (${compareProducts[0].category}).`
      )
      return
    }

    setCompareProducts((current) => [
      ...current,
      product
    ])
  }

  // Remove product from comparison
  const removeFromCompare = (productId) => {
    setCompareProducts((current) =>
      current.filter(
        (product) => product.id !== productId
      )
    )
  }

  // Clear all selected products
  const clearCompare = () => {
    setCompareProducts([])
  }

  // Check whether product is selected
  const isCompared = (productId) => {
    return compareIds.includes(productId)
  }

  const value = useMemo(() => ({
    compareProducts,
    compareIds,
    addToCompare,
    removeFromCompare,
    clearCompare,
    isCompared
  }), [compareProducts])

  return (
    <CompareContext.Provider value={value}>
      {children}
    </CompareContext.Provider>
  )
}

// Custom hook
export function useCompare() {

  const context = useContext(CompareContext)

  if (!context) {
    throw new Error(
      'useCompare must be used inside CompareProvider'
    )
  }

  return context
}
