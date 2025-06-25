import ScrollAnimation from "@components/motion/ScrollAnimation";
import Footer from "@components/user/layout/Footer";
import Header from "@components/user/layout/Header";
import "@styles/globals.css";

export const metadata = {
  title: "Hotel Booking",
  description: "Able to find and book hotels",
};

export default function RootLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollAnimation />
      <Header className="sticky top-0 z-[9999] bg-white shadow-2xl" />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}