export default function Footer() {
  return (
    <footer className="bg-[#fdfaf1] border-t border-[#e5d9c1] py-6 mt-10">
      <div className="container mx-auto text-center">
        <p className="text-[#5c4033] font-serif font-bold italic">BookWorm — Your Personal Cozy Library</p>
        <p className="text-[#8b5e3c] text-xs mt-2">© 2026 Yeamin Madbor. All Rights Reserved.</p>
        <div className="flex justify-center gap-4 mt-3 text-[#5c4033]">
           <span className="hover:underline cursor-pointer">Facebook</span>
           <span className="hover:underline cursor-pointer">Github</span>
           <span className="hover:underline cursor-pointer">LinkedIn</span>
        </div>
      </div>
    </footer>
  );
}