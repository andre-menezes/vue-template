/**
 * Service de relatórios — exemplo de download de arquivo via API.
 *
 * O backend (Java) responde com um `InputStream` e o cabeçalho
 * `Content-Disposition: attachment; filename="relatorio.pdf"`.
 * O service chama `httpClient.download` e retorna o `BinaryResponse`
 * para que o helper/view faça o salvamento.
 */
import { httpClient } from '../instances';
import type { BinaryResponse } from '@typings/services';

/**
 * Baixa o relatório de um recurso específico.
 *
 * @param id Identificador do recurso.
 * @returns O blob do arquivo e o cabeçalho Content-Disposition.
 *
 * @example
 * const response = await downloadReportRequest(123);
 */
export function downloadReportRequest(id: number): Promise<BinaryResponse> {
  return httpClient.download(`/reports/${id}/pdf`);
}
