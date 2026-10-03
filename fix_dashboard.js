const fs = require('fs');
const file = 'frontend/src/pages/AdminDashboard.jsx';
let data = fs.readFileSync(file, 'utf8');

data = data.replace(
  "import { cachedGet } from '../utils/apiCache';",
  "import { cachedGet, getCachedDataSync } from '../utils/apiCache';"
);

data = data.replace(
  "export default function AdminDashboard() {",
  `export default function AdminDashboard() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://saasecommerce-production.up.railway.app";
`
);

data = data.replace(
  `  const [data, setData] = useState({
    kpis: { totalRevenue: 0, newCustomers: 0, activeOrders: 0, conversionRate: '0%' },
    charts: { revenue: [], visitors: [], ordersOverviewData: [], categoryChartData: [] },
    lists: { recentOrders: [], topProducts: [], customerAlerts: [] }
  });`,
  `  const [data, setData] = useState(() => {
    return getCachedDataSync(backendUrl + '/api/dashboard') || {
      kpis: { totalRevenue: 0, newCustomers: 0, activeOrders: 0, conversionRate: '0%' },
      charts: { revenue: [], visitors: [], ordersOverviewData: [], categoryChartData: [] },
      lists: { recentOrders: [], topProducts: [], customerAlerts: [] }
    };
  });`
);

fs.writeFileSync(file, data);
console.log("Fixed AdminDashboard");
