import httpClient from '../httpService';

// Get Sales Invoices
export async function getSalesInvoices(params: any, options?: { [key: string]: any }) {
  return httpClient.get('/v1/InvoiceApi/sales-invoices', {
    params,
    ...options,
  });
}

// Get Credit/Debit Notes
export async function getCreditDebitNotes(params: any, options?: { [key: string]: any }) {
  return httpClient.get('/v1/InvoiceApi/credit-debit-notes', {
    params,
    ...options,
  });
}

// Get Purchase Invoices
export async function getPurchaseInvoices(params: any, options?: { [key: string]: any }) {
  return httpClient.get('/v1/InvoiceApi/purchase-invoices', {
    params,
    ...options,
  });
}

// Get Purchase Credit/Debit Notes
export async function getPurchaseCreditDebitNotes(params: any, options?: { [key: string]: any }) {
  return httpClient.get('/v1/InvoiceApi/purchase-credit-debit-notes', {
    params,
    ...options,
  });
}

// Get Invoice Types
export async function getInvoiceTypes(options?: { [key: string]: any }) {
  return httpClient.get('/v1/InvoiceApi/invoice-types', {
    ...options,
  });
}

// Submit Invoice
export async function submitInvoice(body: any, options?: { [key: string]: any }) {
  return httpClient.post('/v1/InvoiceApi/submit-invoice', body, {
    ...options,
  });
}

// Create Invoice
export async function createInvoice(body: any, options?: { [key: string]: any }) {
  return httpClient.post('/v1/InvoiceApi/create-invoice', body, {
    ...options,
  });
}

// Get Currency Codes
export async function getCurrencyCodes(options?: { [key: string]: any }) {
  return httpClient.get('/v1/InvoiceApi/currency-codes', {
    ...options,
  });
}

// Get Unit Types
export async function getUnitTypes(options?: { [key: string]: any }) {
  return httpClient.get('/v1/InvoiceApi/unit-types', {
    ...options,
  });
}

// Get Classification Codes
export async function getClassificationCodes(options?: { [key: string]: any }) {
  return httpClient.get('/v1/InvoiceApi/classification-codes', {
    ...options,
  });
}

// Get Msic Codes
export async function getMsicCodes(options?: { [key: string]: any }) {
  return httpClient.get('/v1/InvoiceApi/msic-codes', {
    ...options,
  });
}

// Get State Codes
export async function getStateCodes(options?: { [key: string]: any }) {
  return httpClient.get('/v1/InvoiceApi/state-codes', {
    ...options,
  });
}

// Get Recent Invoices
export async function getRecentInvoices(params: any, options?: { [key: string]: any }) {
  return httpClient.get('/v1/InvoiceApi/recent', {
    params,
    ...options,
  });
}

// Get Invoice Document Details
export async function getDocumentDetails(uuid: string, options?: { [key: string]: any }) {
  return httpClient.get(`/v1/InvoiceApi/${uuid}/details`, {
    ...options,
  });
}

// Generate invoice
export async function generateInvoice(uuid: string, options?: { [key: string]: any }) {
  return httpClient.get(`/invoice/${uuid}/generate-invoice`, {
    ...options,
  });
}

// Get Invoice Document By Uuid (from db)
export async function getInvoiceDocumentByUuId(uuid: string, options?: { [key: string]: any }) {
  return httpClient.get(`/v1/InvoiceApi/invoice-document/${uuid}`, {
    ...options,
  });
}

// Get Invoice Document List (from db)
export async function getInvoiceDocumentList(
  params: {
    pageNumber?: number;
    pageSize?: number;
    status?: boolean;
    uuid?: string;
    issueDateFrom?: string;
    issueDateTo?: string;
  },
  options?: { [key: string]: any },
) {
  return httpClient.get(`/v1/InvoiceApi/invoice-documents`, { params, ...options });
}
