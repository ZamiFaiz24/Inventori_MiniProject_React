// components/product-form.tsx
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Product } from "@/lib/api"
import { Trash2 } from "lucide-react"

interface ProductFormProps {
  initialData?: Product
  onSubmit: (productData: FormData) => Promise<void>
  isEditing?: boolean
}

export function ProductForm({ initialData, onSubmit, isEditing = false }: ProductFormProps) {
  const [nama, setNama] = useState(initialData?.nama || "")
  const [kode, setKode] = useState(initialData?.kode || "")
  const [stok, setStok] = useState(initialData?.stok.toString() || "")
  const [harga, setHarga] = useState(initialData?.harga.toString() || "")
  const [kategori, setKategori] = useState(initialData?.kategori || "")
  const [deskripsi, setDeskripsi] = useState(initialData?.deskripsi || "")
  const [gambarUrl, setGambarUrl] = useState(initialData?.gambar || "") // Mengubah dari gambarFile ke gambarUrl
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (initialData) {
      setNama(initialData.nama)
      setKode(initialData.kode)
      setStok(initialData.stok.toString())
      setHarga(initialData.harga.toString())
      setKategori(initialData.kategori || "")
      setDeskripsi(initialData.deskripsi || "")
      setGambarUrl(initialData.gambar || "") // Set URL gambar saat ini
    }
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData()
    formData.append("nama", nama)
    formData.append("kode", kode)
    formData.append("stok", stok)
    formData.append("harga", harga)
    formData.append("kategori", kategori)
    formData.append("deskripsi", deskripsi)
    formData.append("gambar", gambarUrl) // Mengirim URL gambar sebagai string

    if (isEditing) {
      formData.append("_method", "PUT")
    }

    try {
      await onSubmit(formData)
      router.push("/inventory")
    } catch (error) {
      console.error("Failed to save product:", error)
      alert("Gagal menyimpan produk. Silakan coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg rounded-xl">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-2xl font-bold text-gray-800">
          {isEditing ? "Edit Produk" : "Tambah Produk Baru"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="nama" className="text-sm font-medium text-gray-700">
              Nama Produk
            </Label>
            <Input
              id="nama"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Nama Aki Mainan"
              required
              className="border-gray-300 focus:border-primary focus:ring-primary"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="kode" className="text-sm font-medium text-gray-700">
              Kode Produk
            </Label>
            <Input
              id="kode"
              value={kode}
              onChange={(e) => setKode(e.target.value)}
              placeholder="Contoh: AKI001"
              required
              className="border-gray-300 focus:border-primary focus:ring-primary"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="stok" className="text-sm font-medium text-gray-700">
              Jumlah Stok
            </Label>
            <Input
              id="stok"
              type="number"
              value={stok}
              onChange={(e) => setStok(e.target.value)}
              placeholder="Jumlah stok"
              required
              min="0"
              className="border-gray-300 focus:border-primary focus:ring-primary"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="harga" className="text-sm font-medium text-gray-700">
              Harga
            </Label>
            <Input
              id="harga"
              type="number"
              value={harga}
              onChange={(e) => setHarga(e.target.value)}
              placeholder="Harga per unit"
              required
              step="0.01"
              min="0"
              className="border-gray-300 focus:border-primary focus:ring-primary"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="kategori" className="text-sm font-medium text-gray-700">
              Kategori (Opsional)
            </Label>
            <Input
              id="kategori"
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              placeholder="Contoh: Aki Kering, Aki Basah"
              className="border-gray-300 focus:border-primary focus:ring-primary"
            />
          </div>

          {/* Bagian Input URL Gambar */}
          <div className="grid gap-2">
            <Label htmlFor="gambar">URL Gambar (Opsional)</Label>
            <Input
              id="gambar"
              type="text" // Mengubah tipe input menjadi 'text'
              value={gambarUrl}
              onChange={(e) => setGambarUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="border-gray-300 focus:border-primary focus:ring-primary"
            />
            {gambarUrl && (
              <div className="flex items-center gap-3 mt-2 p-2 border rounded-md bg-gray-50">
                <Image
                  src={gambarUrl || "/placeholder.svg"}
                  alt="Preview Gambar"
                  width={80}
                  height={80}
                  className="object-cover rounded-md aspect-square"
                />
                <span className="text-sm text-gray-600 flex-grow">Preview Gambar</span>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => setGambarUrl("")} // Hapus URL gambar
                  aria-label="Hapus URL gambar"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="deskripsi" className="text-sm font-medium text-gray-700">
              Deskripsi (Opsional)
            </Label>
            <Textarea
              id="deskripsi"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Deskripsi produk"
              rows={4}
              className="border-gray-300 focus:border-primary focus:ring-primary"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Menyimpan..." : isEditing ? "Perbarui Produk" : "Tambah Produk"}
            </Button>
            <Button type="button" variant="outline" className="w-full bg-transparent" onClick={() => router.back()}>
              Batal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
