import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirect to default language (English)
  redirect('/en');
}
