export const QRCODE_GENERATOR = Symbol('QRCODE_GENERATOR');

export interface QrCodeGenerator {
  fromText(text: string): Promise<string>;
}
