interface Order {
  id: number
  status: string
  total: number
}

export function useOrders() {
  const api = useApiClient()
  const cart = useCart()

  /** Submits the whole cart as a single order. Clears the cart only on success. */
  async function checkout() {
    const response = await api<{ data: Order }>('/orders', {
      method: 'POST',
      body: {
        items: cart.lines.value.map(line => ({ listing_id: line.listingId, quantity: line.quantity })),
      },
    })
    cart.clear()
    return response.data
  }

  return { checkout }
}
