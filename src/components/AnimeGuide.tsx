import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Star, Heart, Sparkles } from 'lucide-react';

interface AnimeGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const AnimeGuide = ({ isOpen, onClose }: AnimeGuideProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const guideSteps = [
    {
      title: "Karakter Tasarımı Temelleri",
      content: "Temel şekillerle ve oranlarla başlayın. Anime karakterleri genellikle büyük gözlere, küçük burunlara ve etkileyici özelliklere sahiptir.",
      icon: <Star className="w-6 h-6" />
    },
    {
      title: "Renk Paleti",
      content: "Uyumlu bir renk şeması seçin. Mor ve pembe tonlar kozmik temalar için iyi çalışır, kontrast için camgöbeği vurgular kullanın.",
      icon: <Heart className="w-6 h-6" />
    },
    {
      title: "Işıklandırma ve Efektler",
      content: "O kozmik anime estetiğini yaratmak için ruhani parıltı efektleri, yıldız parçacıkları ve atmosferik ışıklandırma ekleyin.",
      icon: <Sparkles className="w-6 h-6" />
    },
    {
      title: "Son Rötuşlar",
      content: "Anime kızınızı hayata geçirmek için akan saçlar, kozmik arka planlar ve özel efektler gibi detaylar ekleyin.",
      icon: <Star className="w-6 h-6" />
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <Card className="w-full max-w-2xl bg-gradient-card border-anime-purple cosmic-glow">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold anime-title">Anime Prodüksiyon Kılavuzu</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-6 h-6" />
            </Button>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              {guideSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentStep
                      ? 'bg-anime-purple shadow-glow'
                      : index < currentStep
                      ? 'bg-anime-pink'
                      : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-full bg-anime-purple/20 border border-anime-purple">
                  {guideSteps[currentStep].icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  {guideSteps[currentStep].title}
                </h3>
              </div>
              
              <p className="text-muted-foreground leading-relaxed">
                {guideSteps[currentStep].content}
              </p>
            </div>

            <div className="flex justify-between pt-4">
              <Button
                variant="secondary"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
              >
                Önceki
              </Button>
              
              <Button
                className="btn-cosmic"
                onClick={() => {
                  if (currentStep < guideSteps.length - 1) {
                    setCurrentStep(currentStep + 1);
                  } else {
                    onClose();
                  }
                }}
              >
                {currentStep === guideSteps.length - 1 ? 'Tamamla' : 'Sonraki'}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AnimeGuide;