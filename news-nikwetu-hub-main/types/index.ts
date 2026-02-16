export interface Category {
    id: string
    name: string
    created_at: string
  }
  
  export interface Post {
    id: string
    title: string
    slug: string
    content: string
    image: string
    category_id: string
    status: 'draft' | 'published'
    created_at: string
  }
  