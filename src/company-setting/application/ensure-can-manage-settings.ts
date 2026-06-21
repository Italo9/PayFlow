import { CompanyGateway } from '../domain/ports/company-gateway';
import { RequesterGateway } from '../domain/ports/requester-gateway';
import { CompanyNotFound, SettingOperationNotAllowed } from '../domain/company-setting';

export async function ensureCanManageSettings(
  requester: RequesterGateway,
  companies: CompanyGateway,
  companyId: number,
  token: string,
): Promise<void> {
  const user = await requester.getByToken(token);
  const exists = await companies.exists(companyId);
  if (!exists) throw new CompanyNotFound();
  if (!(user.role.toLowerCase() === 'admin') || !(user.companyId === companyId)) {
    throw new SettingOperationNotAllowed('Voce nao tem permissao para atualizar esta empresa');
  }
}
