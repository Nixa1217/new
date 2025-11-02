
import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, ArrowLeft, X, Loader2 } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function SocialGallery() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // setSelectedImage state is no longer needed as DialogTrigger directly handles image display
  const [uploading, setUploading] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => await base44.auth.me(),
    staleTime: Infinity
  });

  const { data: visionBoard } = useQuery({
    queryKey: ['visionBoard', user?.email],
    queryFn: async () => {
      const boards = await base44.entities.VisionBoard.filter({ created_by: user?.email });
      return boards[0] || null;
    },
    enabled: !!user
  });

  const updateVisionBoard = useMutation({
    mutationFn: (data) => {
      if (visionBoard) {
        return base44.entities.VisionBoard.update(visionBoard.id, data);
      }
      return base44.entities.VisionBoard.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['visionBoard']);
      setUploading(false);
    }
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      const currentImages = visionBoard?.social_images || [];
      updateVisionBoard.mutate({
        ...visionBoard,
        social_images: [...currentImages, file_url]
      });
    } catch (error) {
      alert("Failed to upload image");
      setUploading(false);
    }
  };

  const handleDeleteImage = (imageUrl) => {
    const currentImages = visionBoard?.social_images || [];
    updateVisionBoard.mutate({
      ...visionBoard,
      social_images: currentImages.filter(url => url !== imageUrl)
    });
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const currentImages = Array.from(visionBoard?.social_images || []);
    const [reorderedImage] = currentImages.splice(result.source.index, 1);
    currentImages.splice(result.destination.index, 0, reorderedImage);

    updateVisionBoard.mutate({
      ...visionBoard,
      social_images: currentImages
    });
  };

  const images = visionBoard?.social_images || [];

  return (
    <div className="min-h-screen bg-[#F5EFE7] p-3">
      <div className="max-w-6xl mx-auto pt-8 space-y-6 pb-32">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => navigate(createPageUrl("VisionBoard"))}
            variant="ghost"
            className="text-[#5C4A3A]/60"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-[#5C4A3A]">Social Life Vision</h1>
          <label htmlFor="social-upload">
            <Button
              disabled={uploading}
              className="bg-[#D4AF77] hover:bg-[#C49F67] cursor-pointer"
              asChild
            >
              <div>
                {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
              </div>
            </Button>
            <Input
              id="social-upload"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="social-images" direction="vertical">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="columns-2 md:columns-4 gap-1"
              >
                {images.map((imageUrl, index) => (
                  <Draggable key={imageUrl} draggableId={imageUrl} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="relative group break-inside-avoid mb-1"
                      >
                        <Dialog>
                          <DialogTrigger asChild>
                            <img
                              src={imageUrl}
                              alt={`Social ${index + 1}`}
                              className="w-full h-auto rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
                            />
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl bg-transparent border-none">
                            <img src={imageUrl} alt="Full size" className="w-full h-auto rounded-xl" />
                          </DialogContent>
                        </Dialog>
                        <Button
                          onClick={() => handleDeleteImage(imageUrl)}
                          size="icon"
                          variant="destructive"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 rounded-full w-8 h-8"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {images.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#5C4A3A]/60 text-lg">No images yet. Tap + to add your first image.</p>
          </div>
        )}
      </div>
    </div>
  );
}
