import { Pie } from '@ant-design/plots';
import { Card, DatePicker } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker/generatePicker';
import type dayjs from 'dayjs';
import numeral from 'numeral';
import React from 'react';
import type { DataItem } from '../data.d';
import useStyles from '../style.style';

const { RangePicker } = DatePicker;

const ProportionSales = ({
  rangePickerValue,
  loading,
  salesPieData,
  handleRangePickerChange,
  title,
}: {
  rangePickerValue: RangePickerProps<dayjs.Dayjs>['value'];
  loading: boolean;
  salesPieData: DataItem[];
  handleRangePickerChange: RangePickerProps<dayjs.Dayjs>['onChange'];
  title: string;
}) => {
  const { styles } = useStyles();
  return (
    <Card
      loading={loading}
      className={styles.salesCard}
      bordered={false}
      title={title}
      style={{
        height: '100%',
      }}
      extra={
        <div className={styles.salesCardExtra}>
          <RangePicker value={rangePickerValue} onChange={handleRangePickerChange} />
        </div>
      }
    >
      <div>
        <Pie
          height={340}
          radius={0.8}
          innerRadius={0.5}
          angleField="y"
          colorField="x"
          data={salesPieData as any}
          legend={false}
          label={{
            position: 'spider',
            text: (item: { x: number; y: number }) => {
              return `${item.x}: ${numeral(item.y).format('0,0')}`;
            },
          }}
        />
      </div>
    </Card>
  );
};
export default ProportionSales;
