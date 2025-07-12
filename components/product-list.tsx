// components/product-list.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Product } from "@/lib/api"
import { Edit, Trash2, PlusCircle } from "lucide-react"

interface ProductListProps {
  products: Product[]
  onDelete: (id: string) => Promise<void>
}

export function ProductList({ products, onDelete }: ProductListProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)

  const handleDeleteClick = (id: string) => {
    setProductToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (productToDelete) {
      await onDelete(productToDelete)
      setProductToDelete(null)
      setIsDeleteDialogOpen(false)
    }
  }
  const formatRupiah = (number: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Daftar Inventaris Aki Mainan</h1>
        <Link href="/products/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Produk Baru
          </Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-center text-muted-foreground">
          Tidak ada produk dalam inventaris. Silakan tambahkan yang baru.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Gambar</TableHead>
                <TableHead>Nama Produk</TableHead>
                <TableHead>Kode Produk</TableHead>
                <TableHead>Jumlah Stok</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    {product.gambar ? (
                      <Image
                        src={product.gambar || "/placeholder.svg"}
                        alt={product.nama}
                        width={64}
                        height={64}
                        className="object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded-md text-sm text-gray-500">
                        No Image
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{product.nama}</TableCell>
                  <TableCell>{product.kode}</TableCell>
                  <TableCell>{product.stok}</TableCell>
                  <TableCell>{formatRupiah(product.harga)}</TableCell>
                  <TableCell>{product.kategori || "-"}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{product.deskripsi || "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/products/${product.id}/edit`}>
                        <Button variant="outline" size="icon" aria-label={`Edit ${product.nama}`}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteClick(product.id)}
                        aria-label={`Hapus ${product.nama}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus produk secara permanen dari inventaris Anda.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
