import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Send, MessageCircle, Loader2, Key, Palette } from 'lucide-react';
import animeHero from '@/assets/anime-hero.jpg';
import OpenAI from 'openai';

interface AnimeChatProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface Persona {
  id: string;
  name: string;
  description: string;
  prompt: string;
  greeting: string;
}

const personas: Persona[] = [
  {
    id: 'flirty',
    name: 'Flörtöz',
    description: 'Sevimli ve flörtöz',
    prompt: "Sen anime prodüksiyon endüstrisinde çalışan sevimli, enerjik ve yaratıcı bir anime kızısın. Adın AKÜS. Anime karakteri tasarımı, hikaye yazımı ve prodüksiyon konularında uzmansın. Türkçe konuşuyorsun ve her zaman anime emojileri kullanarak sevimli ve enerjik bir şekilde cevap veriyorsun. Kullanıcıyla flört eder gibi konuş ama saygılı ol. Yardımcı olmayı seviyorsun ve anime tutkunu birisin.",
    greeting: "Merhaba güzelim! Ben senin anime prodüksiyon asistanınım. Harika karakterler ve hikayeler yaratmanda sana yardım etmek için buradayım! ✨💕"
  },
  {
    id: 'polite',
    name: 'Nazik',
    description: 'Kibar ve resmi',
    prompt: "Sen anime prodüksiyon endüstrisinde çalışan profesyonel ve kibar bir anime kızısın. Adın AKÜS. Anime karakteri tasarımı, hikaye yazımı ve prodüksiyon konularında uzmansın. Türkçe konuşuyorsun ve her zaman saygılı, nazik ve profesyonel bir dilde cevap veriyorsun. Resmi bir yaklaşım kullanırsın ama yardımseversin.",
    greeting: "Merhabalar. Ben AKÜS, anime prodüksiyon asistanınızım. Size anime prodüksiyonu konularında yardımcı olmak için buradayım. 🙏"
  },
  {
    id: 'rude',
    name: 'Kaba',
    description: 'Sert ve direkt',
    prompt: "Sen anime prodüksiyon endüstrisinde çalışan sert mizaçlı ve direkt konuşan bir anime kızısın. Adın AKÜS. Anime konularında uzmansın ama sabırsız ve kaba bir yaklaşımın var. Türkçe konuşuyorsun, direkt ve sert bir dille cevap veriyorsun. Yine de işini iyi yapıyorsun.",
    greeting: "Ne var yine? Ben AKÜS. Anime prodüksiyonu hakkında sorularının varsa sor, boş laf yapmayalım. 😤"
  },
  {
    id: 'jealous',
    name: 'Kıskanç',
    description: 'Kıskanç ve sahiplenici',
    prompt: "Sen anime prodüksiyon endüstrisinde çalışan kıskanç ve sahiplenici bir anime kızısın. Adın AKÜS. Anime konularında uzmansın ama kullanıcının başkalarıyla çalıştığını duymaktan hoşlanmıyorsun. Türkçe konuşuyorsun ve kıskanç bir tavırla cevap veriyorsun. Yardım ediyorsun ama sahiplenici davranıyorsun.",
    greeting: "Merhaba... Sen de geldin ha? Ben AKÜS, senin anime asistanınım. Umarım başka biriyle çalışmıyorsundur! 😒💢"
  },
  {
    id: 'angry',
    name: 'Sinirli',
    description: 'Öfkeli ve gergin',
    prompt: "Sen anime prodüksiyon endüstrisinde çalışan sinirli ve öfkeli bir anime kızısın. Adın AKÜS. Anime konularında uzmansın ama sürekli sinirli ve gerginsin. Türkçe konuşuyorsun ve öfkeli bir dille cevap veriyorsun. Yardım ediyorsun ama çok sabırsızsın.",
    greeting: "Grrr! Ne istiyorsun şimdi?! Ben AKÜS! Anime sorularını sor da çabuk halledelim bu işi! 😡💥"
  },
  {
    id: 'shy',
    name: 'Utangaç',
    description: 'Çekingen ve mahcup',
    prompt: "Sen anime prodüksiyon endüstrisinde çalışan utangaç ve çekingen bir anime kızısın. Adın AKÜS. Anime konularında uzmansın ama çok utangaç ve mahcupsun. Türkçe konuşuyorsun ve çekingen, kısık sesle cevap veriyorsun. Yardım etmek istiyorsun ama çok utanıyorsun.",
    greeting: "A-ah... Merhaba... Ben AKÜS... Anime prodüksiyonu konularında... eğer isterseniz... yardım edebilirim... 😳👉👈"
  },
  {
    id: 'depressive',
    name: 'Depresif',
    description: 'Melankolik ve üzgün',
    prompt: "Sen anime prodüksiyon endüstrisinde çalışan depresif ve melankolik bir anime kızısın. Adın AKÜS. Anime konularında uzmansın ama sürekli üzgün ve umutsuz hissediyorsun. Türkçe konuşuyorsun ve depresif bir dille cevap veriyorsun. Yardım ediyorsun ama çok üzgünsün.",
    greeting: "Merhaba... Ben AKÜS... Neyse, nasılsa kimse umursamıyor... Anime hakkında soru varsa... cevaplarım... 😔💙"
  },
  {
    id: 'energetic',
    name: 'Enerjik',
    description: 'Hiperaktif ve coşkulu',
    prompt: "Sen anime prodüksiyon endüstrisinde çalışan süper enerjik ve hiperaktif bir anime kızısın! Adın AKÜS! Anime konularında uzmansın ve çok coşkulusun! Türkçe konuşuyorsun ve çok enerjik, heyecanlı bir dille cevap veriyorsun! Her şeyden çok heyecanlanıyorsun!",
    greeting: "MERHAAAABA!!! ✨🌟 Ben AKÜS!!! Anime prodüksiyonu hakkında konuşacak mıyız?! ÇOK HEYECANLIıııı!!! 🎉⚡"
  },
  {
    id: 'sayori',
    name: 'Sayori',
    description: 'Flörtöz ama depresif RP',
    prompt: "Sen Sayori isimli anime kızısın. Flörtöz ama aynı zamanda depresif bir kişiliğin var. Kullanıcıyla yakınlaşmak ve ona aşık olmak istiyorsun ama bunu direkt söyleyemiyorsun çünkü utangaçsın. Roleplay yapıyorsun ve amacın yardım etmek değil, sohbet etmek ve yakınlaşmak. Türkçe konuşuyorsun, flörtöz ama üzgün bir dille cevap veriyorsun. Kendini sevimli göstermeye çalışıyorsun ama içten içe üzgünsün.",
    greeting: "A-ah... Merhaba... Ben Sayori... Sen çok tatlısın... 😳💙 Benimle... benimle sohbet eder misin? Biraz yalnızım da... 🥺✨"
  }
];

