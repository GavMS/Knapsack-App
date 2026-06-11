// Preset cases from contoh_soal_knapsack.txt
const presets = {
    case1: {
        capacity: 30,
        items: [
            { name: "Laptop",     weight: 12, profit: 1500 },
            { name: "Smartphone", weight:  5, profit:  800 },
            { name: "Tablet",     weight: 10, profit:  700 },
            { name: "Smartwatch", weight:  3, profit:  350 },
            { name: "Headphone",  weight:  4, profit:  300 },
            { name: "Kamera",     weight:  8, profit:  900 },
            { name: "Charger",    weight:  1, profit:  100 },
            { name: "Power Bank", weight:  2, profit:  200 },
            { name: "Keyboard",   weight:  3, profit:  250 }
        ]
    },
    case2: {
        capacity: 20,
        items: [
            { name: "Beras",  weight: 8, profit:  80 },
            { name: "Telur",  weight: 3, profit:  45 },
            { name: "Susu",   weight: 5, profit:  60 },
            { name: "Roti",   weight: 2, profit:  35 },
            { name: "Minyak", weight: 6, profit:  70 },
            { name: "Gula",   weight: 4, profit:  50 },
            { name: "Kopi",   weight: 1, profit:  20 },
            { name: "Teh",    weight: 1, profit:  18 }
        ]
    },
    case3: {
        capacity: 100,
        items: [
            { name: "Buku",       weight: 3, profit:  30 },
            { name: "Pensil",     weight: 1, profit:  10 },
            { name: "Pulpen",     weight: 1, profit:  15 },
            { name: "Penggaris",  weight: 2, profit:  20 },
            { name: "Kalkulator", weight: 5, profit:  80 },
            { name: "Tas Kecil",  weight: 4, profit:  40 },
            { name: "Rautan",     weight: 1, profit:   8 },
            { name: "Tipe-X",     weight: 1, profit:  12 }
        ]
    },
    case4: {
        capacity: 5,
        items: [
            { name: "TV",         weight: 30, profit: 1500 },
            { name: "Kulkas",     weight: 50, profit: 2000 },
            { name: "Mesin Cuci", weight: 45, profit: 1800 },
            { name: "AC",         weight: 35, profit: 1600 },
            { name: "Komputer",   weight: 20, profit: 1200 },
            { name: "Sofa",       weight: 40, profit: 1000 },
            { name: "Lemari",     weight: 55, profit:  800 },
            { name: "Meja",       weight: 25, profit:  600 }
        ]
    },
    case5: {
        capacity: 40,
        items: [
            { name: "Pakaian",      weight:  5, profit:  100 },
            { name: "Laptop",       weight: 15, profit:  500 },
            { name: "Obat-obatan",  weight:  2, profit:  300 },
            { name: "Charger",      weight:  1, profit:   50 },
            { name: "Kamera",       weight:  6, profit:  400 },
            { name: "Buku Panduan", weight:  3, profit:   80 },
            { name: "Sepatu Extra", weight:  8, profit:  150 },
            { name: "Toiletries",   weight:  4, profit:  120 },
            { name: "Payung",       weight:  2, profit:   60 },
            { name: "Makanan",      weight: 10, profit:  200 }
        ]
    }
};
