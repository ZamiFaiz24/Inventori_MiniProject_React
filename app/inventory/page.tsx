// app/inventory/page.tsx (Ini adalah halaman manajemen stok baru, tampilan tabel)
"use client"

import { useEffect, useState } from "react"
import { ProductList } from "@/components/product-list"
import { type Product, api } from "@/lib/api"

export default function InventoryPage() {
  // Nama komponen diubah menjadi InventoryPage
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = async () => {
    console.log("fetchProducts: Memulai pengambilan data...")
    try {
      setLoading(true)
      const data = await api.getProducts()
      console.log("fetchProducts: Data berhasil diambil:", data)
      setProducts(data)
    } catch (err) {
      console.error("fetchProducts: Gagal memuat produk:", err)
      setError("Gagal memuat produk.")
      console.error(err)
    } finally {
      setLoading(false)
      console.log("fetchProducts: Pengambilan data selesai, loading diatur ke false.")
    }
  }

  useEffect(() => {
    console.log("useEffect: Komponen dimuat, memanggil fetchProducts.")
    fetchProducts()
  }, [])

  const handleDeleteProduct = async (id: string) => {
    try {
      await api.deleteProduct(id)
      setProducts(products.filter((p) => p.id !== id))
    } catch (err) {
      alert("Gagal menghapus produk.")
      console.error(err)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-lg">Memuat inventaris...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500 text-lg">{error}</div>
  }

  return <ProductList products={products} onDelete={handleDeleteProduct} />
}
