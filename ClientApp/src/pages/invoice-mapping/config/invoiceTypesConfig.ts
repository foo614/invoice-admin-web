export const invoiceTypesConfig = {
  '01': {
    name: 'Sales Invoices',
    fields: [
      'SellerDetails',
      'BuyerDetails',
      'ItemList',
      'MonetaryAmounts',
      'TaxAmounts',
      'TotalInvoiceValue',
    ],
  },
  '02': {
    name: 'Credit Note',
    fields: [
      'OriginalInvoiceReference',
      'SellerDetails',
      'BuyerDetails',
      'ItemList',

      'TotalInvoiceValue',
    ],
  },
  '03': {
    name: 'Debit Note',
    fields: [
      'OriginalInvoiceReference',
      'SellerDetails',
      'BuyerDetails',
      'ItemList',

      'TotalInvoiceValue',
    ],
  },
  '11': {
    name: 'Purchase Invoice (Self Billing)',
    fields: ['BuyerDetails', 'SellerDetails', 'ItemList', 'TotalInvoiceValue', 'DigitalSignature'],
  },
  '12': {
    name: 'Credit Note (Self Billing)',
    fields: [
      'OriginalInvoiceReference',
      'BuyerDetails',
      'SellerDetails',
      'ItemList',
      'TotalInvoiceValue',
      'DigitalSignature',
    ],
  },
  '13': {
    name: 'Debit Note (Self Billing)',
    fields: [
      'OriginalInvoiceReference',
      'BuyerDetails',
      'SellerDetails',
      'ItemList',
      'TotalInvoiceValue',
      'DigitalSignature',
    ],
  },
};
