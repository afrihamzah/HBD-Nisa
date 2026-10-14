# A Little World For You 🤍

Website ucapan ulang tahun pribadi untuk Nurul Alfatitu Annisa dari Afri.
Murni HTML + CSS + JavaScript. **Tanpa backend, tanpa database, tanpa build.**

---

## 🎯 Cara Menjalankan

### Opsi 1: Langsung buka
Klik 2x `index.html` → terbuka di browser. Selesai.

### Opsi 2: Preview di HP (opsional)
Kalau HP dan laptop satu WiFi:
```bash
python3 -m http.server 8000
```
Lalu di HP buka `http://<IP-laptop>:8000` (cek IP: System Preferences → Network).

---

## 🧭 Alur Website

1. **Home** — ucapan pembuka. Klik **"Open your little surprise"** untuk lanjut.
2. **Menu** — 2 pilihan:
   - 💌 **Letter** — amplop, klik "Open my letter" → surat muncul.
   - 💝 **For You** — 8 kartu alasan (klik untuk flip), pesan rahasia, pesan penutup.
3. Tiap halaman (Letter & For You) punya tombol **"← Kembali ke Menu"**.

> **Catatan:** refresh selalu mulai dari halaman Home.

---

## ✏️ Cara Mengubah Teks

Semua teks ada di **satu file: `content.js`**. Ubah, simpan, lalu refresh browser (Cmd/Ctrl + Shift + R untuk hard refresh).

| Yang bisa diubah | Key di `content.js` |
|---|---|
| Nama penerima | `recipientName` |
| Nama pengirim | `senderName` |
| Tanggal ulang tahun | `birthday` |
| Pesan Home | `homeMessage` (pakai `\n` untuk baris baru) |
| Isi surat | `letter` |
| 8 alasan | `reasons[]` |
| Pesan rahasia | `secretMessage` |
| Pesan penutup | `finalMessage` |

---

## 📁 Struktur File

```
Project HBD Nisa/
├── index.html      # Struktur halaman
├── style.css       # Semua styling
├── script.js       # Semua interaksi
├── content.js      # SEMUA teks ada di sini
└── README.md       # Dokumentasi ini
```

Untuk deploy, upload **4 file ini saja**: `index.html`, `style.css`, `script.js`, `content.js`.

---

## 🚀 Cara Deploy (Gratis)

- **Netlify:** Dashboard → "Add new site" → "Deploy manually" → drag & drop folder project.
- **Vercel:** Import project / drag & drop folder.
- **GitHub Pages:** Push ke repo → Settings → Pages → pilih branch `main`, folder root.

---

## ⚠️ Catatan

- Website pakai **Google Fonts** → butuh internet saat load pertama (setelah itu ke-cache).
- Kalau font/anime terasa aneh: pastikan browser modern (Chrome/Safari/Firefox) dan buka dalam mode portrait.

---

**Dibuat dengan ❤️ untuk Nurul Alfatitu Annisa**

Selamat ulang tahun, Sayang! 🎂✨
