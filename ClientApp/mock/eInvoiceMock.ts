import { faker } from '@faker-js/faker';
import { Request, Response } from 'express';

const generateMockData = () => {
  return Array.from({ length: 30 }).map(() => ({
    Version: '1.01',
    Irn: faker.string.uuid(),
    TranDtls: {
      TaxSch: 'GST',
      SupTyp: faker.helpers.arrayElement(['B2B', 'B2C']),
      RegRev: faker.helpers.arrayElement(['Y', 'N']),
      EcmGstin: faker.helpers.replaceSymbols('##????#########'),
      IgstOnIntra: faker.helpers.arrayElement(['Y', 'N']),
    },
    DocDtls: {
      Typ: faker.helpers.arrayElement(['INV', 'CRN', 'DBN']),
      No: `${faker.number.int({ min: 1, max: 99 })}/${new Date().getFullYear()}`,
      Dt: faker.date.past().toISOString().slice(0, 10),
    },
    SellerDtls: {
      Gstin: faker.helpers.replaceSymbols('##????#########'),
      LglNm: faker.company.name(),
      TrdNm: faker.company.buzzNoun(),
      Addr1: faker.location.streetAddress(),
      Addr2: faker.location.secondaryAddress(),
      Loc: faker.location.city(),
      Pin: faker.location.zipCode(),
      Stcd: faker.number.int({ min: 1, max: 36 }).toString(),
      Ph: faker.phone.number,
      Em: faker.internet.email(),
    },
    BuyerDtls: {
      Gstin: faker.helpers.replaceSymbols('##????#########'),
      LglNm: faker.company.name(),
      TrdNm: faker.company.buzzNoun(),
      Addr1: faker.location.streetAddress(),
      Addr2: faker.location.secondaryAddress(),
      Loc: faker.location.city(),
      Pin: faker.location.zipCode(),
      Stcd: faker.number.int({ min: 1, max: 36 }).toString(),
      Ph: faker.phone.number,
      Em: faker.internet.email(),
    },
    DispDtls: {
      Nm: faker.company.name(),
      Addr1: faker.location.streetAddress(),
      Addr2: faker.location.secondaryAddress(),
      Loc: faker.location.city(),
      Pin: faker.location.zipCode(),
      Stcd: faker.number.int({ min: 1, max: 36 }).toString(),
    },
    ShipDtls: {
      Gstin: faker.helpers.replaceSymbols('##????#########'),
      LglNm: faker.company.name(),
      TrdNm: faker.company.buzzNoun(),
      Addr1: faker.location.streetAddress(),
      Addr2: faker.location.secondaryAddress(),
      Loc: faker.location.city(),
      Pin: faker.location.zipCode(),
      Stcd: faker.number.int({ min: 1, max: 36 }).toString(),
    },
    ItemList: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }).map(() => ({
      SlNo: faker.number.int({ min: 1, max: 100 }).toString(),
      PrdDesc: faker.commerce.productDescription(),
      IsServc: faker.helpers.arrayElement(['Y', 'N']),
      HsnCd: faker.number.int({ min: 1000, max: 99999999 }).toString(),
      Qty: faker.number.int({ min: 1, max: 100 }),
      Unit: faker.helpers.arrayElement(['PCS', 'KG', 'L']),
      UnitPrice: faker.commerce.price({ min: 10, max: 1000, dec: 2 }),
      TotAmt: faker.commerce.price({ min: 10, max: 1000, dec: 2 }),
      GstRt: faker.number.int({ min: 0, max: 28 }),
      AssAmt: faker.commerce.price({ min: 10, max: 1000, dec: 2 }),
      TotItemVal: faker.commerce.price({ min: 10, max: 1000, dec: 2 }),
    })),
    ValDtls: {
      AssVal: faker.commerce.price({ min: 10, max: 1000, dec: 2 }),
      TotInvVal: faker.commerce.price({ min: 10, max: 1000, dec: 2 }),
    },
    status: faker.helpers.arrayElement(['submitted', 'pending', 'rejected']),
    submittedDate: faker.date.recent().toISOString(),
  }));
};

let eInvoiceTransactions = generateMockData();

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
