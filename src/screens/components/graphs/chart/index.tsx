import { BarChart } from '@mui/x-charts';
import React from 'react';
import { salaryRange } from '../../constants/salaryrange';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint } from '@fortawesome/free-solid-svg-icons';

type Props = {
  chartdata: string[]; // Assuming chartdata is an array of numbers representing salaries
};

const categorizeSalary = (salary: number): string => {
  if (salary < 15000) return 'Below 15K';
  if (salary <= 35000) return '15K-35K';
  if (salary <= 50000) return '35K-50K';
  if (salary <= 100000) return '50K-100K';
  if (salary <= 200000) return '100K-200K';
  if (salary <= 500000) return '250K-500K';
  if (salary <= 1000000) return '500K-1M';
  return 'Above 1M';
};

const processChartData = (chartdata: string[]): number[] => {
  const categorizedData = salaryRange.map(() => 0);

  chartdata.forEach((salary) => {
    const convertsalary = parseInt(salary)
    const category = categorizeSalary(convertsalary);
    const index = salaryRange.indexOf(category);
    categorizedData[index]++;
  });

  return categorizedData;
};

const BoxChart = ({ chartdata }: Props) => {
  const processedData = processChartData(chartdata);

  const handlePrint = () => {
    window.print();
  };


  return (
    <div className='chart-container'>
      <h1>Alumni Income Per Bracket</h1>
      <div className='print-button' onClick={handlePrint}>
        <FontAwesomeIcon icon={faPrint} />
        <span>Print Analytics</span>
      </div>
      <BarChart
        xAxis={[{ scaleType: 'band', data: salaryRange }]}
        width={750}
        height={250}
        slotProps={{
          legend: {
            direction: 'row',
            position: { vertical: 'bottom', horizontal: 'middle' },
          },
        }}
        series={[
          { data: processedData, color: '#2F5288'},
        ]}
      />
    </div>
  );
};

export default BoxChart;
