import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import ComplexDetails from "./pages/ComplexDetails";
import ImportEurocasaData from "./pages/ImportEurocasaData";
import ImportComplex1Data from "./pages/ImportComplex1Data";
import ImportViilor33Data from "./pages/ImportViilor33Data";
import ImportEurocasaScara6Data from "./pages/ImportEurocasaScara6Data";
import ClientsOverview from "./pages/ClientsOverview";
import ImportContacts from "./pages/ImportContacts";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { initializeDatabase } from "./utils/initializeDatabase";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Initialize database on first load
    initializeDatabase().catch(console.error);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<Index />} />
              <Route path="/complex/:complexId" element={<ComplexDetails />} />
              <Route path="/clients" element={<ProtectedRoute><ClientsOverview /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
              <Route path="/import-eurocasa" element={<ProtectedRoute><ImportEurocasaData /></ProtectedRoute>} />
              <Route path="/import-complex1" element={<ProtectedRoute><ImportComplex1Data /></ProtectedRoute>} />
              <Route path="/import-viilor33" element={<ProtectedRoute><ImportViilor33Data /></ProtectedRoute>} />
              <Route path="/import-eurocasa-scara6" element={<ProtectedRoute><ImportEurocasaScara6Data /></ProtectedRoute>} />
              <Route path="/import-contacts" element={<ProtectedRoute><ImportContacts /></ProtectedRoute>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
