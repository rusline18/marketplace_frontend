export interface OrderItem {
  id: number
  listing_id: number
  quantity: number
  unit_price: number
}

export interface Order {
  id: number
  status: 'pending' | 'confirmed' | 'cancelled'
  total: number
  items: OrderItem[]
  created_at: string
}

interface PaginatedOrders {
  data: Order[]
  meta: { current_page: number, last_page: number, total: number, per_page: number }
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

  /** Paginated order history for the authenticated buyer. */
  function list(params: { page?: number } = {}) {
    return api<PaginatedOrders>('/orders', { params })
  }

  /** A single order owned by the authenticated buyer. */
  function show(id: number | string) {
    return api<{ data: Order }>(`/orders/${id}`).then(response => response.data)
  }

  /** Cancels a still-pending order owned by the authenticated buyer. */
  async function cancel(id: number | string) {
    const response = await api<{ data: Order }>(`/orders/${id}/cancel`, { method: 'POST' })
    return response.data
  }

  return { checkout, list, show, cancel }
}
