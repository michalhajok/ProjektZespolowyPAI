import "../app/globals.css";
import { AuthProvider } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Wypożyczalnia Sprzętu",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body>
        <AuthProvider>
          {/* <Navbar /> */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
