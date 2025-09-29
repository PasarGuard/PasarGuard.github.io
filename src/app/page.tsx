import { redirect } from 'next/navigation';

export default function RootPage() {
  // For static export, redirect to English by default
  redirect('/en');
}
