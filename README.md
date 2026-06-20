# Knapsack 0/1 Backtracking Visualizer

Aplikasi web sederhana untuk memvisualisasikan penyelesaian permasalahan Knapsack 0/1 menggunakan algoritma DFS backtracking dengan pruning bound.

## Cara Menjalankan

Tidak perlu instalasi apa pun. Cukup buka file `index.html` langsung di browser (cara termudah: klik dua kali file tersebut, atau klik kanan lalu pilih "Open with" browser pilihan Anda).

## Isi Program

Melalui antarmuka web, pengguna dapat:
- Mengatur kapasitas maksimal Knapsack
- Menambah/mengedit barang (nama, berat, profit) atau memilih preset soal
- Menjalankan visualisasi pohon DFS backtracking secara interaktif

## Output

Aplikasi menampilkan:
- daftar barang
- visualisasi pohon pencarian (tree visualizer)
- kombinasi optimal
- total berat dan total profit maksimum
- jumlah node yang dikunjungi
- waktu eksekusi

## Pruning

Pruning yang dipakai ada dua:
- berhenti jika berat melebihi kapasitas
- berhenti jika profit terbaik yang mungkin dari sisa item tidak bisa mengalahkan solusi terbaik saat ini

## Struktur Project

- `index.html` — entry point, langsung dijalankan di browser
- `css/` — styling (main, layout, components, tree)
- `js/` — logika aplikasi (`app.js`, `knapsack.js`, `presets.js`, `scenes.js`, `tree-visualizer.js`)

## Catatan

Implementasi dibuat sesederhana mungkin agar mudah dipahami mahasiswa dan langsung bisa diuji dari browser tanpa server atau dependensi tambahan.
