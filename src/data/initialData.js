/**
 * Data awal (seed). Dipuat sekali ke localStorage saat pertama kali aplikasi dibuka.
 * Semua data bisa dikelola penuh dari dashboard admin.
 */

/** URL gambar langsung dari Unsplash CDN. */
const IMG = (id, w = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

const product = (data) => ({
  images: [],
  discount: 0,
  status: true,
  featured: false,
  specifications: [],
  createdAt: Date.now(),
  ...data,
})

export const initialProducts = [
  product({
    id: 'p-1',
    name: 'Smartphone Nova X5 5G 256GB',
    slug: 'smartphone-nova-x5-5g-256gb',
    mainImage: IMG('photo-1511707171634-5f897ff02aa9'),
    images: [
      IMG('photo-1511707171634-5f897ff02aa9'),
      IMG('photo-1598327105666-5b89351aff97'),
    ],
    normalPrice: 4999000,
    salePrice: 4399000,
    discount: 12,
    description:
      'Smartphone flagship terjangkau dengan layar AMOLED 6,7 inci 120Hz, chipset octa-core 5G, kamera utama 108MP dengan OIS, dan baterai 5000mAh dengan fast charging 67W. Cocok untuk harian, gaming, dan konten kreator.',
    specifications: [
      { name: 'Layar', value: 'AMOLED 6,7" 120Hz' },
      { name: 'Chipset', value: 'Octa-core 5nm' },
      { name: 'Kamera', value: '108MP + 8MP + 2MP' },
      { name: 'Baterai', value: '5000mAh, Fast Charge 67W' },
      { name: 'Storage', value: '256GB / 8GB RAM' },
      { name: 'Warna', value: 'Midnight Black, Sky Blue' },
    ],
    cta: { type: 'affiliate', text: 'Beli via Affiliate', url: 'https://example.com/affiliate/nova-x5' },
    featured: true,
    createdAt: Date.now() - 1000,
  }),
  product({
    id: 'p-2',
    name: 'Wireless Earbuds Pro ANC',
    slug: 'wireless-earbuds-pro-anc',
    mainImage: IMG('photo-1755182529034-189a6051faae'),
    images: [
      IMG('photo-1755182529034-189a6051faae'),
      IMG('photo-1754142654807-1dfdc3f7f22'),
    ],
    normalPrice: 799000,
    salePrice: 559000,
    discount: 30,
    description:
      'Earbuds nirkabel dengan Active Noise Cancellation, mode transparansi, dan Bluetooth 5.3. Tahan hamburan air IPX5, total daya tahan hingga 36 jam bersama case charging.',
    specifications: [
      { name: 'Koneksi', value: 'Bluetooth 5.3' },
      { name: 'Fitur', value: 'ANC + Transparency' },
      { name: 'Daya Tahan', value: '36 jam (dengan case)' },
      { name: 'Tahan Air', value: 'IPX5' },
    ],
    cta: { type: 'whatsapp', text: 'Tanya via WhatsApp' },
    featured: true,
    createdAt: Date.now() - 2000,
  }),
  product({
    id: 'p-3',
    name: 'Smartwatch Pulse S2 AMOLED',
    slug: 'smartwatch-pulse-s2-amoled',
    mainImage: IMG('photo-1579586337278-3befd40fd17a'),
    images: [
      IMG('photo-1579586337278-3befd40fd17a'),
      IMG('photo-1546868871-7041f2a55e12'),
      IMG('photo-1624096104992-9b4fa3a279dd'),
    ],
    normalPrice: 1299000,
    salePrice: 999000,
    discount: 23,
    description:
      'Smartwatch dengan layar AMOLED 1,43 inci, lebih dari 100 mode olahraga, pemantauan detak jantung & SpO2 24 jam, serta ketahanan baterai hingga 10 hari.',
    specifications: [
      { name: 'Layar', value: 'AMOLED 1,43"' },
      { name: 'Sensor', value: 'Heart Rate, SpO2, Sleep' },
      { name: 'Baterai', value: 'Hingga 10 hari' },
      { name: 'Kompatibel', value: 'Android & iOS' },
    ],
    cta: { type: 'affiliate', text: 'Beli Sekarang', url: 'https://example.com/affiliate/pulse-s2' },
    featured: true,
    createdAt: Date.now() - 3000,
  }),
  product({
    id: 'p-4',
    name: 'Powerbank 20000mAh Fast Charging 65W',
    slug: 'powerbank-20000mah-fast-charging-65w',
    mainImage: IMG('photo-1613329671121-5d1cf551cc3f'),
    images: [IMG('photo-1613329671121-5d1cf551cc3f')],
    normalPrice: 450000,
    salePrice: 349000,
    discount: 22,
    description:
      'Powerbank kapasitas 20000mAh dengan output 65W yang mampu mengisi laptop USB-C, dua port sekaligus, dan display digital sisa daya.',
    specifications: [
      { name: 'Kapasitas', value: '20000mAh' },
      { name: 'Output', value: '65W USB-C PD' },
      { name: 'Port', value: '2x USB-A, 1x USB-C' },
    ],
    cta: { type: 'custom', text: 'Beli di Marketplace', url: 'https://example.com/shop/powerbank' },
    createdAt: Date.now() - 4000,
  }),
  product({
    id: 'p-5',
    name: 'Mechanical Keyboard RGB TKL Hot-Swap',
    slug: 'mechanical-keyboard-rgb-tkl-hot-swap',
    mainImage: IMG('photo-1548347663-9d68552ae13b'),
    images: [
      IMG('photo-1548347663-9d68552ae13b'),
      IMG('photo-1760656523257-4f89c1e41fb1'),
    ],
    normalPrice: 850000,
    salePrice: 699000,
    discount: 18,
    description:
      'Keyboard mekanis TKL dengan hot-swappable switch, kabel detachable, keycaps PBT double-shot, dan RGB per-key yang bisa dikustomisasi.',
    specifications: [
      { name: 'Layout', value: 'TKL 87 tombol' },
      { name: 'Switch', value: 'Hot-swap 3/5 pin' },
      { name: 'Koneksi', value: 'USB-C detachable' },
      { name: 'Keycaps', value: 'PBT double-shot' },
    ],
    cta: { type: 'whatsapp', text: 'Pesan via WhatsApp' },
    createdAt: Date.now() - 5000,
  }),
  product({
    id: 'p-6',
    name: 'Laptop Ultrabook Air 14" 512GB',
    slug: 'laptop-ultrabook-air-14-512gb',
    mainImage: IMG('photo-1496181133206-80ce9b88a853'),
    images: [
      IMG('photo-1496181133206-80ce9b88a853'),
      IMG('photo-1517336714731-489689fd1ca8'),
    ],
    normalPrice: 12999000,
    salePrice: 11499000,
    discount: 12,
    description:
      'Ultrabook tipis 1,25kg dengan layar 14" IPS 2.2K, prosesor generasi terbaru 8-core, RAM 16GB, SSD 512GB, dan baterai seharian. Cocok untuk kerja dan kuliah.',
    specifications: [
      { name: 'Layar', value: '14" IPS 2.2K' },
      { name: 'Prosesor', value: '8-core terbaru' },
      { name: 'Memori', value: '16GB RAM / 512GB SSD' },
      { name: 'Baterai', value: 'Hingga 14 jam' },
      { name: 'Bobot', value: '1,25 kg' },
    ],
    cta: { type: 'affiliate', text: 'Beli via Affiliate', url: 'https://example.com/affiliate/ultrabook-air' },
    featured: true,
    createdAt: Date.now() - 6000,
  }),
  product({
    id: 'p-7',
    name: 'Hoodie Oversize Fleece Premium',
    slug: 'hoodie-oversize-fleece-premium',
    mainImage: IMG('photo-1556821840-3a63f95609a7'),
    images: [
      IMG('photo-1556821840-3a63f95609a7'),
      IMG('photo-1578768079052-aa76e52ff62e'),
    ],
    normalPrice: 349000,
    salePrice: 269000,
    discount: 23,
    description:
      'Hoodie oversize bahan fleece tebal dengan bahan lembut di bagian dalam, jahitan rapi, dan potongan modern. Tersedia warna hitam, abu, dan krem.',
    specifications: [
      { name: 'Bahan', value: 'Cotton Fleece 330gsm' },
      { name: 'Fit', value: 'Oversize' },
      { name: 'Warna', value: 'Hitam, Abu, Krem' },
      { name: 'Ukuran', value: 'M, L, XL, XXL' },
    ],
    cta: { type: 'whatsapp', text: 'Pesan via WhatsApp' },
    featured: true,
    createdAt: Date.now() - 7000,
  }),
  product({
    id: 'p-8',
    name: 'Kaos Polos Cotton Combed 30s',
    slug: 'kaos-polos-cotton-combed-30s',
    mainImage: IMG('photo-1581655353564-df123a1eb820'),
    images: [
      IMG('photo-1581655353564-df123a1eb820'),
      IMG('photo-1583743814966-8936f5b7be1a'),
    ],
    normalPrice: 119000,
    salePrice: 89000,
    discount: 25,
    description:
      'Kaos polos bahan katun combed 30s yang adem, tidak mudah melar, dan nyaman dipakai seharian. Cocok untuk daily maupun sablon custom.',
    specifications: [
      { name: 'Bahan', value: 'Cotton Combed 30s' },
      { name: 'Ukuran', value: 'S, M, L, XL, XXL' },
      { name: 'Warna', value: '12 pilihan warna' },
    ],
    cta: { type: 'none', text: '' },
    createdAt: Date.now() - 8000,
  }),
  product({
    id: 'p-9',
    name: 'Celana Chino Slim Fit Stretch',
    slug: 'celana-chino-slim-fit-stretch',
    mainImage: IMG('photo-1590159983013-d4ff5fc71c1d'),
    images: [IMG('photo-1590159983013-d4ff5fc71c1d')],
    normalPrice: 279000,
    salePrice: 219000,
    discount: 21,
    description:
      'Celana chino dengan potongan slim fit dan bahan stretch yang nyaman untuk aktivitas maupun kerja. Tersedia warna navy, khaki, dan hitam.',
    specifications: [
      { name: 'Bahan', value: 'Cotton Stretch' },
      { name: 'Fit', value: 'Slim Fit' },
      { name: 'Warna', value: 'Navy, Khaki, Hitam' },
    ],
    cta: { type: 'affiliate', text: 'Beli Sekarang', url: 'https://example.com/affiliate/chino' },
    createdAt: Date.now() - 9000,
  }),
  product({
    id: 'p-10',
    name: 'Sneakers Urban Runner Unisex',
    slug: 'sneakers-urban-runner-unisex',
    mainImage: IMG('photo-1544441892-794166f1e3be'),
    images: [
      IMG('photo-1544441892-794166f1e3be'),
      IMG('photo-1542291026-7eec264c27ff'),
    ],
    normalPrice: 599000,
    salePrice: 479000,
    discount: 20,
    description:
      'Sneakers ringan dengan midsole empuk dan outsole anti-slip. Desain clean yang cocok dipadukan dengan outfit casual maupun sporty.',
    specifications: [
      { name: 'Bahan Atas', value: 'Mesh + Synthetic' },
      { name: 'Sol', value: 'Rubber anti-slip' },
      { name: 'Ukuran', value: '39 - 44' },
    ],
    cta: { type: 'whatsapp', text: 'Order via WhatsApp' },
    featured: true,
    createdAt: Date.now() - 10000,
  }),
  product({
    id: 'p-11',
    name: 'Tas Ransel Laptop 15" Water Repellent',
    slug: 'tas-ransel-laptop-15-water-repellent',
    mainImage: IMG('photo-1622260614153-03223fb72052'),
    images: [
      IMG('photo-1622260614153-03223fb72052'),
      IMG('photo-1501555088652-021faa106b9b'),
    ],
    normalPrice: 389000,
    salePrice: 299000,
    discount: 23,
    description:
      'Tas ransel dengan laptop sleeve 15 inci, bahan water repellent, banyak kompartemen, dan punggung ergonomic untuk kenyamanan seharian.',
    specifications: [
      { name: 'Kapasitas', value: '22L' },
      { name: 'Laptop', value: 'Hingga 15 inci' },
      { name: 'Bahan', value: 'Polyester water repellent' },
    ],
    cta: { type: 'custom', text: 'Beli di Toko', url: 'https://example.com/shop/tas-ransel' },
    createdAt: Date.now() - 11000,
  }),
  product({
    id: 'p-12',
    name: 'Tas Selempang Wanita Minimalis',
    slug: 'tas-selempang-wanita-minimalis',
    mainImage: IMG('photo-1548746337-faebd2a39276'),
    images: [
      IMG('photo-1548746337-faebd2a39276'),
      IMG('photo-1575671153502-a417e2ddd259'),
    ],
    normalPrice: 259000,
    salePrice: 0,
    discount: 0,
    description:
      'Tas selempang ukuran kecil dengan desain minimalis, bahan premium leather kulit sintetis, dan tali yang bisa dipendekkan.',
    specifications: [
      { name: 'Bahan', value: 'Premium Faux Leather' },
      { name: 'Ukuran', value: '22 x 15 x 7 cm' },
      { name: 'Warna', value: 'Hitam, Coklat, Putih' },
    ],
    cta: { type: 'whatsapp', text: 'Tanya Stok' },
    status: false,
    createdAt: Date.now() - 12000,
  }),
]

export const initialBanners = [
  {
    id: 'b-1',
    title: 'Promo Gajian Diskon Hingga 50%',
    subtitle: 'Kumpulan produk elektronik & fashion pilihan harga spesial minggu ini.',
    buttonText: 'Belanja Sekarang',
    buttonUrl: '/products',
    image: IMG('photo-1607083206968-13611e3d76db', 1600),
    order: 1,
    status: true,
  },
  {
    id: 'b-2',
    title: 'Koleksi Outfit Terbaru',
    subtitle: 'Hoodie, sneakers, dan tas kekinian siap dikirim hari ini.',
    buttonText: 'Lihat Koleksi',
    buttonUrl: '/products',
    image: IMG('photo-1441986300917-64674bd600d8', 1600),
    order: 2,
    status: true,
  },
  {
    id: 'b-3',
    title: 'Garansi Produk 100% Original',
    subtitle: 'Semua produk bergaransi dan didukung layanan purna jual.',
    buttonText: 'Pelajari',
    buttonUrl: '/products',
    image: IMG('photo-1518770660439-4636190af475', 1600),
    order: 3,
    status: false,
  },
]

export const initialSettings = {
  storeName: 'Aruna Store',
  logo: '',
  favicon: '',
  tagline: 'Affiliate & Dropship Store',
  description:
    'Toko online affiliate & dropship untuk produk elektronik dan fashion. Harga bersaing, produk terkurasi, dan pembelian mudah via WhatsApp maupun affiliate.',
  whatsapp: '6283166857537',
  instagram: 'https://instagram.com/arunastore',
  tiktok: 'https://tiktok.com/@arunastore',
  facebook: 'https://facebook.com/arunastore',
  footer: 'Produk terkurasi untuk kebutuhan elektronik & fashion harian Anda.',
  copyright: '© 2026 Aruna Store. Seluruh hak cipta dilindungi.',
  seoTitle: 'Aruna Store — Affiliate & Dropship Store',
  seoDescription:
    'Belanja produk elektronik & fashion terkurasi: smartphone, laptop, aksesoris, outfit, sepatu, dan tas.',
  seoKeywords: 'affiliate, dropship, toko online, elektronik, fashion, smartphone, outfit',
  seoImage: '',
  siteUrl: '',
}

export const initialCtaSettings = {
  defaultType: 'whatsapp',
  defaultText: 'Beli Sekarang',
  defaultUrl: 'https://example.com/affiliate',
}

export const initialWhatsappSettings = {
  number: '6283166857537',
  template:
    'Halo kak, saya tertarik dengan produk {product_name}.\nHarga: {price}\n\nApakah produknya masih tersedia?',
}
