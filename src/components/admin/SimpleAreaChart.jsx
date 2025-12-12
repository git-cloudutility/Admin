import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const SimpleAreaChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(174, 72%, 50%)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(174, 72%, 50%)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 47%, 16%)" />
        <XAxis dataKey="month" stroke="hsl(215, 20%, 55%)" />
        <YAxis stroke="hsl(215, 20%, 55%)" />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(222, 47%, 8%)',
            border: '1px solid hsl(222, 47%, 16%)',
            borderRadius: '8px',
          }}
        />
        <Area
          type="monotone"
          dataKey="applications"
          stroke="hsl(174, 72%, 50%)"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorApplications)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default SimpleAreaChart;
