/**
 * @file page.tsx (Root)
 * @description Root page that redirects to the map page
 */

import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/map');
}
