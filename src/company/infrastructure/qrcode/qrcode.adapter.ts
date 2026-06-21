import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';
import { QrCodeGenerator } from '../../domain/ports/qrcode-generator';

@Injectable()
export class QrCodeAdapter implements QrCodeGenerator {
  fromText(text: string): Promise<string> {
    return QRCode.toDataURL(text);
  }
}
