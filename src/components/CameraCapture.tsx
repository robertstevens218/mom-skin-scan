import { useState } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera as CameraIcon, Upload, Scan } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CameraCaptureProps {
  onImageCapture: (imageData: string) => void;
}

export const CameraCapture = ({ onImageCapture }: CameraCaptureProps) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const { toast } = useToast();

  const takePicture = async () => {
    try {
      setIsCapturing(true);
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      if (image.dataUrl) {
        onImageCapture(image.dataUrl);
        toast({
          title: "Photo captured successfully",
          description: "Your skin photo is ready for analysis.",
        });
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      toast({
        title: "Camera error",
        description: "Unable to capture photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCapturing(false);
    }
  };

  const selectFromGallery = async () => {
    try {
      setIsCapturing(true);
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos,
      });

      if (image.dataUrl) {
        onImageCapture(image.dataUrl);
        toast({
          title: "Photo selected successfully",
          description: "Your skin photo is ready for analysis.",
        });
      }
    } catch (error) {
      console.error('Error selecting photo:', error);
      toast({
        title: "Gallery error",
        description: "Unable to select photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-card-medical animate-medical-fade-in">
      <CardContent className="p-6 space-y-4">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-medical rounded-full mx-auto mb-4">
            <Scan className="w-8 h-8 text-primary-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Capture Skin Photo</h3>
          <p className="text-sm text-muted-foreground">
            Take a clear photo of the area you'd like to analyze
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={takePicture}
            disabled={isCapturing}
            variant="medical"
            className="w-full"
          >
            <CameraIcon className="w-5 h-5" />
            {isCapturing ? 'Capturing...' : 'Take Photo'}
          </Button>

          <Button
            onClick={selectFromGallery}
            disabled={isCapturing}
            variant="trust"
            className="w-full"
          >
            <Upload className="w-5 h-5" />
            Select from Gallery
          </Button>
        </div>

        <div className="text-xs text-muted-foreground text-center space-y-1">
          <p>• Ensure good lighting</p>
          <p>• Keep camera steady</p>
          <p>• Focus on the area of concern</p>
        </div>
      </CardContent>
    </Card>
  );
};