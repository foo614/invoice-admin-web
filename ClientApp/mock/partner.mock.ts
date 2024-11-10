import dayjs from 'dayjs';
import { Request, Response } from 'express';
import { parse } from 'url';

const genPartnerList = (current: number, pageSize: number) => {
  const partnerListDataSource: API.PartnerListItem[] = [];

  for (let i = 0; i < pageSize; i += 1) {
    const index = (current - 1) * 10 + i;
    partnerListDataSource.push({
      key: index,
      name: `Partner ${index}`,
      status: i % 2 === 0 ? 'active' : 'inactive',
      submissionCount: Math.floor(Math.random() * 1000),
      maxSubmissions: 1000,
      companyInfo: {
        companyName: `Company ${index}`,
        address: `Address ${index}`,
        phone: `+12345678${index}`,
        email: `contact${index}@company.com`,
      },
      createdAt: dayjs().format('YYYY-MM-DD'),
      updatedAt: dayjs().format('YYYY-MM-DD'),
    });
  }
  partnerListDataSource.reverse();
  return partnerListDataSource;
};

let partnerListDataSource = genPartnerList(1, 100);

function getPartners(req: Request, res: Response, u: string) {
  let realUrl = u;
  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }
  const { current = 1, pageSize = 10 } = req.query;
  const params = parse(realUrl, true).query as unknown as API.PageParams &
    API.PartnerListItem & {
      sorter: any;
      filter: any;
    };

  let dataSource = [...partnerListDataSource].slice(
    ((current as number) - 1) * (pageSize as number),
    (current as number) * (pageSize as number),
  );

  if (params.sorter) {
    const sorter = JSON.parse(params.sorter);
    dataSource = dataSource.sort((prev, next) => {
      let sortNumber = 0;
      (Object.keys(sorter) as Array<keyof API.PartnerListItem>).forEach((key) => {
        let nextSort = next?.[key] as number;
        let preSort = prev?.[key] as number;
        if (sorter[key] === 'descend') {
          sortNumber += preSort - nextSort > 0 ? -1 : 1;
          return;
        }
        sortNumber += preSort - nextSort > 0 ? 1 : -1;
      });
      return sortNumber;
    });
  }

  if (params.filter) {
    const filter = JSON.parse(params.filter as any) as {
      [key: string]: string[];
    };
    if (Object.keys(filter).length > 0) {
      dataSource = dataSource.filter((item) => {
        return (Object.keys(filter) as Array<keyof API.PartnerListItem>).some((key) => {
          if (!filter[key]) return true;
          if (filter[key].includes(`${item[key]}`)) return true;
          return false;
        });
      });
    }
  }

  if (params.name) {
    dataSource = dataSource.filter((data) => data?.name?.includes(params.name || ''));
  }

  const result = {
    data: dataSource,
    total: partnerListDataSource.length,
    success: true,
    pageSize,
    current: parseInt(`${params.current}`, 10) || 1,
  };

  return res.json(result);
}

function postPartner(req: Request, res: Response, u: string, b: Request) {
  let realUrl = u;
  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }

  const body = (b && b.body) || req.body;
  const { method, name, status, maxSubmissions, key } = body;

  switch (method) {
    case 'delete':
      partnerListDataSource = partnerListDataSource.filter((item) => key.indexOf(item.key) === -1);
      break;
    case 'post':
      (() => {
        const newKey = Math.ceil(Math.random() * 10000);
        const newPartner: API.PartnerListItem = {
          key: newKey,
          name,
          status: status || 'active',
          submissionCount: 0,
          maxSubmissions: maxSubmissions || 1000,
          companyInfo: {
            companyName: `New Company ${newKey}`,
            address: `New Address ${newKey}`,
            phone: `+12345678${newKey}`,
            email: `contact${newKey}@company.com`,
          },
          createdAt: dayjs().format('YYYY-MM-DD'),
          updatedAt: dayjs().format('YYYY-MM-DD'),
        };
        partnerListDataSource.unshift(newPartner);
        return res.json(newPartner);
      })();
      return;

    case 'update':
      (() => {
        let updatedPartner = {};
        partnerListDataSource = partnerListDataSource.map((item) => {
          if (item.key === key) {
            updatedPartner = { ...item, name, status, maxSubmissions };
            return { ...item, name, status, maxSubmissions };
          }
          return item;
        });
        return res.json(updatedPartner);
      })();
      return;
    default:
      break;
  }

  const result = {
    list: partnerListDataSource,
    pagination: {
      total: partnerListDataSource.length,
    },
  };

  res.json(result);
}

export default {
  'GET /api/partners': getPartners,
  'POST /api/partners': postPartner,
};
