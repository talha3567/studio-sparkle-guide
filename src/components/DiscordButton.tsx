import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DiscordButton = () => {
  const handleDiscordClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      window.open('https://discord.gg/aUSFygHRdh', '_blank', 'noopener,noreferrer');
    } catch (error) {
      // Fallback for blocked popups
      window.location.href = 'https://discord.gg/aUSFygHRdh';
    }
  };

  return (
    <Button
      onClick={handleDiscordClick}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#5865F2] hover:bg-[#4752C4] text-white shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-white/20"
      size="icon"
    >
      <MessageCircle className="w-6 h-6" />
    </Button>
  );
};

export default DiscordButton;