// app/(admin)/inventory/add/page.tsx
"use client"

import { ProductForm } from "@/components/product-form"

export default function AddProductPage() {
  const handleSubmit = async (formData: FormData) => {
    try {
      const res = await fetch("http://localhost:8000/api/barang", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const error = await res.json()
        console.error("API error:", error)
        alert("Gagal menyimpan data: " + JSON.stringify(error.errors || error.message))
        return
      }

      const result = await res.json()
      console.log("Produk berhasil disimpan:", result)
    } catch (error) {
      console.error("Gagal mengirim data:", error)
      alert("Terjadi kesalahan saat menghubungi server.")
    }
  }

  return <ProductForm onSubmit={handleSubmit} />
}
