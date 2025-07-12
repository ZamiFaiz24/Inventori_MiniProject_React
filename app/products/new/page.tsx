// app/products/new/page.tsx
"use client"

import { ProductForm } from "@/components/product-form"
import { api, type Product } from "@/lib/api"

export default function NewProductPage() {
  const handleCreateProduct = async (product: Omit<Product, "id">) => {
    await api.createProduct(product)
  }

  return (
    <div className="flex justify-center items-center min-h-screen py-8">
      <ProductForm onSubmit={handleCreateProduct} />
    </div>
  )
}
