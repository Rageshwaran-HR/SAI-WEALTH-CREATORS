import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import ServiceDetail from "@/pages/ServiceDetail";
import Research from "@/pages/Research";
import FundDetailPage from "@/pages/FundDetailPage";
import Calculators from "@/pages/Calculators";
import News from "@/pages/News";
import Contact from "@/pages/Contact";
import Layout from "./Layout"; // <-- New layout wrapper

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/services" component={Services} />
          <Route path="/services/:id" component={ServiceDetail} />
          <Route path="/research" component={Research} />
          <Route path="/research/fund/:symbol" component={FundDetailPage} />
          <Route path="/news" component={News} />
          <Route path="/contact" component={Contact} />
          <Route path="/calculators" component={Calculators} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
      <Toaster />
    </QueryClientProvider>
  );
}
export default App;
