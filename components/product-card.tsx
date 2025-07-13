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

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="w-full overflow-hidden rounded-xl shadow-md transition-all hover:shadow-lg flex flex-col">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full bg-gray-100 flex items-center justify-center overflow-hidden">
          {product.gambar ? (
            <Image
              src={product.gambar || "/placeholder.svg"}
              alt={product.nama}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-500 text-sm">No Image</div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="mb-1 text-xl font-semibold text-gray-800 truncate">{product.nama}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground mb-2">
          Kode: {product.kode} | Stok: {product.stok}
        </CardDescription>
        <p className="mt-3 text-2xl font-bold text-primary">Rp{product.harga.toLocaleString("id-ID")}</p>
        {product.kategori && (
          <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full mt-2">
            {product.kategori}
          </span>
        )}
      </CardContent>
      <CardFooter className="flex justify-end p-4 pt-0">
        <Link href={`/products/${product.id}/edit`}>
          <Button variant="outline" className="w-full bg-transparent">
            Lihat Detail / Edit
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
