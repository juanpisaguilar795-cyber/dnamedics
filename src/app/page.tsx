import { Navbar }             from "@/components/shared/Navbar";
import { Footer }             from "@/components/shared/Footer";
import { HeroSection }        from "@/components/landing/HeroSection";
import { AboutSection }       from "@/components/landing/AboutSection";
import { ServicesSection }    from "@/components/landing/ServicesSection";
import { ProcessSection }     from "@/components/landing/ProcessSection";
import { VideoSection }       from "@/components/landing/VideoSection"; 
import { BookingSection }     from "@/components/landing/BookingSection";
import { NewsPreviewSection, CTASection } from "@/components/landing/NewsAndCTA";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        
        <div id="quienes-somos" className="scroll-mt-16">
          <AboutSection />
        </div>
        
        <div id="servicios" className="scroll-mt-16">
          <ServicesSection />
        </div>
        
        <div id="videos" className="scroll-mt-16">
          <VideoSection />
        </div>
        
        <div id="proceso" className="scroll-mt-16">
          <ProcessSection />
        </div>
        
        <div id="reserva" className="scroll-mt-16">
          <BookingSection />
        </div>
        
        <div id="noticias" className="scroll-mt-16">
          <NewsPreviewSection />
        </div>
        
        <div id="contacto" className="scroll-mt-16">
          <CTASection />
        </div>
      </main>
      <Footer />
    </>
  );
}