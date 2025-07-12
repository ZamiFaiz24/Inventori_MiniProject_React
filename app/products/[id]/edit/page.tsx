// app/products/[id]/edit/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { ProductForm } from "@/components/product-form"
import { api, type Product } from "@/lib/api"

export default function EditProductPage() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          setLoading(true)
          const data = await api.getProductById(id as string)
          if (data) {
            setProduct(data)
          } else {
            setError("Produk tidak ditemukan.")
          }
        } catch (err) {
          setError("Gagal memuat produk untuk diedit.")
          console.error(err)
        } finally {
          setLoading(false)
        }
      }
      fetchProduct()
    }
  }, [id])

  const handleUpdateProduct = async (updatedData: Omit<Product, "id">) => {
    if (id) {
      await api.updateProduct(id as string, updatedData)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-lg">Memuat data produk...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500 text-lg">{error}</div>
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen text-muted-foreground text-lg">
        Produk tidak ditemukan.
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center min-h-screen py-8">
      <ProductForm initialData={product} onSubmit={handleUpdateProduct} isEditing />
    </div>
  )
}
