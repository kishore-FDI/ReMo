import { Work_Sans } from "next/font/google";

import { AuthProvider } from "@/components/Helper/AuthProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

import Room from "./Room";

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
      <AuthProvider>
        <Room>
          <TooltipProvider>{children}</TooltipProvider>
        </Room>
      </AuthProvider>
    </body>
  </html>
);

export default RootLayout;
