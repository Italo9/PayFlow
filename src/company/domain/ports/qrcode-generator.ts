export const QRCODE_GENERATOR = Symbol('COMPANY_QRCODE_GENERATOR');

export interface QrCodeGenerator {
  fromText(text: string): Promise<string>;
}
