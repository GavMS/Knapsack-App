# Knapsack 0/1 DFS Backtracking

File ini berisi implementasi sederhana Knapsack 0/1 menggunakan recursive DFS, pruning sederhana, dan statistik eksekusi.

## Cara Menjalankan

Pastikan Node.js sudah terpasang, lalu jalankan:

```bash
node knapsack.js
```

## Isi Program

Program sudah berisi contoh minimal 8 item dengan atribut:
- nama
- berat
- value

Selain itu, program juga menyimpan kapasitas maksimum knapsack (`W`) di dalam file.

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