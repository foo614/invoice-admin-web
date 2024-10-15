// mock/eInvoiceMock.ts

import { Request, Response } from 'express';

// Generate 20 records using a loop
let eInvoiceTransactions = [];

Array.from({ length: 20 }).forEach((_, index) => {
  const invoiceId = `INV${(index + 1).toString().padStart(5, '0')}`;
  eInvoiceTransactions.push({
    Version: '1.01',
    TranDtls: {
      TaxSch: 'GST',
      SupTyp: index % 3 === 0 ? 'B2B' : 'SEZWOP',
      RegRev: index % 2 === 0 ? 'Y' : 'N',
      EcmGstin: `37BZNPM9430M${index + 1}KL`,
      IgstOnIntra: index % 2 === 0 ? 'Y' : 'N',
    },
    DocDtls: {
      Typ: index % 3 === 0 ? 'INV' : index % 3 === 1 ? 'CRN' : 'DBN',
      No: `${455 + index}/1`,
      Dt: `${(index % 28) + 1}/11/2019`,
    },
    SellerDtls: {
      Gstin: `29BZNPM9430M${index + 1}KL`,
      LglNm: `Seller ${index + 1} Pvt Ltd`,
      TrdNm: `Seller ${index + 1} Enterprises`,
      Addr1: `${index + 1} Floor`,
      Addr2: index % 2 === 0 ? 'BANGALORE' : 'HYDERABAD',
      Loc: index % 2 === 0 ? 'BANGALORE' : 'HYDERABAD',
      Pin: 560000 + index,
      Stcd: `${29 + (index % 10)}`,
      Ph: `12345678${(90 + index) % 100}`,
      Em: `seller${index + 1}@company.com`,
    },
    BuyerDtls: {
      Gstin: `29AZNPM8430M${index + 1}KM`,
      LglNm: `Buyer ${index + 1} Ltd`,
      TrdNm: `Buyer ${index + 1} Enterprises`,
      Pos: `${29 + (index % 10)}`,
      Addr1: `${index + 1} Main Street`,
      Addr2: index % 2 === 0 ? 'CHENNAI' : 'DELHI',
      Loc: index % 2 === 0 ? 'MG ROAD' : 'MG CHOWK',
      Stcd: 'Karnataka',
      Pin: 560045 + index,
      Ph: `98765432${(10 + index) % 100}`,
      Em: `buyer${index + 1}@service.com`,
    },
    DispDtls: {
      Nm: `Dispatch ${index + 1}`,
      Addr1: `${index + 1} Warehouse`,
      Addr2: index % 2 === 0 ? 'BANGALORE' : 'MUMBAI',
      Loc: index % 2 === 0 ? 'DISP LOCATION A' : 'DISP LOCATION B',
      Pin: 560066 + index,
      Stcd: `${29 + (index % 10)}`,
    },
    ShipDtls: {
      Gstin: `29BZNPM9430M${index + 1}KL`,
      LglNm: `Ship To ${index + 1} Pvt Ltd`,
      TrdNm: `Ship To ${index + 1} Enterprises`,
      Addr1: `${index + 1} Dockyard`,
      Addr2: index % 2 === 0 ? 'KOLKATA' : 'PUNE',
      Loc: index % 2 === 0 ? 'MG ROAD' : 'NAVI PUNE',
      Pin: 560033 + index,
      Stcd: `${29 + (index % 10)}`,
    },
    ItemList: [
      {
        Item: {
          SlNo: (index + 1).toString(),
          PrdDesc: `Product ${index + 1}`,
          IsServc: index % 2 === 0 ? 'Y' : 'N',
          HsnCd: `100110${index}`,
          BchDtls: {
            Nm: `BATCH${index + 1}`,
            ExpDt: `${(index % 28) + 1}/11/2022`,
            WrDt: `${(index % 28) + 1}/11/2023`,
          },
          Barcde: `45666${index}789`,
          Qty: 50 + index,
          FreeQty: index % 5,
          Unit: 'NOS',
          UnitPrice: 1230 + index * 10,
          TotAmt: (1230 + index * 10) * (50 + index),
          Discount: 100,
          PreTaxVal: 9,
          AssAmt: 1145,
          GstRt: 18,
          IgstAmt: 0,
          CgstAmt: index % 2 === 0 ? 900 : 0,
          SgstAmt: index % 2 === 0 ? 900 : 0,
          CesRt: 0,
          CesAmt: 0,
          CesNonAdvlAmt: 0,
          StateCesRt: 0,
          StateCesAmt: 0,
          StateCesNonAdvlAmt: 0,
          OthChrg: 15,
          OrdLineRef: `746/ABC/0${index + 1}`,
          OrgCntry: index % 2 === 0 ? 'IN' : 'DZ',
          PrdSlNo: `SLNO${index + 1}`,
          TotItemVal: (1230 + index * 10) * (50 + index) - 100 + 30,
          AttribDtls: {
            Nm: 'Color',
            Val: index % 2 === 0 ? 'Red' : 'Blue',
          },
        },
      },
    ],
    ValDtls: {
      AssVal: 67555.85 + index * 100,
      CgstVal: index % 2 === 0 ? 5152.5 : 0,
      SgstVal: index % 2 === 0 ? 5152.5 : 0,
      IgstVal: 0,
      CesVal: 0,
      StCesVal: 0,
      Discount: 0,
      OthChrg: 0,
      RndOffAmt: 0,
      TotInvVal: 5200 + index * 100,
      TotInvValFc: 100 + index * 5,
    },
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
