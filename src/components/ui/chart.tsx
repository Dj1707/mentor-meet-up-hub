
import React from "react";
import {
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts";

interface ChartProps {
  data: any;
  options?: any;
}

export const BarChart: React.FC<ChartProps> = ({ data, options = {} }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart
        data={data.datasets[0].data.map((value: number, index: number) => ({
          name: data.labels[index],
          value,
        }))}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="value"
          name={data.datasets[0].label}
          fill={data.datasets[0].backgroundColor || data.datasets[0].borderColor || "#8884d8"}
        />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export const LineChart: React.FC<ChartProps> = ({ data, options = {} }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart
        data={data.labels.map((label: string, index: number) => {
          const dataPoint: { [key: string]: any } = { name: label };
          data.datasets.forEach((dataset: any, datasetIndex: number) => {
            dataPoint[`dataset${datasetIndex}`] = dataset.data[index];
          });
          return dataPoint;
        })}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {data.datasets.map((dataset: any, index: number) => (
          <Line
            key={index}
            type="monotone"
            dataKey={`dataset${index}`}
            name={dataset.label}
            stroke={dataset.borderColor || `#${Math.floor(Math.random() * 16777215).toString(16)}`}
            activeDot={{ r: 8 }}
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export const PieChart: React.FC<ChartProps> = ({ data, options = {} }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#8DD1E1'];
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart>
        <Pie
          data={data.datasets[0].data.map((value: number, index: number) => ({
            name: data.labels[index],
            value,
          }))}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.datasets[0].data.map((entry: any, index: number) => (
            <Cell 
              key={`cell-${index}`} 
              fill={data.datasets[0].backgroundColor?.[index] || COLORS[index % COLORS.length]} 
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};
