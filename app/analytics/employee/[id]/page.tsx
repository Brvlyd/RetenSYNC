import EmployeeAnalyticsClient from './EmployeeAnalyticsClient';

export default function EmployeeAnalyticsPage({ params }: { params: { id: string } }) {
  return <EmployeeAnalyticsClient id={params.id} />;
}

export async function generateStaticParams() {
  // Replace with real data or fetch from your database/API
  const employeeIds = ['1', '2', '3'];
  return employeeIds.map(id => ({ id }));
}