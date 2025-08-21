import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, MessageCircle } from 'lucide-react';
import StarField from '@/components/StarField';
import AnimeGuide from '@/components/AnimeGuide';
import AnimeChat from '@/components/AnimeChat';
import DiscordButton from '@/components/DiscordButton';
import animeHero from '@/assets/anime-hero.jpg';

const Index = () => {
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <StarField />
      
      {/* Top Branding */}
      <div className="absolute top-0 left-0 right-0 z-10 p-8">
        <h1 className="text-4xl md:text-6xl font-bold text-center anime-title">
          AKÜS
        </h1>
        <p className="text-xl md:text-2xl text-center text-muted-foreground mt-2">
          Anime Kızı Üretim Sanayi
        </p>
      </div>

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center relative z-10">
        <div className="text-center space-y-12 px-4">
          {/* Hero Image */}
          <div className="relative">
            <div className="w-80 h-80 md:w-96 md:h-96 mx-auto rounded-3xl overflow-hidden border-4 border-anime-purple shadow-cosmic">
              <img 
                src={animeHero} 
                alt="Anime Prodüksiyon Kızı" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -inset-4 bg-gradient-button opacity-20 rounded-3xl blur-xl -z-10"></div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              variant="hero"
              onClick={() => setIsGuideOpen(true)}
              className="w-full sm:w-auto"
            >
              <BookOpen className="w-6 h-6 mr-2" />
              Kılavuzu Aç
            </Button>
            
            <Button
              variant="hero"
              onClick={() => setIsChatOpen(true)}
              className="w-full sm:w-auto"
            >
              <MessageCircle className="w-6 h-6 mr-2" />
              Flört Moduna Geç
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Branding */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-8">
        <h2 className="text-3xl md:text-5xl font-bold text-center anime-title">
          AKÜS
        </h2>
        <p className="text-lg md:text-xl text-center text-muted-foreground">
          Anime Kızı Üretim Sanayi
        </p>
      </div>

      {/* Modals */}
      <AnimeGuide isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <AnimeChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      
      {/* Discord Button */}
      <DiscordButton />
    </div>
  );
};

export default Index;
