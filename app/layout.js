import "../styles/globals.css";

export const metadata = {
  title: "Hotel Booking",
  description: "Able to find and book hotels",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
