import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Download, 
  Share, 
  Video,
  MessageSquare,
  ArrowLeft
} from 'lucide-react';

interface ScanResultsProps {
  imageData: string;
  onBack: () => void;
}

interface AnalysisResult {
  riskLevel: 'low' | 'moderate' | 'high';
  confidence: number;
  recommendations: string[];
  findings: string[];
}

export const ScanResults = ({ imageData, onBack }: ScanResultsProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    // Simulate AI analysis
    const analyzeImage = async () => {
      const steps = [
        { text: 'Processing image...', duration: 1000 },
        { text: 'Running AI analysis...', duration: 2000 },
        { text: 'Evaluating findings...', duration: 1500 },
        { text: 'Generating report...', duration: 800 }
      ];

      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, steps[i].duration));
        setProgress((i + 1) * 25);
      }

      // Simulate analysis results
      const mockResult: AnalysisResult = {
        riskLevel: 'low',
        confidence: 92,
        recommendations: [
          'Continue regular self-examinations',
          'Monitor for any changes in size, color, or texture',
          'Schedule routine dermatologist visit in 6 months',
          'Apply sunscreen regularly for prevention'
        ],
        findings: [
          'Regular pigmentation pattern detected',
          'No asymmetry observed',
          'Uniform coloration',
          'Well-defined borders'
        ]
      };

      setResults(mockResult);
      setIsAnalyzing(false);
    };

    analyzeImage();
  }, []);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-medical-green text-accent-foreground';
      case 'moderate': return 'bg-yellow-500 text-yellow-50';
      case 'high': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'low': return <CheckCircle className="w-5 h-5" />;
      case 'moderate': return <Info className="w-5 h-5" />;
      case 'high': return <AlertTriangle className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  if (isAnalyzing) {
    return (
      <Card className="w-full max-w-2xl mx-auto shadow-card-medical animate-medical-fade-in">
        <CardContent className="p-8 text-center space-y-6">
          <div className="flex items-center justify-center w-20 h-20 bg-gradient-scan rounded-full mx-auto animate-scan-pulse">
            <div className="w-8 h-8 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
          </div>
          
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-foreground">Analyzing Your Skin Photo</h3>
            <p className="text-muted-foreground">Our AI is carefully examining your image...</p>
          </div>

          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground">{progress}% Complete</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-medical-fade-in">
      <div className="flex items-center gap-4">
        <Button onClick={onBack} variant="outline" size="sm">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <h2 className="text-2xl font-bold text-foreground">Scan Results</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Image Display */}
        <Card className="shadow-card-medical">
          <CardHeader>
            <CardTitle className="text-lg">Analyzed Image</CardTitle>
          </CardHeader>
          <CardContent>
            <img 
              src={imageData} 
              alt="Skin analysis" 
              className="w-full h-64 object-cover rounded-lg"
            />
          </CardContent>
        </Card>

        {/* Risk Assessment */}
        <Card className="shadow-card-medical">
          <CardHeader>
            <CardTitle className="text-lg">Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge className={`${getRiskColor(results?.riskLevel || '')} flex items-center gap-2`}>
                {getRiskIcon(results?.riskLevel || '')}
                {results?.riskLevel.toUpperCase()} RISK
              </Badge>
              <span className="text-sm text-muted-foreground">
                {results?.confidence}% confidence
              </span>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Key Findings:</h4>
              <ul className="space-y-2">
                {results?.findings.map((finding, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-medical-green mt-0.5 flex-shrink-0" />
                    {finding}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="lg:col-span-2 shadow-card-medical">
          <CardHeader>
            <CardTitle className="text-lg">Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results?.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
                  <Info className="w-5 h-5 text-medical-blue mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-secondary-foreground">{rec}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card className="lg:col-span-2 shadow-card-medical">
          <CardHeader>
            <CardTitle className="text-lg">Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button variant="medical" className="flex flex-col gap-2 h-auto py-4">
                <Download className="w-6 h-6" />
                <span className="text-sm">Download Report</span>
              </Button>
              
              <Button variant="trust" className="flex flex-col gap-2 h-auto py-4">
                <Share className="w-6 h-6" />
                <span className="text-sm">Share Results</span>
              </Button>
              
              <Button variant="scan" className="flex flex-col gap-2 h-auto py-4">
                <Video className="w-6 h-6" />
                <span className="text-sm">Zoom Consult</span>
              </Button>
              
              <Button variant="outline" className="flex flex-col gap-2 h-auto py-4">
                <MessageSquare className="w-6 h-6" />
                <span className="text-sm">Teams Chat</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};