import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AccessibilityMenu from "@/components/AccessibilityMenu";
import Index from "./pages/Index.tsx";
import SubjectSelection from "./pages/SubjectSelection.tsx";
import SubjectDetail from "./pages/SubjectDetail.tsx";
import LessonDetail from "./pages/LessonDetail.tsx";
import AlgebraQuiz from "./pages/AlgebraQuiz.tsx";
import PartsOfSpeechQuiz from "./pages/PartsOfSpeechQuiz.tsx";
import SignUp from "./pages/SignUp.tsx";
import Login from "./pages/Login.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import About from "./pages/About.tsx";
import ProfileSetup from "./pages/ProfileSetup.tsx";
import NotFound from "./pages/NotFound.tsx";
import Rewards from "./pages/Rewards.tsx";
import RewardToaster from "@/components/rewards/RewardToaster";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AccessibilityMenu />
        <RewardToaster />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/subjects" element={<SubjectSelection />} />
          <Route path="/subjects/:name" element={<SubjectDetail />} />
          <Route path="/lessons/:lessonId" element={<LessonDetail />} />
          <Route path="/quiz/algebra" element={<AlgebraQuiz />} />
          <Route path="/quiz/parts-of-speech" element={<PartsOfSpeechQuiz />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route path="/profile" element={<ProfileSetup />} />
          <Route path="/welcome" element={<ProfileSetup />} />
          <Route path="/rewards" element={<Rewards />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
