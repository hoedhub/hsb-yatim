-- CreateTable
CREATE TABLE "Pekerjaan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pekerjaan" TEXT NOT NULL,
    "alokasi" INTEGER NOT NULL,
    "tanggal_masuk" DATETIME NOT NULL,
    "status" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Orang" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "id_pekerjaan" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "jurusan" TEXT NOT NULL,
    "jenis_kelamin" BOOLEAN NOT NULL,
    "pekerjaanId" TEXT NOT NULL,
    CONSTRAINT "Orang_pekerjaanId_fkey" FOREIGN KEY ("pekerjaanId") REFERENCES "Pekerjaan" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Baju" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "id_orang" TEXT NOT NULL,
    "panjang" INTEGER NOT NULL DEFAULT 0,
    "bahu" INTEGER NOT NULL DEFAULT 0,
    "tangan_pjg" INTEGER NOT NULL DEFAULT 0,
    "tangan_pdk" INTEGER NOT NULL DEFAULT 0,
    "l_tgn_pdk" INTEGER NOT NULL DEFAULT 0,
    "l_dada" INTEGER NOT NULL DEFAULT 0,
    "l_pinggang" INTEGER NOT NULL DEFAULT 0,
    "l_pinggul" INTEGER NOT NULL DEFAULT 0,
    "leher" INTEGER NOT NULL DEFAULT 0,
    "jumlah" INTEGER NOT NULL DEFAULT 1,
    "catatan" TEXT,
    "printed" TEXT,
    "orangId" TEXT NOT NULL,
    CONSTRAINT "Baju_orangId_fkey" FOREIGN KEY ("orangId") REFERENCES "Orang" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Celana" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "id_orang" TEXT NOT NULL,
    "panjang" INTEGER NOT NULL DEFAULT 0,
    "pinggang" INTEGER NOT NULL DEFAULT 0,
    "pesak" INTEGER NOT NULL DEFAULT 0,
    "paha" INTEGER NOT NULL DEFAULT 0,
    "lutut" INTEGER NOT NULL DEFAULT 0,
    "l_bawah" INTEGER NOT NULL DEFAULT 0,
    "pinggul" INTEGER NOT NULL DEFAULT 0,
    "jumlah" INTEGER NOT NULL DEFAULT 1,
    "catatan" TEXT,
    "printed" TEXT,
    "orangId" TEXT NOT NULL,
    CONSTRAINT "Celana_orangId_fkey" FOREIGN KEY ("orangId") REFERENCES "Orang" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
