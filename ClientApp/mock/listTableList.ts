// mock/eInvoiceMock.ts

import { Request, Response } from 'express';

let eInvoiceTransactions = [];

// Generate 20 records using a loop
Array.from({ length: 20 }).forEach((_, index) => {
  const invoiceId = `INV${(index + 1).toString().padStart(5, '0')}`;
  eInvoiceTransactions.push({
    invoiceId,
    version: '1.01',
    tranDtls: {
      taxSch: 'GST',
      supTyp: index % 3 === 0 ? 'B2B' : 'B2C',
      regRev: index % 2 === 0 ? 'Y' : 'N',
      ecmGstin: `37BZNPM9430M${index + 1}KL`,
      igstOnIntra: index % 2 === 0 ? 'Y' : 'N',
    },
    docDtls: {
      typ: index % 3 === 0 ? 'INV' : index % 3 === 1 ? 'CRN' : 'DBN',
      no: `${index + 1}/2024`,
      dt: `${(index % 28) + 1}/01/2024`,
    },
    sellerDtls: {
      gstin: `29BZNPM9430M${index + 1}KL`,
      lglNm: `Seller ${index + 1} Pvt Ltd`,
      trdNm: `Seller ${index + 1} Enterprises`,
      loc: index % 2 === 0 ? 'BANGALORE' : 'MUMBAI',
      pin: 560000 + index,
      stcd: `${29 + (index % 10)}`,
      ph: `12345678${(90 + index) % 100}`,
      em: `seller${index + 1}@company.com`,
    },
    buyerDtls: {
      gstin: `29AZNPM8430M${index + 1}KM`,
      lglNm: `Buyer ${index + 1} Ltd`,
      pos: `${29 + (index % 10)}`,
      loc: index % 2 === 0 ? 'M G ROAD' : 'MG CHOWK',
    },
    valDtls: {
      totInvVal: 5000 + index * 100,
    },
    status: index % 3 === 0 ? 'submitted' : index % 3 === 1 ? 'pending' : 'rejected',
    submittedDate: `2024-10-${(index % 28) + 1}T10:00:00.000Z`,
  });
});

// Mock function to handle requests
export default {
  'GET /api/eInvoiceTransactions': (req: Request, res: Response) => {
    const { query } = req;
    let { pageSize = 10, current = 1 } = query;

    pageSize = parseInt(pageSize as string, 10);
    current = parseInt(current as string, 10);

    const total = eInvoiceTransactions.length;
    const transactions = eInvoiceTransactions.slice((current - 1) * pageSize, current * pageSize);

    res.json({
      data: transactions,
      total,
      success: true,
      pageSize,
      current,
    });
  },

  'POST /api/eInvoiceTransactions': (req: Request, res: Response) => {
    const { method, invoiceId, ...rest } = req.body;

    switch (method) {
      case 'delete':
        eInvoiceTransactions = eInvoiceTransactions.filter((item) => item.invoiceId !== invoiceId);
        break;

      case 'post':
        eInvoiceTransactions.push({
          ...rest,
          invoiceId: `INV${Math.floor(Math.random() * 100000)}`,
        });
        break;

      case 'update':
        eInvoiceTransactions = eInvoiceTransactions.map((item) => {
          if (item.invoiceId === invoiceId) {
            return { ...item, ...rest };
          }
          return item;
        });
        break;

      default:
        break;
    }

    res.json({ success: true });
  },
};
