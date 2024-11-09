export const invoiceTypesConfig = {
  '01': {
    name: 'Standard Invoice',
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
    name: 'Self-Billed Invoice',
    fields: ['BuyerDetails', 'SellerDetails', 'ItemList', 'TotalInvoiceValue', 'DigitalSignature'],
  },
  '12': {
    name: 'Self-Billed Credit Note',
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
    name: 'Self-Billed Debit Note',
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
