import {
  getCreditDebitNotes,
  getPurchaseCreditDebitNotes,
  getPurchaseInvoices,
  getSalesInvoices,
} from '@/services/ant-design-pro/invoiceService';
import { getUserProfile } from '@/services/ant-design-pro/profileService';
import { message } from 'antd';

interface FetchDataBasedOnInvoiceTypeParams {
  type: string;
  page?: number;
  pageSize?: number;
  searchParams?: Record<string, any>;
  setLoading: (loading: boolean) => void;
  setTableData: (data: { data: any[]; success: boolean; total: number }) => void;
}

export const fetchDataBasedOnInvoiceType = async ({
  type,
  page = 1,
  pageSize = 10,
  searchParams = {},
  setLoading,
  setTableData,
}: FetchDataBasedOnInvoiceTypeParams): Promise<any> => {
  setLoading(true);

  // eslint-disable-next-line @typescript-eslint/ban-types
  const fetchMap: { [key: string]: Function } = {
    '01': getSalesInvoices,
    '02': getCreditDebitNotes,
    '03': getCreditDebitNotes,
    '11': getPurchaseInvoices,
    '12': getPurchaseCreditDebitNotes,
    '13': getPurchaseCreditDebitNotes,
  };

  const fetchFunction = fetchMap[type];
  if (!fetchFunction) {
    message.warning('Invalid invoice type selected.');
    setLoading(false);
    return;
  }

  try {
    const response = await fetchFunction({ page, pageSize, ...searchParams });
    console.log('API Response:', response.data);
    setTableData({
      data: response.data?.data || [],
      success: true,
      total: response.data?.totalItems || 0,
    });
    return {
      data: response.data?.data || [],
      success: true,
      total: response.data?.totalItems || 0,
    }
  } catch (error) {
    console.error('Fetch Error:', error);
    message.error('Failed to fetch data for the selected invoice type.');
    setTableData({ data: [], success: false, total: 0 });
    return {
      data: [],
      success: false,
      total: 0,
    }
  } finally {
    setLoading(false);
  }
};

export const fetchUserProfile = async (
  email: string,
  setProfileData: (data: API.ProfileItem) => void,
  setLoading: (loading: boolean) => void,
): Promise<void> => {
  setLoading(true);
  try {
    const response = await getUserProfile({ email });
    setProfileData(response.data.data);
  } catch (error) {
    console.error('Profile Fetch Error:', error);
    message.error('Failed to fetch user profile');
  } finally {
    setLoading(false);
  }
};
