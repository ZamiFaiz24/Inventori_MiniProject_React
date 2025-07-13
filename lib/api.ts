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

export const api = {
  async getProducts(): Promise<Product[]> {
    console.log("API: Mengambil produk dari:", `${API_BASE_URL}/barang`)
    try {
      const response = await fetch(`${API_BASE_URL}/barang`)
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Kesalahan tidak diketahui" }))
        throw new Error(
          `Gagal memuat produk: ${response.status} ${response.statusText} - ${errorData.message || JSON.stringify(errorData)}`,
        )
      }
      const data = await response.json()
      console.log("API: Produk berhasil diambil:", data)
      return data
    } catch (error) {
      console.error("API: Error fetching products:", error)
      throw error
    }
  },

  async getProductById(id: string): Promise<Product | undefined> {
    console.log("API: Mengambil produk berdasarkan ID:", `${API_BASE_URL}/barang/${id}`)
    try {
      const response = await fetch(`${API_BASE_URL}/barang/${id}`)
      if (response.status === 404) {
        console.log("API: Produk tidak ditemukan (404) untuk ID:", id)
        return undefined
      }
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Kesalahan tidak diketahui" }))
        throw new Error(
          `Gagal memuat produk (ID: ${id}): ${response.status} ${response.statusText} - ${errorData.message || JSON.stringify(errorData)}`,
        )
      }
      const data = await response.json()
      console.log("API: Produk berhasil diambil berdasarkan ID:", data)
      return data
    } catch (error) {
      console.error(`API: Error fetching product with ID ${id}:`, error)
      throw error
    }
  },

  async createProduct(formData: FormData): Promise<Product> {
    console.log("API: Mengirim data produk baru ke:", `${API_BASE_URL}/barang`)
    try {
      // Mengubah FormData menjadi objek JSON jika tidak ada file yang diupload
      // Karena sekarang kita hanya mengirim URL, kita bisa menggunakan JSON
      const data = Object.fromEntries(formData.entries())
      // Hapus _method jika ada, karena ini hanya untuk FormData dengan POST untuk simulasi PUT/PATCH
      if (data._method) {
        delete data._method
      }

      const response = await fetch(`${API_BASE_URL}/barang`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Penting: Set header ini untuk JSON
          Accept: "application/json",
        },
        body: JSON.stringify(data), // Kirim sebagai JSON string
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Kesalahan tidak diketahui" }))
        console.error("API: Gagal membuat produk, respons error:", errorData)
        throw new Error(
          `Gagal membuat produk: ${response.status} ${response.statusText} - ${errorData.message || JSON.stringify(errorData)}`,
        )
      }
      const responseData = await response.json()
      console.log("API: Produk baru berhasil dibuat, respons:", responseData)
      return responseData
    } catch (error) {
      console.error("API: Error creating product:", error)
      throw error
    }
  },

  async updateProduct(id: string, formData: FormData): Promise<Product | undefined> {
    console.log("API: Mengirim data update produk ke:", `${API_BASE_URL}/barang/${id}`)
    try {
      // Mengubah FormData menjadi objek JSON
      const data = Object.fromEntries(formData.entries())
      // Ambil _method dari FormData
      const method = (data._method as string)?.toUpperCase() || "PUT"
      delete data._method // Hapus _method dari data yang akan dikirim

      const response = await fetch(`${API_BASE_URL}/barang/${id}`, {
        method: method, // Gunakan metode PUT/PATCH yang sebenarnya
        headers: {
          "Content-Type": "application/json", // Penting: Set header ini untuk JSON
          Accept: "application/json",
        },
        body: JSON.stringify(data), // Kirim sebagai JSON string
      })
      if (response.status === 404) {
        console.log("API: Produk tidak ditemukan (404) saat update untuk ID:", id)
        return undefined
      }
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Kesalahan tidak diketahui" }))
        console.error("API: Gagal memperbarui produk, respons error:", errorData)
        throw new Error(
          `Gagal memperbarui produk (ID: ${id}): ${response.status} ${response.statusText} - ${errorData.message || JSON.stringify(errorData)}`,
        )
      }
      const responseData = await response.json()
      console.log("API: Produk berhasil diperbarui, respons:", responseData)
      return responseData
    } catch (error) {
      console.error(`API: Error updating product with ID ${id}:`, error)
      throw error
    }
  },

  async deleteProduct(id: string): Promise<boolean> {
    console.log("API: Mengirim permintaan hapus produk untuk ID:", `${API_BASE_URL}/barang/${id}`)
    try {
      const response = await fetch(`${API_BASE_URL}/barang/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      })
      if (response.status === 404) {
        console.log("API: Produk tidak ditemukan (404) saat hapus untuk ID:", id)
        return false // Produk tidak ditemukan untuk dihapus
      }
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Kesalahan tidak diketahui" }))
        console.error("API: Gagal menghapus produk, respons error:", errorData)
        throw new Error(
          `Gagal menghapus produk (ID: ${id}): ${response.status} ${response.statusText} - ${errorData.message || JSON.stringify(errorData)}`,
        )
      }
      console.log("API: Produk berhasil dihapus untuk ID:", id)
      return true // Berhasil dihapus (Laravel biasanya mengembalikan 204 No Content)
    } catch (error) {
      console.error(`API: Error deleting product with ID ${id}:`, error)
      throw error
    }
  },
}
