// lib/api.ts
// Ini adalah API klien yang terhubung ke backend Laravel Anda.

// Sesuaikan URL ini dengan URL backend Laravel Anda
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api"

export interface Product {
  id: string // ID akan dihasilkan oleh backend Laravel
  nama: string // Sesuai dengan 'nama' di Laravel
  kode: string // Sesuai dengan 'kode' di Laravel
  stok: number // Sesuai dengan 'stok' di Laravel
  harga: number // Sesuai dengan 'harga' di Laravel
  kategori?: string // Sesuai dengan 'kategori' di Laravel
  deskripsi?: string // Sesuai dengan 'deskripsi' di Laravel
  gambar?: string // Sesuai dengan 'gambar' di Laravel (akan menjadi path/URL)
}

// Deklarasi fungsi getProductsFromStorage dan saveProductsToStorage
function getProductsFromStorage(): Product[] {
  const storedProducts = localStorage.getItem("products")
  return storedProducts ? JSON.parse(storedProducts) : []
}

function saveProductsToStorage(products: Product[]): void {
  localStorage.setItem("products", JSON.stringify(products))
}

export const api = {
  async getProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/barang`)
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Kesalahan tidak diketahui" }))
        throw new Error(
          `Gagal memuat produk: ${response.status} ${response.statusText} - ${errorData.message || JSON.stringify(errorData)}`,
        )
      }
      return response.json()
    } catch (error) {
      console.error("Error fetching products:", error)
      throw error // Re-throw untuk ditangani di komponen
    }
  },

  async getProductById(id: string): Promise<Product | undefined> {
    try {
      const response = await fetch(`${API_BASE_URL}/barang/${id}`)
      if (response.status === 404) {
        return undefined // Produk tidak ditemukan
      }
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Kesalahan tidak diketahui" }))
        throw new Error(
          `Gagal memuat produk (ID: ${id}): ${response.status} ${response.statusText} - ${errorData.message || JSON.stringify(errorData)}`,
        )
      }
      return response.json()
    } catch (error) {
      console.error(`Error fetching product with ID ${id}:`, error)
      throw error
    }
  },

  // Mengubah parameter menjadi FormData untuk mendukung upload file
  async createProduct(formData: FormData): Promise<Product> {
    try {
      // Simulasikan penundaan jaringan untuk mock API
      await new Promise((resolve) => setTimeout(resolve, 700))

      const newProduct: Product = {
        id: Math.random().toString(36).substring(2, 15), // ID acak untuk mock
        nama: formData.get("nama") as string,
        kode: formData.get("kode") as string,
        stok: Number.parseInt(formData.get("stok") as string),
        harga: Number.parseFloat(formData.get("harga") as string),
        kategori: (formData.get("kategori") as string) || undefined,
        deskripsi: (formData.get("deskripsi") as string) || undefined,
        gambar: undefined, // Default undefined
      }

      const imageFile = formData.get("gambar") as File | null
      if (imageFile && imageFile.size > 0) {
        // Simulasikan upload file dengan membuat path dummy
        const fileName = `${Date.now()}-${imageFile.name}`
        newProduct.gambar = `/uploads/${fileName}` // Simpan path dummy
      }

      const products = getProductsFromStorage()
      products.push(newProduct)
      saveProductsToStorage(products)
      return newProduct

      /*
      // Untuk integrasi Laravel nyata, gunakan kode ini:
      const response = await fetch(`${API_BASE_URL}/barang`, {
        method: "POST",
        // Penting: Jangan set 'Content-Type' header secara manual saat mengirim FormData,
        // browser akan mengaturnya secara otomatis dengan boundary yang benar.
        // headers: {
        //   "Accept": "application/json",
        // },
        body: formData, // Kirim FormData langsung
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Kesalahan tidak diketahui" }))
        throw new Error(
          `Gagal membuat produk: ${response.status} ${response.statusText} - ${errorData.message || JSON.stringify(errorData)}`,
        )
      }
      return response.json()
      */
    } catch (error) {
      console.error("Error creating product:", error)
      throw error
    }
  },

  // Mengubah parameter menjadi FormData untuk mendukung upload file
  async updateProduct(id: string, formData: FormData): Promise<Product | undefined> {
    try {
      // Simulasikan penundaan jaringan untuk mock API
      await new Promise((resolve) => setTimeout(resolve, 700))

      const products = getProductsFromStorage()
      const index = products.findIndex((p) => p.id === id)

      if (index > -1) {
        const existingProduct = products[index]
        const updatedFields: Partial<Product> = {
          nama: formData.get("nama") as string,
          kode: formData.get("kode") as string,
          stok: Number.parseInt(formData.get("stok") as string),
          harga: Number.parseFloat(formData.get("harga") as string),
          kategori: (formData.get("kategori") as string) || undefined,
          deskripsi: (formData.get("deskripsi") as string) || undefined,
        }

        const imageFile = formData.get("gambar") as File | null
        if (imageFile && imageFile.size > 0) {
          // Simulasikan upload file
          const fileName = `${Date.now()}-${imageFile.name}`
          updatedFields.gambar = `/uploads/${fileName}`
        } else if (formData.has("gambar_removed") && formData.get("gambar_removed") === "true") {
          // Tangani penghapusan gambar eksplisit
          updatedFields.gambar = undefined
        } else {
          // Jika tidak ada file baru dan tidak dihapus, pertahankan gambar yang sudah ada
          updatedFields.gambar = existingProduct.gambar
        }

        products[index] = { ...existingProduct, ...updatedFields }
        saveProductsToStorage(products)
        return products[index]
      }
      return undefined

      /*
      // Untuk integrasi Laravel nyata, gunakan kode ini:
      const response = await fetch(`${API_BASE_URL}/barang/${id}`, {
        method: "POST", // Laravel biasanya menggunakan POST untuk PUT/PATCH dengan FormData dan _method
        // headers: {
        //   "Accept": "application/json",
        // },
        body: formData, // Kirim FormData langsung
      })
      if (response.status === 404) {
        return undefined
      }
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Kesalahan tidak diketahui" }))
        throw new Error(
          `Gagal memperbarui produk (ID: ${id}): ${response.status} ${response.statusText} - ${errorData.message || JSON.stringify(errorData)}`,
        )
      }
      return response.json()
      */
    } catch (error) {
      console.error(`Error updating product with ID ${id}:`, error)
      throw error
    }
  },

  async deleteProduct(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/barang/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      })
      if (response.status === 404) {
        return false // Produk tidak ditemukan untuk dihapus
      }
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Kesalahan tidak diketahui" }))
        throw new Error(
          `Gagal menghapus produk (ID: ${id}): ${response.status} ${response.statusText} - ${errorData.message || JSON.stringify(errorData)}`,
        )
      }
      return true // Berhasil dihapus (Laravel biasanya mengembalikan 204 No Content)
    } catch (error) {
      console.error(`Error deleting product with ID ${id}:`, error)
      throw error
    }
  },
}
