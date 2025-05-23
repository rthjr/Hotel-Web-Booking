

import "@styles/globals.css";
import { AuthProvider } from "@Context/AuthContext/AuthContext";

export const metadata = {
  title: "Hotel Booking",
  description: "Able to find and book hotels",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
          <AuthProvider>{children}</AuthProvider>     
      </body>
    </html>
  );
}
