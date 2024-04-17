import Dexie, { type Table } from 'dexie';

export interface Baju {
  id?: number
  panjang: number;
  bahu: number;
  tangan_pjg: number;
  tangan_pdk: number;
  l_tgn_pdk: number;
  l_dada: number;
  l_pinggang: number;
  l_pinggul: number;
  leher: number;
  jumlah: number
  catatan: string;
  printed: boolean;
  orangId: number;
}

export interface Celana {
  id?: number;
  panjang: number;
  pinggang: number;
  pesak: number;
  paha: number;
  lutut: number;
  l_bawah: number;
  pinggul: number;
  jumlah: number;
  catatan: string;
  printed: boolean;
  orangId: number;
}


export interface Orang {
  id?: number;
  nama: string;
  jurusan: string;
  jenis_kelamin: string;
  pekerjaanId: number;
}

export interface Pekerjaan {
  id?: number;
  pekerjaan: string;
  alokasi: number;
  tanggal_masuk: Date;
  status: string
}

export class MySubClassedDexie extends Dexie {
  // We just tell the typing system this is the case
  pekerjaan!: Table<Pekerjaan>;
  orang!: Table<Orang>;
  celana!: Table<Celana>;
  baju!: Table<Baju>;

  constructor() {
    super('hsbyatim');
    this.version(1).stores({
      pekerjaan: '++id, pekerjaan, tanggal_masuk', // Primary key and indexed props
      orang: '++id, pekerjaanId, nama, jurusan', // Primary key and indexed props
      baju: '++id, orangId', // Primary key and indexed props
      celana: '++id, orangId' // Primary key and indexed props,
    });
  }
}

export const db = new MySubClassedDexie();
