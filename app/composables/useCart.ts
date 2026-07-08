export interface CartLine {
  listingId: number
  title: string
  price: number
  quantity: number
}

export function useCartLines() {
  return useCookie<CartLine[]>('cart', { default: () => [] })
}

export function useCart() {
  const lines = useCartLines()

  const totalItems = computed(() => lines.value.reduce((sum, line) => sum + line.quantity, 0))
  const totalPrice = computed(() => lines.value.reduce((sum, line) => sum + line.quantity * line.price, 0))

  function add(listing: { id: number, title: string, price: number }, quantity = 1) {
    const existing = lines.value.find(line => line.listingId === listing.id)
    if (existing) {
      lines.value = lines.value.map(line =>
        line.listingId === listing.id ? { ...line, quantity: line.quantity + quantity } : line,
      )
    } else {
      lines.value = [...lines.value, { listingId: listing.id, title: listing.title, price: listing.price, quantity }]
    }
  }

  function updateQuantity(listingId: number, quantity: number) {
    if (quantity <= 0) {
      remove(listingId)
      return
    }
    lines.value = lines.value.map(line => (line.listingId === listingId ? { ...line, quantity } : line))
  }

  function remove(listingId: number) {
    lines.value = lines.value.filter(line => line.listingId !== listingId)
  }

  function clear() {
    lines.value = []
  }

  return { lines, totalItems, totalPrice, add, updateQuantity, remove, clear }
}
