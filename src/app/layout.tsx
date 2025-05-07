import Navbar from '@/component/navbar';
import './globals.css'
import { Inter } from 'next/font/google'
import { ToastContainer } from 'react-toastify';
import Footer from '@/component/footer';
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'PetroLearn',
  description: 'Learn, Share, and Verify Knowledge',
  icons: {
    icon: '/favicon.ico', // from /public directory
  },
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

      <body className={inter.className}>
        <Navbar />
        <main className="pt-14  text-black bg-white min-h-screen">
          {children}
        </main>
        <ToastContainer />
        <Footer/>
      </body>
    </html>
  );
}
