import "@styles/globals.css";
import { OwnerAuthProvider } from "@app/Providers";
import { ContentProvider } from "@Context/owner/context";
import { HotelProvider } from "@Context/owner/ChosseHotelContext";

export const metadata = {
    title: "Hotel Booking",
    description: "Able to find and book hotels",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body >
                <ContentProvider>
                    <HotelProvider>
                        <OwnerAuthProvider>{children}</OwnerAuthProvider>
                    </HotelProvider>
                </ContentProvider>
            </body>
        </html>
    );
}
