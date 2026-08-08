import { api } from "@/lib/api";

export interface MyQRCode {
  qrCode: string;
  qrImage: string; // data: URI PNG — ready for <img src={qrImage} />
  devoteeName: string | null;
  isInside: boolean;
  lastEntryAt: string | null;
  lastExitAt: string | null;
}

export async function getMyQRCode() {
  const { data } = await api.get("/devotee/qr-code/");
  return {
    qrCode: data.qr_code,
    qrImage: data.qr_image,
    devoteeName: data.devotee_name,
    isInside: Boolean(data.is_inside),
    lastEntryAt: data.last_entry_at,
    lastExitAt: data.last_exit_at,
  } satisfies MyQRCode;
}