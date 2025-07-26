import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Shield, Smartphone } from 'lucide-react';
import medicalHero from '@/assets/medical-hero.jpg';
import momLogo from '@/assets/mom-logo.jpg';
import momWordmark from '@/assets/mom-wordmark.jpg';

export const MedicalHeader = () => {
  return (
    <Card className="w-full shadow-card-medical animate-medical-fade-in overflow-hidden">
      <div className="relative">
        <img 
          src={medicalHero}
          alt="Medical skin scanning technology" 
          className="w-full h-48 md:h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-medical-blue/80 to-medical-teal/80" />
        
        <CardContent className="absolute inset-0 flex flex-col justify-center p-6 md:p-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-6">
              <img 
                src={momLogo} 
                alt="MOM Ltd Logo" 
                className="w-16 h-16 bg-white rounded-lg p-2 shadow-lg"
              />
              <div>
                <img 
                  src={momWordmark} 
                  alt="MOM Ltd - Mobile Oncology Monitor" 
                  className="h-12 filter brightness-0 invert opacity-90"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Heart className="w-4 h-4 mr-1" />
                Patent Protected Technology
              </Badge>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              <span className="block text-lg md:text-xl font-normal opacity-90 mb-2">
                Advanced Skin Cancer Detection Platform
              </span>
            </h1>
            
            <p className="text-white/90 text-base md:text-lg mb-6 leading-relaxed">
              Powered by MOM Ltd's patented neural network technology for professional-grade 
              skin cancer screening using your smartphone camera. Get clinical-quality results instantly.
            </p>

            <div className="flex flex-wrap gap-4 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Patent Protected
              </div>
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                iOS & Android
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Clinically Validated
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};