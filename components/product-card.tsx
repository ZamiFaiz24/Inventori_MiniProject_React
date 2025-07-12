// components/product-card.tsx
"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/api"

interface ProductCardProps {
  product: Product
}

  const formatRupiah = (number: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };


export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="w-full max-w-sm overflow-hidden rounded-lg shadow-lg transition-all hover:shadow-xl">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          {product.gambar ? (
            <Image
              src={product.gambar || "/placeholder.svg"}
              alt={product.nama}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500">No Image</div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="mb-2 text-xl font-bold">{product.nama}</CardTitle>
        <CardDescription className="text-muted-foreground">
          Kode: {product.kode} | Stok: {product.stok}
        </CardDescription>
        <p className="mt-2 text-2xl font-semibold text-primary">{formatRupiah(product.harga)}</p>
      </CardContent>
      <CardFooter className="flex justify-end p-4 pt-0">
        <Link href={`/products/${product.id}/edit`}>
          <Button variant="outline">Lihat Detail / Edit</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
