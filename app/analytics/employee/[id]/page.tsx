import EmployeeAnalyticsClient from './EmployeeAnalyticsClient';

// Define which employee IDs to statically export
export async function generateStaticParams() {
  // Replace these with your real employee IDs or fetch from your DB/source
  return [{ id: '1' }, { id: '2' }, { id: '3' }];
}

export default function Page({ params }: { params: { id: string } }) {
  return <EmployeeAnalyticsClient id={params.id} />;
}