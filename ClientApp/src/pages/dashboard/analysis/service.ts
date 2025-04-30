import type { AnalysisData } from './data';

export async function fakeChartData(): Promise<{ data: AnalysisData }> {
  return {
    data: {
      visitData: [
        {
          x: '2024-11-24',
          y: 7,
        },
        {
          x: '2024-11-25',
          y: 5,
        },
        {
          x: '2024-11-26',
          y: 4,
        },
        {
          x: '2024-11-27',
          y: 2,
        },
        {
          x: '2024-11-28',
          y: 4,
        },
        {
          x: '2024-11-29',
          y: 7,
        },
        {
          x: '2024-11-30',
          y: 5,
        },
        {
          x: '2024-12-01',
          y: 6,
        },
        {
          x: '2024-12-02',
          y: 5,
        },
        {
          x: '2024-12-03',
          y: 9,
        },
        {
          x: '2024-12-04',
          y: 6,
        },
        {
          x: '2024-12-05',
          y: 3,
        },
        {
          x: '2024-12-06',
          y: 1,
        },
        {
          x: '2024-12-07',
          y: 5,
        },
        {
          x: '2024-12-08',
          y: 3,
        },
        {
          x: '2024-12-09',
          y: 6,
        },
        {
          x: '2024-12-10',
          y: 5,
        },
      ],
      visitData2: [
        {
          x: '2024-11-24',
          y: 1,
        },
        {
          x: '2024-11-25',
          y: 6,
        },
        {
          x: '2024-11-26',
          y: 4,
        },
        {
          x: '2024-11-27',
          y: 8,
        },
        {
          x: '2024-11-28',
          y: 3,
        },
        {
          x: '2024-11-29',
          y: 7,
        },
        {
          x: '2024-11-30',
          y: 2,
        },
      ],
      salesData: [
        {
          x: '1月',
          y: 962,
        },
        {
          x: '2月',
          y: 329,
        },
        {
          x: '3月',
          y: 736,
        },
        {
          x: '4月',
          y: 439,
        },
        {
          x: '5月',
          y: 969,
        },
        {
          x: '6月',
          y: 478,
        },
        {
          x: '7月',
          y: 1009,
        },
        {
          x: '8月',
          y: 545,
        },
        {
          x: '9月',
          y: 836,
        },
        {
          x: '10月',
          y: 1095,
        },
        {
          x: '11月',
          y: 509,
        },
        {
          x: '12月',
          y: 275,
        },
      ],
      searchData: [
        {
          index: 1,
          keyword: '搜索关键词-0',
          count: 497,
          range: 86,
          status: 1,
        },
        {
          index: 2,
          keyword: '搜索关键词-1',
          count: 855,
          range: 90,
          status: 1,
        },
        {
          index: 3,
          keyword: '搜索关键词-2',
          count: 848,
          range: 32,
          status: 0,
        },
        {
          index: 4,
          keyword: '搜索关键词-3',
          count: 154,
          range: 51,
          status: 1,
        },
        {
          index: 5,
          keyword: '搜索关键词-4',
          count: 810,
          range: 1,
          status: 1,
        },
        {
          index: 6,
          keyword: '搜索关键词-5',
          count: 789,
          range: 19,
          status: 0,
        },
        {
          index: 7,
          keyword: '搜索关键词-6',
          count: 534,
          range: 61,
          status: 1,
        },
        {
          index: 8,
          keyword: '搜索关键词-7',
          count: 673,
          range: 93,
          status: 0,
        },
        {
          index: 9,
          keyword: '搜索关键词-8',
          count: 211,
          range: 77,
          status: 0,
        },
        {
          index: 10,
          keyword: '搜索关键词-9',
          count: 389,
          range: 73,
          status: 1,
        },
        {
          index: 11,
          keyword: '搜索关键词-10',
          count: 272,
          range: 20,
          status: 1,
        },
        {
          index: 12,
          keyword: '搜索关键词-11',
          count: 568,
          range: 6,
          status: 0,
        },
        {
          index: 13,
          keyword: '搜索关键词-12',
          count: 248,
          range: 68,
          status: 1,
        },
        {
          index: 14,
          keyword: '搜索关键词-13',
          count: 268,
          range: 42,
          status: 0,
        },
        {
          index: 15,
          keyword: '搜索关键词-14',
          count: 993,
          range: 92,
          status: 0,
        },
        {
          index: 16,
          keyword: '搜索关键词-15',
          count: 572,
          range: 13,
          status: 1,
        },
        {
          index: 17,
          keyword: '搜索关键词-16',
          count: 279,
          range: 28,
          status: 0,
        },
        {
          index: 18,
          keyword: '搜索关键词-17',
          count: 872,
          range: 47,
          status: 0,
        },
        {
          index: 19,
          keyword: '搜索关键词-18',
          count: 391,
          range: 37,
          status: 0,
        },
        {
          index: 20,
          keyword: '搜索关键词-19',
          count: 869,
          range: 97,
          status: 0,
        },
        {
          index: 21,
          keyword: '搜索关键词-20',
          count: 156,
          range: 38,
          status: 0,
        },
        {
          index: 22,
          keyword: '搜索关键词-21',
          count: 761,
          range: 66,
          status: 0,
        },
        {
          index: 23,
          keyword: '搜索关键词-22',
          count: 806,
          range: 84,
          status: 1,
        },
        {
          index: 24,
          keyword: '搜索关键词-23',
          count: 675,
          range: 39,
          status: 1,
        },
        {
          index: 25,
          keyword: '搜索关键词-24',
          count: 122,
          range: 42,
          status: 1,
        },
        {
          index: 26,
          keyword: '搜索关键词-25',
          count: 57,
          range: 11,
          status: 1,
        },
        {
          index: 27,
          keyword: '搜索关键词-26',
          count: 976,
          range: 15,
          status: 0,
        },
        {
          index: 28,
          keyword: '搜索关键词-27',
          count: 632,
          range: 65,
          status: 1,
        },
        {
          index: 29,
          keyword: '搜索关键词-28',
          count: 425,
          range: 43,
          status: 0,
        },
        {
          index: 30,
          keyword: '搜索关键词-29',
          count: 812,
          range: 31,
          status: 0,
        },
        {
          index: 31,
          keyword: '搜索关键词-30',
          count: 963,
          range: 1,
          status: 0,
        },
        {
          index: 32,
          keyword: '搜索关键词-31',
          count: 44,
          range: 6,
          status: 0,
        },
        {
          index: 33,
          keyword: '搜索关键词-32',
          count: 658,
          range: 52,
          status: 0,
        },
        {
          index: 34,
          keyword: '搜索关键词-33',
          count: 984,
          range: 64,
          status: 0,
        },
        {
          index: 35,
          keyword: '搜索关键词-34',
          count: 120,
          range: 26,
          status: 1,
        },
        {
          index: 36,
          keyword: '搜索关键词-35',
          count: 804,
          range: 10,
          status: 1,
        },
        {
          index: 37,
          keyword: '搜索关键词-36',
          count: 972,
          range: 25,
          status: 1,
        },
        {
          index: 38,
          keyword: '搜索关键词-37',
          count: 991,
          range: 60,
          status: 0,
        },
        {
          index: 39,
          keyword: '搜索关键词-38',
          count: 428,
          range: 8,
          status: 0,
        },
        {
          index: 40,
          keyword: '搜索关键词-39',
          count: 846,
          range: 96,
          status: 0,
        },
        {
          index: 41,
          keyword: '搜索关键词-40',
          count: 154,
          range: 85,
          status: 0,
        },
        {
          index: 42,
          keyword: '搜索关键词-41',
          count: 752,
          range: 16,
          status: 1,
        },
        {
          index: 43,
          keyword: '搜索关键词-42',
          count: 709,
          range: 70,
          status: 1,
        },
        {
          index: 44,
          keyword: '搜索关键词-43',
          count: 608,
          range: 25,
          status: 1,
        },
        {
          index: 45,
          keyword: '搜索关键词-44',
          count: 515,
          range: 21,
          status: 1,
        },
        {
          index: 46,
          keyword: '搜索关键词-45',
          count: 382,
          range: 48,
          status: 0,
        },
        {
          index: 47,
          keyword: '搜索关键词-46',
          count: 583,
          range: 98,
          status: 1,
        },
        {
          index: 48,
          keyword: '搜索关键词-47',
          count: 336,
          range: 91,
          status: 0,
        },
        {
          index: 49,
          keyword: '搜索关键词-48',
          count: 817,
          range: 43,
          status: 1,
        },
        {
          index: 50,
          keyword: '搜索关键词-49',
          count: 746,
          range: 12,
          status: 1,
        },
      ],
      offlineData: [
        {
          name: 'Stores 0',
          cvr: 0.9,
        },
        {
          name: 'Stores 1',
          cvr: 0.5,
        },
        {
          name: 'Stores 2',
          cvr: 0.4,
        },
        {
          name: 'Stores 3',
          cvr: 0.9,
        },
        {
          name: 'Stores 4',
          cvr: 0.4,
        },
        {
          name: 'Stores 5',
          cvr: 0.3,
        },
        {
          name: 'Stores 6',
          cvr: 0.9,
        },
        {
          name: 'Stores 7',
          cvr: 0.1,
        },
        {
          name: 'Stores 8',
          cvr: 0.3,
        },
        {
          name: 'Stores 9',
          cvr: 0.4,
        },
      ],
      offlineChartData: [
        {
          date: '22:58',
          type: '客流量',
          value: 57,
        },
        {
          date: '22:58',
          type: '支付笔数',
          value: 99,
        },
        {
          date: '23:28',
          type: '客流量',
          value: 34,
        },
        {
          date: '23:28',
          type: '支付笔数',
          value: 33,
        },
        {
          date: '23:58',
          type: '客流量',
          value: 77,
        },
        {
          date: '23:58',
          type: '支付笔数',
          value: 26,
        },
        {
          date: '00:28',
          type: '客流量',
          value: 85,
        },
        {
          date: '00:28',
          type: '支付笔数',
          value: 71,
        },
        {
          date: '00:58',
          type: '客流量',
          value: 101,
        },
        {
          date: '00:58',
          type: '支付笔数',
          value: 84,
        },
        {
          date: '01:28',
          type: '客流量',
          value: 33,
        },
        {
          date: '01:28',
          type: '支付笔数',
          value: 16,
        },
        {
          date: '01:58',
          type: '客流量',
          value: 76,
        },
        {
          date: '01:58',
          type: '支付笔数',
          value: 70,
        },
        {
          date: '02:28',
          type: '客流量',
          value: 101,
        },
        {
          date: '02:28',
          type: '支付笔数',
          value: 80,
        },
        {
          date: '02:58',
          type: '客流量',
          value: 79,
        },
        {
          date: '02:58',
          type: '支付笔数',
          value: 86,
        },
        {
          date: '03:28',
          type: '客流量',
          value: 37,
        },
        {
          date: '03:28',
          type: '支付笔数',
          value: 99,
        },
        {
          date: '03:58',
          type: '客流量',
          value: 69,
        },
        {
          date: '03:58',
          type: '支付笔数',
          value: 18,
        },
        {
          date: '04:28',
          type: '客流量',
          value: 25,
        },
        {
          date: '04:28',
          type: '支付笔数',
          value: 44,
        },
        {
          date: '04:58',
          type: '客流量',
          value: 49,
        },
        {
          date: '04:58',
          type: '支付笔数',
          value: 46,
        },
        {
          date: '05:28',
          type: '客流量',
          value: 79,
        },
        {
          date: '05:28',
          type: '支付笔数',
          value: 50,
        },
        {
          date: '05:58',
          type: '客流量',
          value: 29,
        },
        {
          date: '05:58',
          type: '支付笔数',
          value: 54,
        },
        {
          date: '06:28',
          type: '客流量',
          value: 57,
        },
        {
          date: '06:28',
          type: '支付笔数',
          value: 45,
        },
        {
          date: '06:58',
          type: '客流量',
          value: 109,
        },
        {
          date: '06:58',
          type: '支付笔数',
          value: 38,
        },
        {
          date: '07:28',
          type: '客流量',
          value: 32,
        },
        {
          date: '07:28',
          type: '支付笔数',
          value: 27,
        },
        {
          date: '07:58',
          type: '客流量',
          value: 48,
        },
        {
          date: '07:58',
          type: '支付笔数',
          value: 93,
        },
        {
          date: '08:28',
          type: '客流量',
          value: 34,
        },
        {
          date: '08:28',
          type: '支付笔数',
          value: 107,
        },
      ],
      salesTypeData: [
        {
          x: '家用电器',
          y: 4544,
        },
        {
          x: '食用酒水',
          y: 3321,
        },
        {
          x: '个护健康',
          y: 3113,
        },
        {
          x: '服饰箱包',
          y: 2341,
        },
        {
          x: '母婴产品',
          y: 1231,
        },
        {
          x: '其他',
          y: 1231,
        },
      ],
      salesTypeDataOnline: [
        {
          x: '家用电器',
          y: 244,
        },
        {
          x: '食用酒水',
          y: 321,
        },
        {
          x: '个护健康',
          y: 311,
        },
        {
          x: '服饰箱包',
          y: 41,
        },
        {
          x: '母婴产品',
          y: 121,
        },
        {
          x: '其他',
          y: 111,
        },
      ],
      salesTypeDataOffline: [
        {
          x: '家用电器',
          y: 99,
        },
        {
          x: '食用酒水',
          y: 188,
        },
        {
          x: '个护健康',
          y: 344,
        },
        {
          x: '服饰箱包',
          y: 255,
        },
        {
          x: '其他',
          y: 65,
        },
      ],
      radarData: [
        {
          name: '个人',
          label: '引用',
          value: 10,
        },
        {
          name: '个人',
          label: '口碑',
          value: 8,
        },
        {
          name: '个人',
          label: '产量',
          value: 4,
        },
        {
          name: '个人',
          label: '贡献',
          value: 5,
        },
        {
          name: '个人',
          label: '热度',
          value: 7,
        },
        {
          name: '团队',
          label: '引用',
          value: 3,
        },
        {
          name: '团队',
          label: '口碑',
          value: 9,
        },
        {
          name: '团队',
          label: '产量',
          value: 6,
        },
        {
          name: '团队',
          label: '贡献',
          value: 3,
        },
        {
          name: '团队',
          label: '热度',
          value: 1,
        },
        {
          name: '部门',
          label: '引用',
          value: 4,
        },
        {
          name: '部门',
          label: '口碑',
          value: 1,
        },
        {
          name: '部门',
          label: '产量',
          value: 6,
        },
        {
          name: '部门',
          label: '贡献',
          value: 5,
        },
        {
          name: '部门',
          label: '热度',
          value: 7,
        },
      ],
      invoiceSubmissionRateData: [
        {
          label: 'Pending',
          value: 165,
        },
        {
          label: 'Submitted',
          value: 178,
        },
      ],
      lhdnSubmissionStatusData: [
        {
          label: 'Success',
          value: 148,
        },
        {
          label: 'Failed',
          value: 168,
        },
        {
          label: 'Pending',
          value: 127,
        },
      ],
    },
  };
}
