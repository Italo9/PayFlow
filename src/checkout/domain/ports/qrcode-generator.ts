export const QRCODE_GENERATOR = Symbol('CHECKOUT_QRCODE_GENERATOR');

export interface QrCodeGenerator {
  fromText(text: string): Promise<string>;
}
