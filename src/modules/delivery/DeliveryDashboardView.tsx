import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  Clock,
  TrendingUp,
  Phone,
  Bike,
  Star,
  DollarSign,
  Bell,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DeliveryDashboardView = () => {
  // Mock delivery person data
  const deliveryPerson = {
    name: "Ko Zaw Zaw",
    phone: "+95 9123456789",
    email: "zawzaw@delivery.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ZawZaw",
    rating: 4.8,
    totalDeliveries: 156,
    completedToday: 8,
    earnings: 45000,
    vehicleType: "Bicycle",
  };

  // Stats data
  const stats = {
    newOrders: 2,
    inProgress: 2,
  };

  // Performance chart data
  const performanceData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Deliveries",
        data: [12, 15, 18, 14, 20, 22, 8],
        borderColor: "rgb(249, 115, 22)",
        backgroundColor: "rgba(249, 115, 22, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 5,
        },
      },
    },
  };

  return (
    <div className="space-y-4 md:space-y-6 w-full">
      {/* Header with Profile */}
      <Card className="bg-linear-to-r from-orange-500 to-pink-500 text-white">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 md:gap-4">
              <Avatar className="h-16 w-16 md:h-20 md:w-20 border-4 border-white">
                <AvatarImage src={deliveryPerson.avatar} alt={deliveryPerson.name} />
                <AvatarFallback>{deliveryPerson.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl md:text-2xl font-bold">{deliveryPerson.name}</h2>
                <div className="flex items-center gap-2 text-sm md:text-base mt-1">
                  <Phone className="w-4 h-4" />
                  {deliveryPerson.phone}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Bike className="w-4 h-4" />
                  <span className="text-sm">{deliveryPerson.vehicleType}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 md:gap-4 w-full md:w-auto">
              <div className="flex-1 md:flex-initial text-center bg-white/20 rounded-lg p-3">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg md:text-xl font-bold">{deliveryPerson.rating}</span>
                </div>
                <div className="text-xs">Rating</div>
              </div>
              <div className="flex-1 md:flex-initial text-center bg-white/20 rounded-lg p-3">
                <div className="text-lg md:text-xl font-bold">{deliveryPerson.totalDeliveries}</div>
                <div className="text-xs">Total</div>
              </div>
              <div className="flex-1 md:flex-initial text-center bg-white/20 rounded-lg p-3">
                <div className="text-lg md:text-xl font-bold">{deliveryPerson.completedToday}</div>
                <div className="text-xs">Today</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 md:p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Bell className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <div className="text-xl md:text-2xl font-bold">{stats.newOrders}</div>
                <div className="text-xs md:text-sm text-muted-foreground">New Orders</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 md:p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <Clock className="w-5 h-5 md:w-6 md:h-6 text-orange-600 dark:text-orange-300" />
              </div>
              <div>
                <div className="text-xl md:text-2xl font-bold">{stats.inProgress}</div>
                <div className="text-xs md:text-sm text-muted-foreground">In Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 md:p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-600 dark:text-green-300" />
              </div>
              <div>
                <div className="text-xl md:text-2xl font-bold">{deliveryPerson.completedToday}</div>
                <div className="text-xs md:text-sm text-muted-foreground">Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 md:p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-purple-600 dark:text-purple-300" />
              </div>
              <div>
                <div className="text-xl md:text-2xl font-bold">{deliveryPerson.earnings.toLocaleString()}</div>
                <div className="text-xs md:text-sm text-muted-foreground">MMK Today</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <TrendingUp className="w-5 h-5" />
            Weekly Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 md:h-64">
            <Line data={performanceData} options={chartOptions} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliveryDashboardView;
