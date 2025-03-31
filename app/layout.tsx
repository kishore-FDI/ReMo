import { Work_Sans } from "next/font/google";

import { AuthProvider } from "@/components/Helper/AuthProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

import Room from "./Room";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata = {
  title: "Virtual Office",
  description: "",
};

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  weight: ["400", "600", "700"],
});

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang='en'>
    <body className={`${workSans.className} bg-primary-grey-200`}>
      <ClerkProvider
        appearance={{
          layout: {
            socialButtonsVariant: "iconButton",
            logoImageUrl: "favicon.ico",
          },
          variables: {
            colorText: "#fff",
            colorPrimary: "#0E78F9",
            colorBackground: "#1C1F2E",
            colorInputBackground: "#252A41",
            colorInputText: "#fff",
          },
        }}
      >
        {/* <AuthProvider> */}
        <Room>
          <TooltipProvider>{children}</TooltipProvider>
        </Room>
        {/* </AuthProvider> */}
      </ClerkProvider>
    </body>
  </html>
);

export default RootLayout;
