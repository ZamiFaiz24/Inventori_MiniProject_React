// app/inventory/page.tsx (Ini adalah halaman manajemen stok baru, tampilan tabel)
"use client"

import { useEffect, useState } from "react"
import { ProductList } from "@/components/product-list"
import { type Product, api } from "@/lib/api"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle, Store } from "lucide-react" // Import icon Store

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const data = await api.getProducts()
      setProducts(data)
    } catch (err) {
      console.error("fetchProducts: Gagal memuat produk:", err)
      setError("Gagal memuat produk.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
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
    return (
      <div className="flex justify-center items-center h-screen text-lg text-muted-foreground">
        Memuat inventaris...
      </div>
    )
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500 text-lg">{error}</div>
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-gray-900">Manajemen Inventaris</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/products/new">
            <Button className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" /> Tambah Produk Baru
            </Button>
          </Link>
          <Link href="/">
            {" "}
            {/* Tombol untuk kembali ke halaman katalog */}
            <Button variant="outline" className="w-full sm:w-auto bg-transparent">
              <Store className="mr-2 h-4 w-4" /> Kembali ke Katalog
            </Button>
          </Link>
        </div>
      </div>
      <ProductList products={products} onDelete={handleDeleteProduct} />
    </div>
  )
}
