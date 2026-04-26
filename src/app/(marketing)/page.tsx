import Hero from "@/components/Hero";
import ProofStrip from "@/components/ProofStrip";
import PainSection from "@/components/PainSection";
import HowItWorks from "@/components/HowItWorks";
import ProductSystem from "@/components/ProductSystem";
import Features from "@/components/Features";
import About from "@/components/About";
import CtaBanner from "@/components/CtaBanner";

export default function Home() {
  return (
    <>
      <Hero />
      <ProofStrip />
      <PainSection />
      <HowItWorks />
      <ProductSystem />
      <Features />
      <About />
      <CtaBanner />
    </>
  );
}
