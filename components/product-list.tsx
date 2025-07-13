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
import { Edit, Trash2 } from "lucide-react"
import { Package } from "lucide-react" // Declaring the Package variable

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

  return (
    <>
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center text-muted-foreground">
          <Package className="h-16 w-16 mb-4 text-gray-400" />
          <p className="text-xl font-medium">Inventaris kosong.</p>
          <p className="text-md">Belum ada produk yang ditambahkan.</p>
          <Link href="/products/new" className="mt-6">
            <Button>Tambah Produk Pertama</Button>
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border shadow-sm">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-[80px]">Gambar</TableHead>
                <TableHead>Nama Produk</TableHead>
                <TableHead>Kode Produk</TableHead>
                <TableHead>Stok</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} className="hover:bg-gray-50">
                  <TableCell>
                    {product.gambar ? (
                      <Image
                        src={product.gambar || "/placeholder.svg"}
                        alt={product.nama}
                        width={64}
                        height={64}
                        className="object-cover rounded-md aspect-square"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded-md text-xs text-gray-500">
                        No Image
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium text-gray-800">{product.nama}</TableCell>
                  <TableCell className="text-gray-600">{product.kode}</TableCell>
                  <TableCell className="text-gray-600">{product.stok}</TableCell>
                  <TableCell className="text-gray-600">Rp{product.harga.toLocaleString("id-ID")}</TableCell>
                  <TableCell className="text-gray-600">{product.kategori || "-"}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-gray-600">{product.deskripsi || "-"}</TableCell>
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
    </>
  )
}
