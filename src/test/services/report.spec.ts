import { beforeEach, describe, expect, it, vi } from 'vitest';
import { downloadReportRequest } from '@shared/api/services/report.service';
import { httpClient } from '@shared/api/instances';

vi.mock('@shared/api/instances', () => ({
  httpClient: {
    download: vi.fn(),
  },
}));

describe('report service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('baixa o relatório pelo endpoint do recurso', async () => {
    const response = { blob: new Blob(['pdf']), contentDisposition: null };
    vi.mocked(httpClient.download).mockResolvedValue(response);

    await expect(downloadReportRequest(123)).resolves.toBe(response);
    expect(httpClient.download).toHaveBeenCalledWith('/reports/123/pdf');
  });
});
