import { z } from "zod";

export const TUserSchema = z.object({
  id: z.number().or(z.string()),
  email: z.string().email(),
  name: z.string(),
  avatar: z.string().nullable(),
});

export type TUser = z.infer<typeof TUserSchema>;

export enum STOCKS {
  BAJAJHIND = "BAJAJHIND",
  BANDHANBNK = "BANDHANBNK",
  BERGEPAINT = "BERGEPAINT",
  CAMLINFINE = "CAMLINFINE",
  CANBK = "CANBK",
  CENTRALBK = "CENTRALBK",
  EASEMYTRIP = "EASEMYTRIP",
  GSFC = "GSFC",
  GSPL = "GSPL",
  IEX = "IEX",
  IOC = "IOC",
  IRFC = "IRFC",
  JPPOWER = "JPPOWER",
  KANSAINER = "KANSAINER",
  NTPC = "NTPC",
  SCI = "SCI",
  SJVN = "SJVN",
  SOUTHBANK = "SOUTHBANK",
  SYNCOMF = "SYNCOMF",
  TNPETRO = "TNPETRO",
  VALIANTORG = "VALIANTORG",
  VEDL = "VEDL",
}

export type Color = {
  r: number;
  g: number;
  b: number;
};

export type ModalType = "VIEW_STOCK" | "LOADING";
