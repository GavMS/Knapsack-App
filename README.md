# Knapsack 0/1 DFS Backtracking

File ini berisi implementasi sederhana Knapsack 0/1 menggunakan recursive DFS, pruning sederhana, dan statistik eksekusi.

## Cara Menjalankan

Pastikan Node.js sudah terpasang, lalu jalankan:

```bash
node knapsack.js
```

## Isi Program

Program mengambil input dari pengguna secara interaktif melalui konsol saat dijalankan. Pengguna akan diminta untuk memasukkan:
- Kapasitas maksimal Knapsack
- Jumlah barang
- Atribut detail setiap barang berupa nama, berat, dan value

## Output

Saat dijalankan, program menampilkan:
- daftar barang
- kombinasi optimal
- total berat
- total value maksimum
- jumlah node yang dikunjungi
- waktu eksekusi

## Pruning

Pruning yang dipakai ada dua:
- berhenti jika berat melebihi kapasitas
- berhenti jika value terbaik yang mungkin dari sisa item tidak bisa mengalahkan solusi terbaik saat ini

## Catatan

Implementasi dibuat sesederhana mungkin agar mudah dipahami mahasiswa dan langsung bisa diuji dari console.