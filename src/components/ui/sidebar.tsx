'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/users', label: 'Users' }, 
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-800 text-white p-4 flex flex-col">
      <h2 className="text-2xl font-bold mb-8">User Management</h2>
      <nav className="flex flex-col justify-between flex-1">
        <ul>
          {links.map(link => (
            <li key={link.href} className="mb-2">
              <Link href={link.href}>
                <span className={`block p-3 rounded-lg transition-colors ${pathname === link.href ? 'bg-gray-900' : 'hover:bg-gray-700'}`}>
                  {link.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
