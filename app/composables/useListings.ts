export interface Listing {
  id: number
  category_id: number
  title: string
  slug: string
  description: string
  price: number
  status: string
  published_at: string | null
}

interface PaginatedListings {
  data: Listing[]
  meta: { current_page: number, last_page: number, total: number, per_page: number }
}

export function useListings() {
  const api = useApiClient()

  function search(params: { search?: string, category_id?: number, page?: number } = {}) {
    return api<PaginatedListings>('/listings', { params })
  }

  function find(id: number | string) {
    return api<{ data: Listing }>(`/listings/${id}`).then(response => response.data)
  }

  return { search, find }
}
