import { useEffect, useState } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatsCard } from '@/components/admin/StatsCard';
import { apiService } from '@/services/api';
import { Users, FileUser, FolderKanban, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
// } from 'recharts';

// const COLORS = ['hsl(174, 72%, 50%)', 'hsl(262, 83%, 58%)', 'hsl(38, 92%, 50%)', 'hsl(142, 76%, 45%)', 'hsl(0, 84%, 60%)', 'hsl(200, 70%, 50%)'];

const statusColors = {
  pending: 'bg-warning/20 text-warning border-warning/30',
  approved: 'bg-success/20 text-success border-success/30',
  rejected: 'bg-destructive/20 text-destructive border-destructive/30',
  interview: 'bg-primary/20 text-primary border-primary/30',
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-100%">
      <AdminHeader title="Dashboard" subtitle="Welcome back! Here's an overview of your platform." />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Applicants"
            value={stats.totalApplicants}
            change={`+${stats.monthlyGrowth}% this month`}
            changeType="positive"
            icon={FileUser}
            gradient="primary"
          />
          <StatsCard
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            change="+12.3% this month"
            changeType="positive"
            icon={Users}
            gradient="purple"
          />
          <StatsCard
            title="Active Projects"
            value={stats.activeProjects}
            change="2 completed"
            changeType="neutral"
            icon={FolderKanban}
            gradient="orange"
          />
          <StatsCard
            title="Pending Applications"
            value={stats.pendingApplications}
            change="Needs review"
            changeType="neutral"
            icon={Clock}
            gradient="green"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Area Chart */}
          {/* <Card className="lg:col-span-2 glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Application Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={stats.monthlyApplications}>
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
            </CardContent>
          </Card> */}

          {/* Pie Chart */}
          {/* <Card className="glass-card">
            <CardHeader>
              <CardTitle>Domain Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={stats.domainStats}
                    dataKey="count"
                    nameKey="domain"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={50}
                  >
                    {stats.domainStats.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(222, 47%, 8%)',
                      border: '1px solid hsl(222, 47%, 16%)',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {stats.domainStats.slice(0, 4).map((item, index) => (
                  <div key={item.domain} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index] }}
                      />
                      <span className="text-muted-foreground truncate">{item.domain}</span>
                    </div>
                    <span className="font-medium">{item.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card> */}
        </div>

        {/* Recent Applications */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentApplicants.map((applicant) => (
                <div
                  key={applicant.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-medium">
                      {applicant.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{applicant.name}</p>
                      <p className="text-sm text-muted-foreground">{applicant.specialization}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground hidden sm:block">
                      {applicant.college}
                    </span>
                    <Badge variant="outline" className={statusColors[applicant.status]}>
                      {applicant.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
