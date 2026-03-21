"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Image as ImageIcon, Copy, Download, RefreshCw, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { generateImage, enhancePrompt } from "@/lib/api";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [batchSize, setBatchSize] = useState(4); // Default to 4 images
  const [model, setModel] = useState("nano-banana-pro");
  const [style, setStyle] = useState("cinematic");
  const [enhanced, setEnhanced] = useState(false);

  const handleEnhance = async () => {
    if (!prompt) return;
    setEnhanced(true); // Show exciting state immediately
    const newPrompt = await enhancePrompt(prompt, style);
    setPrompt(newPrompt);
    // Reset state after a delay
    setTimeout(() => setEnhanced(false), 2000);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) return;

    setIsGenerating(true);
    setGeneratedImages([]); // Clear previous images

    // Auto-Enhance: Apply smart logic immediately
    const optimizedPrompt = await enhancePrompt(prompt, style);
    setPrompt(optimizedPrompt); // Update UI to show what's actually being used

    try {
      const urls: string[] = [];
      
      // Perform generations sequentially to avoid "Queue full" (Rate Limit) errors
      for (let i = 0; i < batchSize; i++) {
        const seed = Math.floor(Math.random() * 1000000);
        const url = await generateImage(optimizedPrompt, seed, model);
        
        urls.push(url);
        
        // Update images as they come so the user feels progress
        setGeneratedImages([...urls]);
        
        // Add a tiny delay between requests to be gentle to the API
        if (i < batchSize - 1) {
          await new Promise(resolve => setTimeout(resolve, 800));
        }
      }
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-12 lg:p-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1 mb-4"
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-gray-300">Next-Gen Parallel Creation</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-gray-500 tracking-tight"
          >
            Dream in Parallel
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-gray-400 max-w-2xl mx-auto"
          >
            Bypass single-generation limits. Create multiple variations of your vision simultaneously, enhanced by advanced prompt engineering.
          </motion.p>
        </div>

        {/* Control Center */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Card className="p-2 border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl shadow-purple-900/10">
            <form onSubmit={handleGenerate} className="flex flex-col md:flex-row gap-4 p-4">
              <div className="flex-1 relative">
                <Input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your imagination..."
                  className="h-14 pl-6 pr-32 text-lg bg-white/5 border-white/10 focus:border-purple-500/50 transition-all rounded-xl"
                />
                <Button
                  type="button" // Prevent form submission
                  onClick={handleEnhance}
                  variant="ghost"
                  className="absolute right-2 top-2 h-10 text-purple-400 hover:text-purple-300 hover:bg-purple-900/20"
                >
                  {enhanced ? <Sparkles className="w-4 h-4 mr-2" /> : <Wand2 className="w-4 h-4 mr-2" />}
                  {enhanced ? "Enhanced!" : "Enhance"}
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <select
                  value={model}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setModel(e.target.value)}
                  className="h-14 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-purple-500/50"
                  title="Select AI Model"
                >
                  <option value="nano-banana-pro" className="bg-black text-yellow-400 font-bold">★ Nano Banana Pro (Gemini 3)</option>
                  <option value="nano-banana" className="bg-black">Nano Banana (Gemini 2.5)</option>
                  <option value="flux" className="bg-black">Flux (Best)</option>
                  <option value="turbo" className="bg-black">Turbo (Fast)</option>
                  <option value="midjourney" className="bg-black">Artistic</option>
                  <option value="sdxl" className="bg-black">Stable Diffusion</option>
                </select>

                <select
                  value={style}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStyle(e.target.value)}
                  className="h-14 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-purple-500/50"
                  title="Select Enhancement Style"
                >
                  <option value="cinematic" className="bg-black">Cinematic (Default)</option>
                  <option value="artistic" className="bg-black">Artistic / Digital</option>
                  <option value="atmospheric" className="bg-black">Atmospheric / Light</option>
                  <option value="complex" className="bg-black">Complex / Detailed</option>
                  <option value="food" className="bg-black">Food / Culinary</option>
                  <option value="materials" className="bg-black">Materials / Textures</option>
                  <option value="interior" className="bg-black">Interior Design</option>
                  <option value="character" className="bg-black">Characters</option>
                  <option value="fantasy" className="bg-black">Fantasy / Creatures</option>
                  <option value="vintage" className="bg-black">Vintage / Film</option>
                  <option value="macro" className="bg-black">Macro / Micro</option>
                  <option value="physics" className="bg-black">Physics / Elemental</option>
                  <option value="architecture" className="bg-black">Architecture</option>
                  <option value="random" className="bg-black">Random Style</option>
                </select>

                <select
                  value={batchSize}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setBatchSize(Number(e.target.value))}
                  className="h-14 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-purple-500/50"
                  title="Select Batch Size"
                >
                  <option value={1} className="bg-black">1 Image</option>
                  <option value={2} className="bg-black">2 Images</option>
                  <option value={4} className="bg-black">4 Images</option>
                  <option value={8} className="bg-black">8 Images</option>
                </select>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isGenerating || !prompt}
                  className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 rounded-xl"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-5 h-5 mr-2" />
                      Generate
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {isGenerating ? (
              // Loading Skeletons
              Array.from({ length: batchSize }).map((_, i) => (
                <motion.div
                  key={`skeleton-${i}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="aspect-square rounded-2xl bg-white/5 animate-pulse border border-white/10 flex items-center justify-center p-8"
                >
                  <div className="text-center text-gray-500">
                    <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin opacity-50" />
                    <span className="text-xs tracking-widest uppercase">Rendering</span>
                  </div>
                </motion.div>
              ))
            ) : (
              // Generated Images
              generatedImages.map((src: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-black/50"
                >
                  <img
                    src={src}
                    alt={`Generated ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />

                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-sm">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="rounded-full bg-white/10 hover:bg-white/20 text-white border-0"
                      onClick={() => window.open(src, '_blank')}
                    >
                      <Download className="w-5 h-5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="rounded-full bg-white/10 hover:bg-white/20 text-white border-0"
                      onClick={() => navigator.clipboard.writeText(prompt)}
                    >
                      <Copy className="w-5 h-5" />
                    </Button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Placeholder/Empty State */}
        {!isGenerating && generatedImages.length === 0 && (
          <div className="text-center py-20 opacity-50">
            <div className="w-24 h-24 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-6">
              <Wand2 className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-400">Enter a prompt above to start creating.</p>
          </div>
        )}
      </div>
    </main>
  );
}
