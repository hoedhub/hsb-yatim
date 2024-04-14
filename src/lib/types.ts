

// id            String   @id @default(cuid())
// pekerjaan     String
// alokasi       Int
// tanggal_masuk DateTime
// status        String
// Orang         Orang[]

export type DataPekerjaan = {
  id: string;
  pekerjaan: string;
  alokasi: number;
  tanggal_masuk: Date;
  status: 'pending' | 'processing' | 'success' | 'failed';
  orang: string[];
};

export type DataUkuran = {
  id: number;
  nama: string;
  jurusan: string;
  jenis_kelamin: 'Pria' | 'Wanita';
  panjang_baju: number;
  bahu: number;
  tangan_pjg: number;
  tangan_pdk: number;
  l_tgn_pdk: number;
  l_dada: number;
  l_pinggang: number;
  l_pinggul: number;
  leher: number;
  jumlah_baju: number
  catatan_baju: string;
  printed_baju: boolean;
  panjang_celana: number;
  pinggang: number;
  pesak: number;
  paha: number;
  lutut: number;
  l_bawah: number;
  pinggul: number;
  jumlah_celana: number;
  catatan_celana: string;
  printed_celana: boolean;
}