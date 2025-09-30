import { redirect } from 'next/navigation';

export default function NotFound() {
  // Redirect to the home page
  redirect('/');
}
