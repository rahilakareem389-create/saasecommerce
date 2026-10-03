const fs = require('fs');
const file = 'frontend/src/pages/AdminSales.jsx';
let data = fs.readFileSync(file, 'utf8');

data = data.replace(
  "import { cachedGet } from '../utils/apiCache';",
  "import { cachedGet, getCachedDataSync } from '../utils/apiCache';"
);

data = data.replace(
  "export default function AdminSales() {",
  `export default function AdminSales() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://saasecommerce-production.up.railway.app";
`
);

data = data.replace(
  `  const [data, setData] = useState({
    overview: { totalRevenue: 0, todaysSales: 0, weeklySales: 0, monthlySales: 0, totalSales: 0, productsSold: 0, discountGiven: 0, couponCount: 0 },
    chartData: [], chartDataDaily: [], chartDataWeekly: [], chartDataMonthly: [],
    categoryChartData: [],
    topProducts: []
  });`,
  `  const [data, setData] = useState(() => {
    return getCachedDataSync(backendUrl + '/api/sales') || {
      overview: { totalRevenue: 0, todaysSales: 0, weeklySales: 0, monthlySales: 0, totalSales: 0, productsSold: 0, discountGiven: 0, couponCount: 0 },
      chartData: [], chartDataDaily: [], chartDataWeekly: [], chartDataMonthly: [],
      categoryChartData: [],
      topProducts: []
    };
  });`
);

fs.writeFileSync(file, data);
console.log("Fixed AdminSales");
