import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-slate-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 font-bold text-xl">
              <Link href="/">
                HorseBook Pro
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-700">Dashboard</Link>
                <Link href="/bets" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-700">Bet Entry</Link>
                <Link href="/clients" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-700">Clients Master</Link>
                <Link href="/races" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-700">Races & Horses</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
