

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