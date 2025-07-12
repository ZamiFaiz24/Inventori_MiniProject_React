// components/product-form.tsx
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Product } from "@/lib/api"

interface ProductFormProps {
  initialData?: Product
  onSubmit: (product: Omit<Product, "id">) => Promise<void>
  isEditing?: boolean
}

export function ProductForm({ initialData, onSubmit, isEditing = false }: ProductFormProps) {
  const [nama, setNama] = useState(initialData?.nama || "")
  const [kode, setKode] = useState(initialData?.kode || "")
  const [stok, setStok] = useState(initialData?.stok.toString() || "")
  const [harga, setHarga] = useState(initialData?.harga.toString() || "") // Menggunakan 'harga'
  const [kategori, setKategori] = useState(initialData?.kategori || "") // State untuk kategori
  const [deskripsi, setDeskripsi] = useState(initialData?.deskripsi || "") // Menggunakan 'deskripsi'
  const [gambar, setGambar] = useState(initialData?.gambar || "")
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
      setGambar(initialData.gambar || "")
    }
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit({
        nama,
        kode,
        stok: Number.parseInt(stok),
        harga: Number.parseFloat(harga),
        kategori,
        deskripsi,
        gambar,
      })
      router.push("/")
    } catch (error) {
      console.error("Failed to save product:", error)
      alert("Gagal menyimpan produk. Silakan coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Produk" : "Tambah Produk Baru"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="nama">Nama Produk</Label>
            <Input
              id="nama"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Nama Aki Mainan"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="kode">Kode Produk</Label>
            <Input
              id="kode"
              value={kode}
              onChange={(e) => setKode(e.target.value)}
              placeholder="Contoh: AKI001"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="stok">Jumlah Stok</Label>
            <Input
              id="stok"
              type="number"
              value={stok}
              onChange={(e) => setStok(e.target.value)}
              placeholder="Jumlah stok"
              required
              min="0"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="harga">Harga</Label> {/* Menggunakan 'harga' */}
            <Input
              id="harga"
              type="number"
              value={harga}
              onChange={(e) => setHarga(e.target.value)}
              placeholder="Harga per unit"
              required
              step="0.01"
              min="0"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="kategori">Kategori (Opsional)</Label> {/* Input untuk kategori */}
            <Input
              id="kategori"
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              placeholder="Contoh: Aki Kering, Aki Basah"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="gambar">URL Gambar (Opsional)</Label>
            <Input
              id="gambar"
              type="url"
              value={gambar}
              onChange={(e) => setGambar(e.target.value)}
              placeholder="https://example.com/gambar-aki.jpg"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="deskripsi">Deskripsi (Opsional)</Label> {/* Menggunakan 'deskripsi' */}
            <Textarea
              id="deskripsi"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Deskripsi produk"
              rows={3}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Menyimpan..." : isEditing ? "Perbarui Produk" : "Tambah Produk"}
          </Button>
          <Button type="button" variant="outline" className="w-full bg-transparent" onClick={() => router.back()}>
            Batal
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
