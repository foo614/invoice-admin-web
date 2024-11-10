import dayjs from 'dayjs';
import { Request, Response } from 'express';

const genAuditLogList = (total = 1000) => {
  const auditLogDataSource = [];

  for (let i = 0; i < total; i += 1) {
    auditLogDataSource.push({
      key: i,
      actionType: i % 2 === 0 ? 'Create' : 'Delete',
      description: `Audit log entry #${i}`,
      createdBy: `User ${i % 10}`,
      createdAt: dayjs().subtract(i, 'minute').format('YYYY-MM-DD HH:mm:ss'),
    });
  }

  return auditLogDataSource;
};

let auditLogDataSource = genAuditLogList();

function getAuditLogs(req: Request, res: Response) {
  const { current = 1, pageSize = 10 } = req.query;

  const start = (parseInt(current as string, 10) - 1) * parseInt(pageSize as string, 10);
  const end = start + parseInt(pageSize as string, 10);

  const dataSource = auditLogDataSource.slice(start, end);

  const result = {
    data: dataSource,
    total: auditLogDataSource.length,
    success: true,
    pageSize: parseInt(pageSize as string, 10),
    current: parseInt(current as string, 10),
  };

  return res.json(result);
}

export default {
  'GET /api/audit-logs': getAuditLogs,
};
