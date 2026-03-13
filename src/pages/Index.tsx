import { QRCodeSVG } from "qrcode.react";
import { Camera, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const galleryUrl = `${window.location.origin}/gallery`;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-md w-full">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Camera className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Shared Gallery
        </h1>
        <p className="text-muted-foreground mb-8">
          Scan the QR code to open the gallery and share your photos with everyone
        </p>

        <div className="bg-card rounded-2xl p-8 shadow-lg border border-border inline-block mb-8">
          <QRCodeSVG
            value={galleryUrl}
            size={220}
            bgColor="transparent"
            fgColor="hsl(220, 30%, 10%)"
            level="H"
            includeMargin
          />
        </div>

        <p className="text-xs text-muted-foreground mb-6 break-all">{galleryUrl}</p>

        <Button size="lg" className="w-full max-w-xs" onClick={() => navigate("/gallery")}>
          <Share2 className="w-4 h-4 mr-2" />
          Open Gallery
        </Button>
      </div>
    </div>
  );
};

export default Index;