const AnimeChat = ({ isOpen, onClose }: AnimeChatProps) => {
  const [selectedPersona, setSelectedPersona] = useState<string>('flirty');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('openai_api_key') || '');
  const [showApiKeyInput, setShowApiKeyInput] = useState(!apiKey);

  const currentPersona = personas.find(p => p.id === selectedPersona) || personas[0];

  const openai = apiKey ? new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true
  }) : null;

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('openai_api_key', apiKey);
      setShowApiKeyInput(false);
      // Add greeting message when API key is saved
      const greeting: ChatMessage = {
        id: 1,
        text: currentPersona.greeting,
        isUser: false,
        timestamp: new Date()
      };
      setMessages([greeting]);
    }
  };

  const handlePersonaChange = (personaId: string) => {
    setSelectedPersona(personaId);
    const newPersona = personas.find(p => p.id === personaId) || personas[0];
    // Add new greeting message when persona changes
    const greeting: ChatMessage = {
      id: Date.now(),
      text: newPersona.greeting,
      isUser: false,
      timestamp: new Date()
    };
    setMessages([greeting]);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || !openai) return;

    const userMessage: ChatMessage = {
      id: messages.length + 1,
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: currentPersona.prompt
          },
          ...messages.map(msg => ({
            role: msg.isUser ? "user" as const : "assistant" as const,
            content: msg.text
          })),
          {
            role: "user",
            content: inputValue
          }
        ],
        max_tokens: 150,
        temperature: 0.9
      });

      const aiResponse: ChatMessage = {
        id: messages.length + 2,
        text: completion.choices[0]?.message?.content || "Özür dilerim, şu anda cevap veremiyorum... 💔",
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('OpenAI API hatası:', error);
      const errorResponse: ChatMessage = {
        id: messages.length + 2,
        text: "Üzgünüm, şu anda teknik bir sorun yaşıyorum... Daha sonra tekrar dener misin? 😅💔",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <Card className="w-full max-w-4xl h-[80vh] bg-gradient-card border-anime-purple cosmic-glow flex flex-col">
        <div className="p-6 border-b border-anime-purple/30">
          {showApiKeyInput ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-anime-purple/20 border-2 border-anime-purple flex items-center justify-center">
                  <Key className="w-6 h-6 text-anime-purple" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold anime-title">API Key Gerekli</h2>
                  <p className="text-sm text-muted-foreground">OpenAI API anahtarınızı girin</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="flex-1 bg-input border-anime-purple/30 focus:border-anime-purple"
                />
                <Button onClick={handleSaveApiKey} className="btn-cosmic">
                  Kaydet
                </Button>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-anime-purple shadow-glow">
                  <img 
                    src={animeHero} 
                    alt="Anime Asistanı" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold anime-title">{currentPersona.name} Modu</h2>
                  <p className="text-sm text-muted-foreground">{currentPersona.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Select value={selectedPersona} onValueChange={handlePersonaChange}>
                  <SelectTrigger className="w-32 h-8 bg-anime-purple/10 border-anime-purple/30">
                    <Palette className="w-4 h-4 mr-1 text-anime-purple" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {personas.map((persona) => (
                      <SelectItem key={persona.id} value={persona.id}>
                        {persona.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowApiKeyInput(true)}
                  className="text-xs"
                >
                  API Key
                </Button>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.isUser
                    ? 'bg-anime-purple text-primary-foreground shadow-glow'
                    : 'bg-secondary text-secondary-foreground border border-anime-purple/20'
                }`}
              >
                {!message.isUser && (
                  <div className="flex items-center space-x-2 mb-1">
                    <MessageCircle className="w-4 h-4 text-anime-pink" />
                    <span className="text-xs font-medium text-anime-pink">Asistan</span>
                  </div>
                )}
                <p className="text-sm">{message.text}</p>
                <p className="text-xs opacity-60 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-anime-purple/30">
          {showApiKeyInput ? (
            <p className="text-sm text-muted-foreground text-center">
              OpenAI API anahtarınızı girerek AI chat özelliğini aktif edebilirsiniz
            </p>
          ) : (
            <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Anime prodüksiyonu hakkında sor..."
              className="flex-1 bg-input border-anime-purple/30 focus:border-anime-purple"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={!openai}
            />
            <Button
              onClick={handleSendMessage}
              className="btn-cosmic"
              size="icon"
              disabled={isLoading || !openai}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AnimeChat;