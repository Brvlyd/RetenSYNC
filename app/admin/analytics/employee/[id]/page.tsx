import EmployeeAnalyticsClient from './EmployeeAnalyticsClient';

export default function Page({ params }: { params: { id: string } }) {
  return <EmployeeAnalyticsClient id={params.id} />;
}