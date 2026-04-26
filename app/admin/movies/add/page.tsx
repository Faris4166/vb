"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Save, 
  Film, 
  Type, 
  Calendar, 
  Image as ImageIcon, 
  Video,
  ListVideo,
  Coins,
  Lock,
  Upload, 
  FileVideo, 
  FileImage, 
  Loader2,
  CheckCircle2,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";

export default function AddMoviePage() {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [type, setType] = useState<"movie" | "series">("movie");
  
  // Files State
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    year: "2024",
    genre: "Action",
    is_premium: false,
    price_coins: 0,
  });

  const [episodes, setEpisodes] = useState<any[]>([
    { title: "ตอนที่ 1", description: "", price_coins: 0, file: null, preview: null }
  ]);

  const supabase = createClient();
  const router = useRouter();

  // Create Preview when files change
  useEffect(() => {
    if (posterFile) {
      const url = URL.createObjectURL(posterFile);
      setPosterPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPosterPreview(null);
    }
  }, [posterFile]);

  useEffect(() => {
    if (logoFile) {
      const url = URL.createObjectURL(logoFile);
      setLogoPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setLogoPreview(null);
    }
  }, [logoFile]);

  const uploadFile = async (file: File, folder: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('movies')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('movies')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleAddEpisode = () => {
    setEpisodes([...episodes, { 
      title: `ตอนที่ ${episodes.length + 1}`, 
      description: "", 
      price_coins: 0,
      file: null,
      preview: null
    }]);
  };

  const handleRemoveEpisode = (index: number) => {
    setEpisodes(episodes.filter((_, i) => i !== index));
  };

  const handleEpisodeChange = (index: number, field: string, value: any) => {
    const newEpisodes = [...episodes];
    newEpisodes[index][field] = value;
    setEpisodes(newEpisodes);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!posterFile) return alert("กรุณาอัปโหลดรูปหน้าปก");
    if (type === "movie" && !videoFile) return alert("กรุณาอัปโหลดไฟล์วิดีโอ");

    setLoading(true);
    setUploading(true);

    try {
      // 1. Upload Files
      const finalImageUrl = await uploadFile(posterFile, 'posters');
      let finalLogoUrl = "";
      if (logoFile) finalLogoUrl = await uploadFile(logoFile, 'logos');
      
      let finalVideoUrl = "";
      if (videoFile && type === "movie") {
        finalVideoUrl = await uploadFile(videoFile, 'videos');
      }

      // 2. Insert Movie
      const { data: movie, error: movieError } = await supabase
        .from('movies')
        .insert([{ 
          ...formData, 
          image_url: finalImageUrl, 
          title_logo_url: finalLogoUrl,
          video_url: finalVideoUrl,
          type 
        }])
        .select()
        .single();

      if (movieError) throw movieError;

      // 3. Handle Episodes
      if (type === "series" && episodes.length > 0) {
        const episodesToInsert = [];
        for (const ep of episodes) {
          if (!ep.file) continue;
          const epVideoUrl = await uploadFile(ep.file, 'episodes');
          episodesToInsert.push({
            movie_id: movie.id,
            title: ep.title,
            video_url: epVideoUrl,
            price_coins: ep.price_coins
          });
        }
        if (episodesToInsert.length > 0) {
          const { error: epError } = await supabase.from('episodes').insert(episodesToInsert);
          if (epError) throw epError;
        }
      }

      alert("บันทึกเนื้อหาสำเร็จ!");
      router.push("/admin/movies");
    } catch (error: any) {
      alert("เกิดข้อผิดพลาด: " + error.message);
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 pb-32">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <Link href="/admin/movies" className="text-gray-500 hover:text-white flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-2 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to Movies
            </Link>
            <h1 className="text-3xl font-black tracking-tighter uppercase italic">เพิ่มเนื้อหาใหม่</h1>
          </div>
          <Badge className="bg-yellow-400 text-black font-black px-4 py-1">UPLOAD MODE</Badge>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Type Selection */}
          <div className="grid grid-cols-2 bg-white/5 p-1 rounded-2xl border border-white/5 overflow-hidden">
             <button 
               type="button" 
               onClick={() => setType("movie")}
               className={`py-4 flex items-center justify-center gap-2 font-black uppercase tracking-widest text-xs transition-all ${type === 'movie' ? 'bg-white/10 text-yellow-400' : 'text-gray-500 hover:text-white'}`}
             >
               <Film className="h-4 w-4" /> Movie
             </button>
             <button 
               type="button" 
               onClick={() => setType("series")}
               className={`py-4 flex items-center justify-center gap-2 font-black uppercase tracking-widest text-xs transition-all ${type === 'series' ? 'bg-white/10 text-blue-400' : 'text-gray-500 hover:text-white'}`}
             >
               <ListVideo className="h-4 w-4" /> Series
             </button>
          </div>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="bg-white/5 border border-white/5 p-1 rounded-xl mb-8">
              <TabsTrigger value="basic" className="rounded-lg font-bold px-8">1. ข้อมูลพื้นฐาน</TabsTrigger>
              <TabsTrigger value="media" className="rounded-lg font-bold px-8">2. อัปโหลดสื่อ</TabsTrigger>
              {type === "series" && <TabsTrigger value="episodes" className="rounded-lg font-bold px-8">3. ตอนทั้งหมด ({episodes.length})</TabsTrigger>}
            </TabsList>

            <TabsContent value="basic" className="space-y-6 animate-in fade-in duration-500">
              <Card className="bg-zinc-900/40 border-white/5 border-0 shadow-2xl">
                <CardContent className="p-8 space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <Label className="text-xs font-black uppercase text-gray-500">ชื่อเรื่อง</Label>
                        <Input 
                          placeholder="ชื่อหนังหรือซีรีส์" 
                          required
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          className="bg-black/40 border-white/10 h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-black uppercase text-gray-500">คำโปรย (Subtitle)</Label>
                        <Input 
                          placeholder="คำอธิบายสั้นๆ" 
                          value={formData.subtitle}
                          onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                          className="bg-black/40 border-white/10 h-12"
                        />
                      </div>
                   </div>

                   <div className="space-y-2">
                      <Label className="text-xs font-black uppercase text-gray-500">เรื่องย่อ</Label>
                      <Textarea 
                        placeholder="เล่าเรื่องราวคร่าวๆ ของเนื้อหาเรื่องนี้..." 
                        className="min-h-[150px] bg-black/40 border-white/10"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                      />
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="space-y-2">
                        <Label className="text-xs font-black uppercase text-gray-500">ปีที่ฉาย</Label>
                        <Input value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} className="bg-black/40 border-white/10" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-black uppercase text-gray-500">หมวดหมู่ (Genre)</Label>
                        <Input value={formData.genre} onChange={(e) => setFormData({...formData, genre: e.target.value})} className="bg-black/40 border-white/10" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-black uppercase text-yellow-400">ราคาเหรียญ (0 = ดูฟรี)</Label>
                        <div className="relative">
                           <Coins className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-yellow-400" />
                           <Input 
                             type="number" 
                             value={formData.price_coins} 
                             onChange={(e) => {
                               const val = parseInt(e.target.value) || 0;
                               setFormData({...formData, price_coins: val, is_premium: val > 0});
                             }} 
                             className="bg-yellow-400/5 border-yellow-400/20 pl-10 text-yellow-400 font-black h-10" 
                           />
                        </div>
                      </div>
                   </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="media" className="space-y-6 animate-in fade-in duration-500">
               <Card className="bg-zinc-900/40 border-white/5 border-0 shadow-2xl">
                  <CardContent className="p-8 space-y-12">
                     
                     {/* Poster Upload */}
                     <div className="space-y-4">
                        <Label className="flex items-center gap-2 text-yellow-400 font-black italic uppercase tracking-widest text-sm">
                           <FileImage className="h-4 w-4" /> 1. รูปหน้าปก (Poster)
                        </Label>
                        <div className="flex flex-col md:flex-row gap-6">
                           <div className="flex-1">
                              <div className="relative group h-48 border-2 border-dashed border-white/10 rounded-2xl bg-white/5 hover:border-yellow-400/50 transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden">
                                 {posterPreview ? (
                                    <>
                                       <img src={posterPreview} className="absolute inset-0 w-full h-full object-cover opacity-40" />
                                       <div className="relative z-10 flex flex-col items-center">
                                          <CheckCircle2 className="h-10 w-10 text-green-500 mb-2" />
                                          <span className="text-[10px] font-black uppercase bg-black/60 px-3 py-1 rounded-full">{posterFile?.name}</span>
                                       </div>
                                       <button onClick={(e) => { e.stopPropagation(); setPosterFile(null); }} className="absolute top-2 right-2 z-20 h-6 w-6 bg-red-500 rounded-full flex items-center justify-center">
                                          <X className="h-3 w-3" />
                                       </button>
                                    </>
                                 ) : (
                                    <>
                                       <input type="file" accept="image/*" onChange={(e) => setPosterFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                       <Upload className="h-10 w-10 text-gray-600 group-hover:text-yellow-400 mb-2 transition-colors" />
                                       <p className="text-[10px] font-black uppercase text-gray-500">คลิกเพื่ออัปโหลดไฟล์รูปภาพ</p>
                                    </>
                                 )}
                              </div>
                           </div>
                           {posterPreview && (
                              <div className="w-32 h-48 rounded-2xl overflow-hidden border border-white/10 bg-black flex-shrink-0">
                                 <img src={posterPreview} className="w-full h-full object-cover" />
                              </div>
                           )}
                        </div>
                     </div>

                     {/* Logo Upload */}
                     <div className="space-y-4">
                        <Label className="flex items-center gap-2 text-blue-400 font-black italic uppercase tracking-widest text-sm">
                           <ImageIcon className="h-4 w-4" /> 2. โลโก้เรื่อง (Logo - PNG โปร่งใส)
                        </Label>
                        <div className="flex flex-col md:flex-row gap-6">
                           <div className="flex-1">
                              <div className="relative group h-32 border-2 border-dashed border-white/10 rounded-2xl bg-white/5 hover:border-blue-400/50 transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden">
                                 {logoPreview ? (
                                    <>
                                       <img src={logoPreview} className="absolute inset-0 w-full h-full object-contain p-4 opacity-40" />
                                       <div className="relative z-10 flex flex-col items-center">
                                          <CheckCircle2 className="h-8 w-8 text-green-500 mb-1" />
                                          <span className="text-[10px] font-black uppercase bg-black/60 px-3 py-1 rounded-full">{logoFile?.name}</span>
                                       </div>
                                       <button onClick={(e) => { e.stopPropagation(); setLogoFile(null); }} className="absolute top-2 right-2 z-20 h-6 w-6 bg-red-500 rounded-full flex items-center justify-center">
                                          <X className="h-3 w-3" />
                                       </button>
                                    </>
                                 ) : (
                                    <>
                                       <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                       <Upload className="h-8 w-8 text-gray-600 group-hover:text-blue-400 mb-2 transition-colors" />
                                       <p className="text-[10px] font-black uppercase text-gray-500">คลิกเพื่ออัปโหลดโลโก้</p>
                                    </>
                                 )}
                              </div>
                           </div>
                           {logoPreview && (
                              <div className="w-32 h-32 rounded-2xl overflow-hidden border border-white/10 bg-black flex items-center justify-center p-4 flex-shrink-0">
                                 <img src={logoPreview} className="max-w-full max-h-full object-contain" />
                              </div>
                           )}
                        </div>
                     </div>

                     {/* Video Upload */}
                     {type === "movie" && (
                        <div className="space-y-4">
                           <Label className="flex items-center gap-2 text-white font-black italic uppercase tracking-widest text-sm">
                              <FileVideo className="h-4 w-4" /> 3. ไฟล์วิดีโอหลัก (Main Video)
                           </Label>
                           <div className="relative group h-40 border-2 border-dashed border-white/10 rounded-2xl bg-white/5 hover:border-white transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden">
                              {videoFile ? (
                                 <div className="flex flex-col items-center">
                                    <Video className="h-10 w-10 text-green-500 mb-2" />
                                    <span className="text-xs font-black uppercase">{videoFile.name}</span>
                                    <span className="text-[10px] text-gray-500 mt-1">{(videoFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                                    <button onClick={() => setVideoFile(null)} className="mt-4 text-[10px] font-black text-red-500 uppercase">ลบไฟล์เพื่อเลือกใหม่</button>
                                 </div>
                              ) : (
                                 <>
                                    <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                    <Upload className="h-10 w-10 text-gray-600 group-hover:text-white mb-2 transition-colors" />
                                    <p className="text-[10px] font-black uppercase text-gray-500">คลิกเพื่ออัปโหลดไฟล์วิดีโอ (.mp4, .mkv)</p>
                                 </>
                              )}
                           </div>
                        </div>
                     )}

                  </CardContent>
               </Card>
            </TabsContent>

            {type === "series" && (
               <TabsContent value="episodes" className="space-y-6 animate-in fade-in duration-500">
                  <div className="space-y-4">
                     {episodes.map((ep, index) => (
                        <Card key={index} className="bg-zinc-900/40 border-white/5 border-0 shadow-2xl relative overflow-hidden">
                           <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                           <CardHeader className="flex flex-row items-center justify-between pb-2">
                             <CardTitle className="text-sm font-black text-blue-400 uppercase italic">Episode {index + 1}</CardTitle>
                             <button onClick={() => handleRemoveEpisode(index)} className="text-gray-500 hover:text-red-500 transition-colors">
                                <Trash2 className="h-4 w-4" />
                             </button>
                           </CardHeader>
                           <CardContent className="space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase text-gray-500">ชื่อตอน</Label>
                                    <Input value={ep.title} onChange={(e) => handleEpisodeChange(index, 'title', e.target.value)} className="bg-black/40 border-white/10" />
                                 </div>
                                 <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase text-yellow-400">ราคาเหรียญของตอนนี้</Label>
                                    <Input type="number" value={ep.price_coins} onChange={(e) => handleEpisodeChange(index, 'price_coins', parseInt(e.target.value) || 0)} className="bg-yellow-400/5 border-yellow-400/20 text-yellow-400 font-black" />
                                 </div>
                              </div>
                              <div className="space-y-2">
                                 <Label className="text-[10px] font-black uppercase text-gray-500">อัปโหลดไฟล์วิดีโอของตอนที่ {index + 1}</Label>
                                 <div className="relative h-24 border-2 border-dashed border-white/10 rounded-xl bg-white/5 flex flex-col items-center justify-center hover:border-blue-400/50 transition-all cursor-pointer overflow-hidden">
                                    {ep.file ? (
                                       <div className="flex items-center gap-3">
                                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                                          <span className="text-xs font-black truncate max-w-[200px]">{ep.file.name}</span>
                                          <button onClick={() => handleEpisodeChange(index, 'file', null)} className="text-[10px] text-red-500 font-black uppercase">ลบ</button>
                                       </div>
                                    ) : (
                                       <>
                                          <input type="file" accept="video/*" onChange={(e) => handleEpisodeChange(index, 'file', e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                          <Upload className="h-6 w-6 text-gray-600 mb-1" />
                                          <p className="text-[10px] font-black uppercase text-gray-500">อัปโหลดวิดีโอ</p>
                                       </>
                                    )}
                                 </div>
                              </div>
                           </CardContent>
                        </Card>
                     ))}
                     <Button type="button" onClick={handleAddEpisode} variant="outline" className="w-full h-16 border-dashed border-white/10 hover:bg-white/5 rounded-2xl font-black italic uppercase">
                        <Plus className="h-4 w-4 mr-2" /> เพิ่มตอนถัดไป
                     </Button>
                  </div>
               </TabsContent>
            )}
          </Tabs>

          {/* Action Buttons */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/80 backdrop-blur-xl border-t border-white/5 z-50">
            <div className="max-w-4xl mx-auto flex items-center justify-end gap-4">
              <Link href="/admin/movies">
                <Button type="button" variant="ghost" disabled={loading} className="text-gray-400 font-bold">ยกเลิก</Button>
              </Link>
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-black px-12 rounded-xl h-14 min-w-[250px] shadow-2xl shadow-yellow-400/20"
              >
                {loading ? (
                   <div className="flex items-center gap-3">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>{uploading ? "กำลังอัปโหลดสื่อ..." : "กำลังบันทึก..."}</span>
                   </div>
                ) : (
                   <div className="flex items-center gap-2">
                      <Save className="h-5 w-5" />
                      <span>บันทึกและขึ้นระบบทันที</span>
                   </div>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
