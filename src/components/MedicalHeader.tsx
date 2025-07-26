import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Shield, Smartphone } from 'lucide-react';
import medicalHero from '@/assets/medical-hero.jpg';

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
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Heart className="w-4 h-4 mr-1" />
                Medical Grade AI
              </Badge>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              MOM
              <span className="block text-lg md:text-xl font-normal opacity-90">
                Mobile Oncology Monitor
              </span>
            </h1>
            
            <p className="text-white/90 text-base md:text-lg mb-6 leading-relaxed">
              Advanced skin cancer detection using your smartphone camera and neural network analysis. 
              Get professional-grade screening results instantly.
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