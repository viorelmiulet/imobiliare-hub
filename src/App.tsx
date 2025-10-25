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
import NotFound from "./pages/NotFound";
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
              <Route path="/" element={<Index />} />
              <Route path="/complex/:complexId" element={<ComplexDetails />} />
              <Route path="/import-eurocasa" element={<ImportEurocasaData />} />
              <Route path="/import-complex1" element={<ImportComplex1Data />} />
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
