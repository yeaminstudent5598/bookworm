"use client";
import { useEffect, useState } from "react";

export default function TutorialsPage() {
  const [tutorials, setTutorials] = useState([]);

  useEffect(() => {
    const fetchTutorials = async () => {
      const res = await fetch("/api/v1/tutorials");
      const data = await res.json();
      if (data.success) setTutorials(data.data);
    };
    fetchTutorials();
  }, []);

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-serif font-bold text-[#5c4033]">Knowledge Library</h1>
        <p className="text-[#8b5e3c] mt-2 italic">Expand your reading horizons with our curated book guides.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tutorials.map((video: any) => (
          <div key={video._id} className="bg-white rounded-2xl overflow-hidden border border-[#e5d9c1] shadow-sm hover:shadow-md transition-shadow">
            <div className="aspect-video">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${video.videoUrl.split('v=')[1]}`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-[#5c4033] text-lg">{video.title}</h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{video.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}