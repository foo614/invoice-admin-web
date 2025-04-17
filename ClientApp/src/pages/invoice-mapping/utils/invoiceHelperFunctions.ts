import dayjs from 'dayjs';
import { InvoiceData } from './invoiceData';

export const calculateDueDate = (terms?: string, invdate?: string) => {
  if (!terms || !invdate) {
    return null;
  }
  const date = dayjs(invdate, 'YYYYMMDD');
  const amount = terms.endsWith('D')
    ? date.add(parseInt(terms.replace('D', ''), 10), 'day')
    : terms.endsWith('M')
      ? date.add(parseInt(terms.replace('M', ''), 10), 'month')
      : null;
  if (!amount) throw new Error('Invalid payment terms format.');
  return amount;
};

export const calculateTotalInvoiceValue = (
  selectedRows: InvoiceData[],
  invoiceType: string,
): number => {
  return selectedRows.reduce((sum, item) => {
    switch (invoiceType) {
      case '01':
        return sum + (item.invnetwtx ?? 0); // Handle Sales Invoice
      case '02':
      case '03':
        return sum + (item.crdnetwtx ?? 0); // credit/debit note
      case '11':
      case '12':
      case '13':
        return sum + (item.scamount ?? 0); // Handle Self-Billed Invoice
      default:
        return sum + (item.invnetwtx ?? 0);
    }
  }, 0);
};
