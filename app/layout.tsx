import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'PropertyPal AI',
  description: 'AI-powered real estate assistant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <nav className="w-full bg-white border-b border-gray-100 py-3 px-6 flex gap-6 items-center shadow-sm mb-6">
          <Link href="/" className="font-semibold text-gray-800 hover:text-black transition-colors">Home</Link>
          <Link href="/offers/add" className="font-semibold text-gray-700 hover:text-black transition-colors">Add Offer</Link>
          <Link href="/chat" className="font-semibold text-gray-700 hover:text-black transition-colors">Chat</Link>
        </nav>
        {children}
      </body>
    </html>
  )
}
