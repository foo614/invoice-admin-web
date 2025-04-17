export interface InvoiceData {
  // Supplier Information
  vdname?: string; // Supplier Name
  vdemail?: string; // Supplier Email
  vdaddresS1?: string; // Supplier Address Line 1
  vdaddresS2?: string; // Supplier Address Line 2
  vdaddresS3?: string; // Supplier Address Line 3
  vdaddresS4?: string; // Supplier Address Line 4
  vdcity?: string;
  vdstate?: string;
  vdzip?: string;
  vdcountry?: string;
  vdphone?: string; // Supplier Phone

  // Billing Information
  bilname?: string; // Billing Name / Buyer Name
  bilemail?: string; // Billing Email / Buyer Email
  biladdR1?: string; // Billing Address Line 1
  biladdR2?: string; // Billing Address Line 2
  biladdR3?: string; // Billing Address Line 3
  biladdR4?: string; // Billing Address Line 4
  bilcity?: string; // Buyer City
  bilstate?: string; // Buyer State
  bilzip?: string; // Buyer Zip
  bilcountry?: string; // Buyer Country
  bilphone?: string; // Buyer Contact

  // Shipping Information
  shpname?: string; // Shipping Name / Reference Name
  shpaddR1?: string; // Shipping Address Line 1
  shpaddR2?: string; // Shipping Address Line 2
  shpaddR3?: string; // Shipping Address Line 3
  shpaddR4?: string; // Shipping Address Line 4

  // Purchase Credit/Debit Note Specific
  crnhseq?: number; // Header Sequence Number
  crnnumber?: string; // Credit Note Number

  // Purchase Invoice Specific
  invhseq?: number; // Invoice Header Sequence
  invnumber?: string; // Invoice Number / e-Invoice Code/Number
  supplierBRN?: string; // Supplier BRN
  supplierTIN?: string; // Supplier TIN

  // Order Credit/Debit Note Specific
  crduniq?: number; // Unique Identifier for Credit/Debit Note
  ordnumber?: string; // Order Number
  crdnumber?: string; // Credit/Debit Note Number
  customer?: string; // Customer Identifier / Link to ARCUST.IDCUST
  crddate?: number; // Credit/Debit Date
  crdnet?: number; // Total Amount
  crdnetnotx?: number; // Total Excluding Tax
  crditaxtot?: number; // Total Tax Amount
  crdnetwtx?: number; // Total Payable Amount
  tautH1?: string; // Tax Authorization 1
  crsourcurr?: string; // currency code

  // Order Entry Specific
  invuniq?: number; // Order ID
  invdate?: number; // Invoice Date / e-Invoice Date and Time
  audttime?: number; // Audit Time / e-Invoice Time
  insourcurr?: string; // Currency
  inrate?: number; // Currency Exchange Rate
  invnetnotx?: number; // Total Excluding Tax
  invitaxtot?: number; // Total Tax Amount / Including Tax
  invnet?: number; // Total Net Amount
  invnetwtx?: number; // Total Payable Amount
  reference?: string; // Reference Number of Custom Form
  terms?: string; // Incoterms
  customerBRN?: string; // Customer BRN
  customerTIN?: string; // Customer TIN

  // Shared Financial Fields
  date?: number; // Document Date / Invoice Date
  currency?: string; // Currency Code
  rate?: number; // Currency Exchange Rate
  extended?: number; // Total Excluding Tax
  doctotal?: number; // Total Including Tax
  scamount?: number; // Total Payable Amount
  taxgroup?: string; // Tax Group Code

  // Details Collections
  purchaseCreditDebitNoteDetails?: PurchaseCreditDebitNoteDetail[];
  purchaseInvoiceDetails?: PurchaseInvoiceDetail[];
  orderCreditDebitDetails?: OrderCreditDebitDetail[];
  orderEntryDetails?: OrderEntryDetail[];
}

export interface OrderEntryDetail {
  tratE1: any;
  desc: string; // Description of Product or Service
  unitprice: number; // Unit Price
  trate1: number; // Tax Rate
  tamounT1: number; // Tax Amount
  extinvmisc: number; // Subtotal
  qtyshipped: number; // Quantity
  invunit: string; // Measurement
  discper: number; // Discount Rate
  invdisc: number; // Discount Amount
  invuniq: number; // Order ID
}

export interface PurchaseInvoiceDetail {
  invhseq: number; // Invoice Header Sequence
  invlrev: number; // Invoice Line Revision
  itemdesc: string; // Item Description
  unitcost: number; // Unit Cost
  extended: number; // Subtotal
  rqreceived: number; // Quantity Received
  rcpunit: string; // Measurement Unit
  taxratE1: number; // Tax Rate
  taxamounT1: number; // Tax Amount
  txexpsamT1: number; // Exempted Tax Amount
  discpct: number; // Discount Rate
  discount: number; // Discount Amount
}

export interface OrderCreditDebitDetail {
  crduniq: number; // Unique Identifier for Credit/Debit Note
  linenum: number; // Line Number
  item: string; // Item Code
  desc: string; // Item Description
  qtyreturn: number; // Quantity Returned
  unitprice: number; // Unit Price
  tamounT1: number; // Tax Amount 1
  tratE1: number; // Tax Rate 1
  extcrdmisc: number; // Subtotal (Extended Credit Misc)
  crdunit: string; // Unit of Measure (UOM)
}

export interface PurchaseCreditDebitNoteDetail {
  crnhseq: number; // Header Sequence Number
  crnlrev: number; // Header Sequence Number (Revision)
  crnlseq: number; // Line Sequence Number
  itemno: string; // Item Number
  itemdesc: string; // Item Description
  retunit: string; // Return Unit
  retconv: number; // Unit Conversion
  rqreturned: number; // Quantity Returned
  unitcost: number; // Unit Cost
  extended: number; // Extended Amount
  taxratE1: number; // Tax Rate
  taxamounT1: number; // Tax Amount
  txexpsamT1: number; // Exempted Tax Amount
}
