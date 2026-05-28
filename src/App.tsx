import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import SubjectSelection from "./pages/SubjectSelection.tsx";
import SubjectDetail from "./pages/SubjectDetail.tsx";
import LessonDetail from "./pages/LessonDetail.tsx";
import AlgebraQuiz from "./pages/AlgebraQuiz.tsx";
import SignUp from "./pages/SignUp.tsx";
import NotFound from "./pages/NotFound.tsx";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/subjects" element={<SubjectSelection />} />
          <Route path="/subjects/:name" element={<SubjectDetail />} />
          <Route path="/lessons/:lessonId" element={<LessonDetail />} />
          <Route path="/quiz/algebra" element={<AlgebraQuiz />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
