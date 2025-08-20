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
      content: "Anime karakteri tasarımına temel anatomik yapıyla başlayın. Klasik anime proportions: Kafanın 7-8 boy uzunluğunda olması, gözlerin yüzün üçte birini kaplaması, büyük ve ifadeli gözler, küçük burun ve ağız. Karakterinizin yaşına göre bu oranları ayarlayın. Çocuk karakterler için daha büyük kafa oranı, yetişkinler için daha uzun boy kullanın. Temel geometric şekillerle (daire, oval, üçgen) başlayıp detaylandırın.",
      icon: <Star className="w-6 h-6" />
    },
    {
      title: "Karakter Kişiliği ve Konsept",
      content: "Karakterinizin kişiliğini önce belirleyin çünkü bu tüm tasarımı etkileyecek. Utangaç mı, güçlü mü, gizemli mi? Bu kişilik özellikleri yüz ifadesi, duruş, kıyafet seçimi ve renk paletine yansımalı. Tsundere, kuudere, dandere gibi anime arketiplerinden ilham alabilirsiniz. Karakterin hikayesini, geçmişini ve motivasyonlarını düşünün. Bu detaylar tasarımda görülecek.",
      icon: <Heart className="w-6 h-6" />
    },
    {
      title: "Renk Paleti ve Stil",
      content: "Uyumlu bir renk şeması oluşturun. Cosmic/space teması için mor, pembe, mavi tonlar harika çalışır. Ana renk, tamamlayıcı renk ve vurgu rengi seçin. Karakterin saç, göz, deri ve kıyafet renklerini bu paletten seçin. Sıcak renkler (kırmızı, turuncu) enerjik karakterler için, soğuk renkler (mavi, mor) gizemli karakterler için uygun. Kontrast yaratmak için camgöbeği, altın gibi vurgu renkler kullanın.",
      icon: <Sparkles className="w-6 h-6" />
    },
    {
      title: "Saç Tasarımı ve Anatomi",
      content: "Anime saçları karakterin kimliğinin büyük kısmıdır. Saçın doğal akış yönünü takip edin ama anime stilinde abartarak stilize edin. Farklı saç tipleri: straight, wavy, curly, spiky. Uzunluk seçimi önemli: kısa saç (pixie cut, bob), orta boy (omuz hizası), uzun saç (bele kadar). Saç aksesuarları karaktere kişilik katar: kurdele, taç, çiçek, klips. Saçın hacmi ve katmanları da anime estetiğinin anahtarıdır.",
      icon: <Star className="w-6 h-6" />
    },
    {
      title: "Göz Tasarımı ve İfade",
      content: "Anime gözleri karakter tasarımının kalbidir. Göz şekilleri: yuvarlak (masum), badem (olgun), kedi gözü (gizemli), büyük göz (çocuksu). Iris detayları, göz bebeği yansımaları, kirpik kalınlığı önemli. Farklı duygular için göz ifadeleri: mutluluk (kapalı gözler), üzüntü (aşağı bakan), öfke (keskin bakış), utanma (yan bakış). Göz rengi karakterin kişiliğini yansıtmalı: mavi (sakin), yeşil (gizemli), kırmızı (tutkulu), mor (kozmik).",
      icon: <Heart className="w-6 h-6" />
    },
    {
      title: "Kıyafet ve Aksesuar Tasarımı",
      content: "Karakterin yaşam tarzını ve kişiliğini yansıtan kıyafetler seçin. Okul üniforması, casual kıyafetler, fantastik kostümler, futuristik giysiler gibi seçenekler var. Kıyafet katmanlarını düşünün: iç giyim, üst giyim, dış giyim, aksesuarlar. Renk uyumu çok önemli. Aksesuarlar karakteri tamamlar: çanta, mücevher, şapka, eldiven, çorap, ayakkabı. Kumaş türlerini de düşünün: ipek, pamuk, deri, metal gibi.",
      icon: <Sparkles className="w-6 h-6" />
    },
    {
      title: "Işıklandırma ve Gölgelendirme",
      content: "Anime cell shading tekniğini kullanın. Işık kaynağını belirleyin (genellikle üstten). Hard shadows yerine soft transition kullanın. Ana ışık, dolgu ışığı ve rim lighting (kenar ışığı) tekniklerini öğrenin. Saçlarda, yüzde ve kıyafetlerde gölge yerleşimi önemli. Reflected light (yansıyan ışık) ile objeler arası etkileşim gösterin. Cosmic teması için parlak yıldız ışıkları, aura efektleri ekleyin.",
      icon: <Star className="w-6 h-6" />
    },
    {
      title: "Özel Efektler ve Son Rötuşlar",
      content: "Karakterinizi özel kılan son detayları ekleyin. Particle effects: yıldız parçacıkları, ışık tanecikleri, magic sparkles. Atmospheric effects: sis, ışık huzmesi, aura. Hair flow ve wind effects ile dinamizm katın. Background elements ile karakter arasında uyum sağlayın. Post-processing effects: glow, bloom, color grading. Signature style elements ekleyin ki karakteriniz tanınabilir olsun. Son olarak tüm kompozisyonu gözden geçirin ve gerekli düzeltmeleri yapın.",
      icon: <Sparkles className="w-6 h-6" />
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