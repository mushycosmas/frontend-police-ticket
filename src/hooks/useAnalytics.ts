export const useAnalytics = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(defaultStats);

  useEffect(() => {
    loadTickets();
  }, []);

  return {
    tickets,
    stats,
    loading,
    weeklyData,
    statusChartData,
    priorityChartData,
    resolutionRate,
  };
};