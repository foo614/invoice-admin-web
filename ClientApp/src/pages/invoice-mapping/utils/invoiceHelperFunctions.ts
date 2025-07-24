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

export function getInvoiceTypeOptions(): { label: string; value: string }[] {
  const invoiceTypes: API.InvoiceType[] = [
    { code: '01', label: 'Invoice' },
    { code: '02', label: 'Credit Note' },
    { code: '03', label: 'Debit Note' },
    { code: '04', label: 'Refund Note' },
    { code: '11', label: 'Self-billed Invoice' },
    { code: '12', label: 'Self-billed Credit Note' },
    { code: '13', label: 'Self-billed Debit Note' },
    { code: '14', label: 'Self-billed Refund Note' },
  ];

  return invoiceTypes.map(({ code, label }) => ({
    label: `${code} - ${label}`,
    value: code,
  }));
}

export const formatAddress = (
  address1?: string,
  address2?: string,
  address3?: string,
  postalCode?: string,
  city?: string
): string => {
  const parts = [address1, address2, address3, postalCode, city]
    .filter((p) => p && p.trim().length > 0)
    .map((p) => p!.trim().replace(/,+$/, ''));

  return parts.join(', ');
}

export const normalizeDate = (value?: string) => {
  return value && dayjs(value).isValid() ? dayjs(value) : undefined;
};

export const fallbackIfEmpty = (input: string | undefined | null, fallback: string): string => {
  return input && input.trim() !== '' ? input : fallback;
}
