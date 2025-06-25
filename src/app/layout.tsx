// ./app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import Navbar from '@/component/navbar'; // Ensure this path is correct
import Footer from '@/component/footer'; // Ensure this path is correct
import { AuthProvider } from '@/contexts/AuthContext'; // Ensure this path is correct

// Import react-toastify CSS (Crucial for ToastContainer styling)
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'PetroLearn',
  description: 'Learn, Share, and Verify Knowledge',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} flex flex-col h-full`}>
        <AuthProvider>
          {/* Navbar stays at top */}
          <Navbar />

          {/*
            Main content area - takes remaining space
            We add 'pt-16' to push the content down,
            assuming your Navbar has a height of 64px (h-16 in Tailwind).
            Adjust 'pt-16' if your Navbar's height is different.
          */}
          <main className="flex-1 w-full pt-16">
            {/* Content container - full width by default */}
            <div className="h-full text-black bg-white w-full">
              {children}
               
            </div>
          </main>

          {/* Footer stays at bottom */}
         

          {/* Toast notifications */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            toastClassName="!bg-gray-800 !text-white"
            progressClassName="!bg-blue-500"
          />
        </AuthProvider>
      </body>
    </html>
  );
}