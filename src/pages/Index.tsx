import { useState } from 'react';
import { MedicalHeader } from '@/components/MedicalHeader';
import { CameraCapture } from '@/components/CameraCapture';
import { ScanResults } from '@/components/ScanResults';

const Index = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleImageCapture = (imageData: string) => {
    setCapturedImage(imageData);
    setShowResults(true);
  };

  const handleBack = () => {
    setShowResults(false);
    setCapturedImage(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-8">
        <MedicalHeader />
        
        <div className="max-w-4xl mx-auto">
          {!showResults ? (
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  Start Your Skin Health Assessment
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Our AI-powered system analyzes your skin photos using advanced neural networks 
                  trained on thousands of dermatological images to help detect potential concerns early.
                </p>
              </div>
              
              <CameraCapture onImageCapture={handleImageCapture} />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-gradient-medical rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Capture</h3>
                  <p className="text-sm text-muted-foreground">
                    Take a clear photo of the skin area you want to analyze
                  </p>
                </div>
                
                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-gradient-scan rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Analyze</h3>
                  <p className="text-sm text-muted-foreground">
                    Our AI processes your image through neural network analysis
                  </p>
                </div>
                
                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-gradient-trust rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Results</h3>
                  <p className="text-sm text-muted-foreground">
                    Get instant results with recommendations and next steps
                  </p>
                </div>
              </div>
            </div>
          ) : (
            capturedImage && (
              <ScanResults 
                imageData={capturedImage} 
                onBack={handleBack}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
