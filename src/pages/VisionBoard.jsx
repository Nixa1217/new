import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image, Plus, Edit2, HelpCircle, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger } from
"@/components/ui/dialog";

export default function VisionBoard() {
  const queryClient = useQueryClient();
  const [editingSection, setEditingSection] = useState(null);
  const [editText, setEditText] = useState("");

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => await base44.auth.me(),
    staleTime: Infinity
  });

  const { data: profile } = useQuery({
    queryKey: ['userProfile', user?.email],
    queryFn: async () => {
      const profiles = await base44.entities.UserProfile.filter({ created_by: user?.email });
      return profiles[0] || null;
    },
    enabled: !!user
  });

  const { data: visionBoard } = useQuery({
    queryKey: ['visionBoard', user?.email],
    queryFn: async () => {
      const boards = await base44.entities.VisionBoard.filter({ created_by: user?.email });
      return boards[0] || null;
    },
    enabled: !!user
  });

  const createOrUpdateVisionBoard = useMutation({
    mutationFn: async (data) => {
      if (visionBoard) {
        return base44.entities.VisionBoard.update(visionBoard.id, data);
      }
      return base44.entities.VisionBoard.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['visionBoard']);
      setEditingSection(null);
      setEditText("");
    }
  });

  const deleteVisionBoard = useMutation({
    mutationFn: () => base44.entities.VisionBoard.delete(visionBoard.id),
    onSuccess: () => {
      queryClient.invalidateQueries(['visionBoard']);
    }
  });

  const handleSaveText = () => {
    createOrUpdateVisionBoard.mutate({
      ...visionBoard,
      [editingSection]: editText
    });
  };

  const handleEditClick = (section, currentText) => {
    setEditingSection(section);
    setEditText(currentText || "");
  };

  const handleResetBoard = () => {
    if (window.confirm("Are you sure you want to reset your entire Vision Board? This cannot be undone.")) {
      deleteVisionBoard.mutate();
    }
  };

  const firstName = profile?.preferred_name || 'friend';

  const galleries = [
  {
    title: "Fitness Vision",
    field: "fitness_images",
    link: "FitnessGallery",
    instructions: "Add images of your dream body, energy, and health."
  },
  {
    title: "Finances Vision",
    field: "finances_images",
    link: "FinancesGallery",
    instructions: "Add images of your material goals, lifestyle, and financial outcomes."
  },
  {
    title: "Travel Vision",
    field: "travel_images",
    link: "TravelGallery",
    instructions: "Add destinations and places you will visit."
  },
  {
    title: "Lifestyle Vision",
    field: "lifestyle_images",
    link: "LifestyleGallery",
    instructions: "Add environments, homes, and aesthetics of your ideal life."
  },
  {
    title: "Social Life Vision",
    field: "social_images",
    link: "SocialGallery",
    instructions: "Add images representing your future friendships, social life, and experiences."
  },
  {
    title: "Partner Vision",
    field: "partner_images",
    link: "PartnerGallery",
    instructions: "Add images of your desired partner or relationship. If you have a partner, add photos of you two and the life you want together."
  }];


  return (
    <div className="min-h-screen bg-[#F5EFE7] p-6">
      <div className="max-w-4xl mx-auto pt-8 space-y-8 pb-32">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-[#5C4A3A]">{firstName}'s Vision Board</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-[#5C4A3A]/60">
                <HelpCircle className="w-6 h-6" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#FDFBF7] border-[#E8D5C4] max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-[#5C4A3A]">How to Use Your Vision Board</DialogTitle>
                <DialogDescription className="text-[#5C4A3A]/70 space-y-3 pt-4">
                  <p className="">This is your Vision Board - a living blueprint of your future. Embody Now: Do not wish; know. Feel the primary emotion of your desired reality in your body as you look at each image.</p>
                  <p className="font-semibold text-[#5C4A3A]">How to use it:</p>
                  <ol className="list-decimal list-inside space-y-2 pl-2">
                    <li>Review daily - morning, throughout the day, and before sleep.</li>
                    <li>Feel it in your body - embody the emotion of already having it.</li>
                    <li>Update often - clarity sharpens identity. Identity shapes reality.</li>
                  </ol>
                  <p className="pt-2">Remember: You are not waiting. You are declaring. Return here anytime you feel lost, and realign with your Self-Sovereign Identity.</p>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>

        {/* Quote */}
        <p className="text-lg italic text-[#5C4A3A]/70 text-center leading-relaxed">
          "Clarity is power. Review your vision daily, and let your future self become the only voice you listen to."
        </p>

        {/* Tenets */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold text-[#5C4A3A] accent-font">
              {firstName}'s Tenets
            </h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="w-6 h-6 p-0">
                  <HelpCircle className="w-5 h-5 text-[#5C4A3A]/50" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#FDFBF7] border-[#E8D5C4] max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-[#5C4A3A]">Tenets</DialogTitle>
                  <DialogDescription className="text-[#5C4A3A]/70 space-y-3 pt-4">
                    <p>Write your personal tenets - the laws of your new identity.</p>
                    <p>Include:</p>
                    <ul className="list-disc list-inside space-y-1 pl-2">
                      <li>How you think, act, and show up</li>
                      <li>Your values, principles, and standards</li>
                      <li>Habits you embody (and habits you do not allow)</li>
                      <li>How others treat you</li>
                      <li>Labels you claim (ex: disciplined, feminine, magnetic, unstoppable)</li>
                    </ul>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEditClick('tenets', visionBoard?.tenets)}
              className="text-[#D4AF77] hover:bg-[#D4AF77]/10">

              <Edit2 className="w-4 h-4" />
            </Button>
          </div>
          {editingSection === 'tenets' ?
          <div className="space-y-2">
              <Textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="bg-[#FDFBF7] border-[#E8D5C4] min-h-[100px]"
              placeholder="Principles, standards, habits, and identity rules you live by." />

              <div className="flex gap-2">
                <Button onClick={handleSaveText} className="bg-[#D4AF77] hover:bg-[#C49F67]">Save</Button>
                <Button onClick={() => setEditingSection(null)} variant="outline">Cancel</Button>
              </div>
            </div> :

          <p className="text-[#5C4A3A] whitespace-pre-wrap">
              {visionBoard?.tenets || "Tap the pen icon to add your tenets..."}
            </p>
          }
        </div>

        {/* Fitness & Finances Galleries */}
        <div className="grid grid-cols-2 gap-4">
          {galleries.slice(0, 2).map((gallery) =>
          <div key={gallery.field} className="space-y-2">
              <div className="flex items-center gap-1 justify-center">
                <h3 className="text-lg font-semibold text-[#5C4A3A]">{gallery.title}</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="w-5 h-5 p-0">
                      <HelpCircle className="w-4 h-4 text-[#5C4A3A]/50" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#FDFBF7] border-[#E8D5C4]">
                    <DialogHeader>
                      <DialogTitle className="text-[#5C4A3A]">{gallery.title}</DialogTitle>
                      <DialogDescription className="text-[#5C4A3A]/70 pt-4">
                        {gallery.instructions}
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
              <Link to={createPageUrl(gallery.link)}>
                <div className="bg-[#FDFBF7]/50 rounded-2xl p-4 hover:bg-[#FDFBF7] transition-colors cursor-pointer">
                  <div className="aspect-square bg-[#E8D5C4]/30 rounded-xl flex items-center justify-center">
                    {visionBoard?.[gallery.field]?.length > 0 ?
                  <img
                    src={visionBoard[gallery.field][0]}
                    alt={gallery.title}
                    className="w-full h-full object-cover rounded-xl" /> :


                  <Image className="w-12 h-12 text-[#D4AF77]/50" />
                  }
                  </div>
                  <p className="text-sm text-[#5C4A3A]/60 mt-2 text-center">
                    {visionBoard?.[gallery.field]?.length || 0} images
                  </p>
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* Plans and Bucket List */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold text-[#5C4A3A] accent-font">
              {firstName}'s Plans and Bucket List
            </h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="w-6 h-6 p-0">
                  <HelpCircle className="w-5 h-5 text-[#5C4A3A]/50" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#FDFBF7] border-[#E8D5C4] max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-[#5C4A3A]">Plans + Bucket List</DialogTitle>
                  <DialogDescription className="text-[#5C4A3A]/70 space-y-3 pt-4">
                    <p>List your life plans and goals with clear dates.</p>
                    <p>Include:</p>
                    <ul className="list-disc list-inside space-y-1 pl-2">
                      <li>Financial and business goals</li>
                      <li>Travel plans (format: "Greece, June 2026")</li>
                      <li>Skills to learn</li>
                      <li>Big experiences you want to live</li>
                    </ul>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEditClick('plans_bucket_list', visionBoard?.plans_bucket_list)}
              className="text-[#D4AF77] hover:bg-[#D4AF77]/10">

              <Edit2 className="w-4 h-4" />
            </Button>
          </div>
          {editingSection === 'plans_bucket_list' ?
          <div className="space-y-2">
              <Textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="bg-[#FDFBF7] border-[#E8D5C4] min-h-[100px]"
              placeholder="Your goals, plans, travel, skills, and bucket-list items." />

              <div className="flex gap-2">
                <Button onClick={handleSaveText} className="bg-[#D4AF77] hover:bg-[#C49F67]">Save</Button>
                <Button onClick={() => setEditingSection(null)} variant="outline">Cancel</Button>
              </div>
            </div> :

          <p className="text-[#5C4A3A] whitespace-pre-wrap">
              {visionBoard?.plans_bucket_list || "Tap the pen icon to add your plans..."}
            </p>
          }
        </div>

        {/* Travel & Lifestyle Galleries */}
        <div className="grid grid-cols-2 gap-4">
          {galleries.slice(2, 4).map((gallery) =>
          <div key={gallery.field} className="space-y-2">
              <div className="flex items-center gap-1 justify-center">
                <h3 className="text-lg font-semibold text-[#5C4A3A]">{gallery.title}</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="w-5 h-5 p-0">
                      <HelpCircle className="w-4 h-4 text-[#5C4A3A]/50" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#FDFBF7] border-[#E8D5C4]">
                    <DialogHeader>
                      <DialogTitle className="text-[#5C4A3A]">{gallery.title}</DialogTitle>
                      <DialogDescription className="text-[#5C4A3A]/70 pt-4">
                        {gallery.instructions}
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
              <Link to={createPageUrl(gallery.link)}>
                <div className="bg-[#FDFBF7]/50 rounded-2xl p-4 hover:bg-[#FDFBF7] transition-colors cursor-pointer">
                  <div className="aspect-square bg-[#E8D5C4]/30 rounded-xl flex items-center justify-center">
                    {visionBoard?.[gallery.field]?.length > 0 ?
                  <img
                    src={visionBoard[gallery.field][0]}
                    alt={gallery.title}
                    className="w-full h-full object-cover rounded-xl" /> :


                  <Image className="w-12 h-12 text-[#D4AF77]/50" />
                  }
                  </div>
                  <p className="text-sm text-[#5C4A3A]/60 mt-2 text-center">
                    {visionBoard?.[gallery.field]?.length || 0} images
                  </p>
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* Social Life */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold text-[#5C4A3A] accent-font">
              {firstName}'s Social Life
            </h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="w-6 h-6 p-0">
                  <HelpCircle className="w-5 h-5 text-[#5C4A3A]/50" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#FDFBF7] border-[#E8D5C4] max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-[#5C4A3A]">Social Life</DialogTitle>
                  <DialogDescription className="text-[#5C4A3A]/70 space-y-3 pt-4">
                    <p>Describe your future social world:</p>
                    <ul className="list-disc list-inside space-y-1 pl-2">
                      <li>How many close friends</li>
                      <li>Their values and personalities</li>
                      <li>Mentors and inspirations in your circle</li>
                      <li>Family dynamics</li>
                      <li>Social environments you spend time in</li>
                    </ul>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEditClick('social_life', visionBoard?.social_life)}
              className="text-[#D4AF77] hover:bg-[#D4AF77]/10">

              <Edit2 className="w-4 h-4" />
            </Button>
          </div>
          {editingSection === 'social_life' ?
          <div className="space-y-2">
              <Textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="bg-[#FDFBF7] border-[#E8D5C4] min-h-[100px]"
              placeholder="Your social world, friendships, mentors, and community." />

              <div className="flex gap-2">
                <Button onClick={handleSaveText} className="bg-[#D4AF77] hover:bg-[#C49F67]">Save</Button>
                <Button onClick={() => setEditingSection(null)} variant="outline">Cancel</Button>
              </div>
            </div> :

          <p className="text-[#5C4A3A] whitespace-pre-wrap">
              {visionBoard?.social_life || "Tap the pen icon to add your social life vision..."}
            </p>
          }
        </div>

        {/* Partner */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold text-[#5C4A3A] accent-font">
              {firstName}'s Partner
            </h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="w-6 h-6 p-0">
                  <HelpCircle className="w-5 h-5 text-[#5C4A3A]/50" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#FDFBF7] border-[#E8D5C4] max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-[#5C4A3A]">Partner</DialogTitle>
                  <DialogDescription className="text-[#5C4A3A]/70 space-y-3 pt-4">
                    <p>Describe your ideal partner and relationship dynamic.</p>
                    <p>Include:</p>
                    <ul className="list-disc list-inside space-y-1 pl-2">
                      <li>Personality, habits, values</li>
                      <li>How they treat you</li>
                      <li>Lifestyle you build together</li>
                    </ul>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEditClick('partner', visionBoard?.partner)}
              className="text-[#D4AF77] hover:bg-[#D4AF77]/10">

              <Edit2 className="w-4 h-4" />
            </Button>
          </div>
          {editingSection === 'partner' ?
          <div className="space-y-2">
              <Textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="bg-[#FDFBF7] border-[#E8D5C4] min-h-[100px]"
              placeholder="Your desired relationship and partner vision." />

              <div className="flex gap-2">
                <Button onClick={handleSaveText} className="bg-[#D4AF77] hover:bg-[#C49F67]">Save</Button>
                <Button onClick={() => setEditingSection(null)} variant="outline">Cancel</Button>
              </div>
            </div> :

          <p className="text-[#5C4A3A] whitespace-pre-wrap">
              {visionBoard?.partner || "Tap the pen icon to add your partner vision..."}
            </p>
          }
        </div>

        {/* Social & Partner Galleries */}
        <div className="grid grid-cols-2 gap-4">
          {galleries.slice(4, 6).map((gallery) =>
          <div key={gallery.field} className="space-y-2">
              <div className="flex items-center gap-1 justify-center">
                <h3 className="text-lg font-semibold text-[#5C4A3A]">{gallery.title}</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="w-5 h-5 p-0">
                      <HelpCircle className="w-4 h-4 text-[#5C4A3A]/50" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#FDFBF7] border-[#E8D5C4]">
                    <DialogHeader>
                      <DialogTitle className="text-[#5C4A3A]">{gallery.title}</DialogTitle>
                      <DialogDescription className="text-[#5C4A3A]/70 pt-4">
                        {gallery.instructions}
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
              <Link to={createPageUrl(gallery.link)}>
                <div className="bg-[#FDFBF7]/50 rounded-2xl p-4 hover:bg-[#FDFBF7] transition-colors cursor-pointer">
                  <div className="aspect-square bg-[#E8D5C4]/30 rounded-xl flex items-center justify-center">
                    {visionBoard?.[gallery.field]?.length > 0 ?
                  <img
                    src={visionBoard[gallery.field][0]}
                    alt={gallery.title}
                    className="w-full h-full object-cover rounded-xl" /> :


                  <Image className="w-12 h-12 text-[#D4AF77]/50" />
                  }
                  </div>
                  <p className="text-sm text-[#5C4A3A]/60 mt-2 text-center">
                    {visionBoard?.[gallery.field]?.length || 0} images
                  </p>
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* Gratitude */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold text-[#5C4A3A] accent-font">
              {firstName} is grateful for...
            </h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="w-6 h-6 p-0">
                  <HelpCircle className="w-5 h-5 text-[#5C4A3A]/50" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#FDFBF7] border-[#E8D5C4]">
                <DialogHeader>
                  <DialogTitle className="text-[#5C4A3A]">Gratitude</DialogTitle>
                  <DialogDescription className="text-[#5C4A3A]/70 pt-4">
                    List gratitude for your present and your future. Gratitude = attraction.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEditClick('gratitude', visionBoard?.gratitude)}
              className="text-[#D4AF77] hover:bg-[#D4AF77]/10">

              <Edit2 className="w-4 h-4" />
            </Button>
          </div>
          {editingSection === 'gratitude' ?
          <div className="space-y-2">
              <Textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="bg-[#FDFBF7] border-[#E8D5C4] min-h-[100px]"
              placeholder="Everything you're grateful for now and in advance." />

              <div className="flex gap-2">
                <Button onClick={handleSaveText} className="bg-[#D4AF77] hover:bg-[#C49F67]">Save</Button>
                <Button onClick={() => setEditingSection(null)} variant="outline">Cancel</Button>
              </div>
            </div> :

          <p className="text-[#5C4A3A] whitespace-pre-wrap">
              {visionBoard?.gratitude || "Tap the pen icon to add your gratitude..."}
            </p>
          }
        </div>

        {/* Bottom Message */}
        <p className="text-center text-[#5C4A3A]/70 italic pt-4">Return here every day. Your conviction empowers your frequency. The mirror of reality is compelled to reflect the feeling you hold most consistently.

        </p>

        {/* Reset Button */}
        <div className="flex justify-center pt-4">
          <Button
            onClick={handleResetBoard}
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50">

            <Trash2 className="w-4 h-4 mr-2" />
            Reset Vision Board
          </Button>
        </div>
      </div>
    </div>);

}