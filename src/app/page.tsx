import { redirect } from 'next/navigation';

export default function RootPage() {
  // Default landing language
  redirect('/en');
}
