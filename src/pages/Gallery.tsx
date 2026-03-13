import { useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Camera, Upload, ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const fetchPhotos = async () => {
  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
};

const Gallery = () => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const { data: photos, refetch } = useQuery({
    queryKey: ["photos"],
    queryFn: fetchPhotos,
  });

  const uploadPhoto = useCallback(async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("photos")
        .upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("photos")
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from("photos")
        .insert({ image_url: urlData.publicUrl });
      if (dbError) throw dbError;

      toast.success("Photo added to the gallery!");
      refetch();
    } catch (err: any) {
      toast.error("Failed to upload: " + err.message);
    } finally {
      setUploading(false);
    }
  }, [refetch]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadPhoto(file);
    e.target.value = "";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="container max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Shared Gallery</h1>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => cameraInputRef.current?.click()}
              disabled={uploading}
            >
              <Camera className="w-4 h-4 mr-1" />
              Camera
            </Button>
            <Button
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Upload className="w-4 h-4 mr-1" />}
              Upload
            </Button>
          </div>
        </div>
      </header>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Gallery Grid */}
      <main className="container max-w-4xl mx-auto px-4 py-6">
        {!photos || photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <ImageIcon className="w-16 h-16 mb-4 opacity-40" />
            <p className="text-lg font-medium">No photos yet</p>
            <p className="text-sm">Be the first to share a moment!</p>
          </div>
        ) : (
          <div className="columns-2 md:columns-3 gap-3 space-y-3">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="break-inside-avoid rounded-xl overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow"
              >
                <img
                  src={photo.image_url}
                  alt="Shared photo"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Gallery;
