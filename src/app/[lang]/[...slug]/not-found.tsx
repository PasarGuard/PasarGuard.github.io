import { redirect } from 'next/navigation';

export default function NotFound() {
  // Redirect to the home page for the current language
  redirect('/');
}
