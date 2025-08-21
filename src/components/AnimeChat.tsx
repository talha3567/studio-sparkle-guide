import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Send, MessageCircle, Loader2, Key, Palette } from 'lucide-react';
import animeHero from '@/assets/anime-hero.jpg';
import animeGirl1 from '@/assets/anime-girl-1.jpg';
import animeGirl2 from '@/assets/anime-girl-2.jpg';
import animeGirl3 from '@/assets/anime-girl-3.jpg';
import animeGirl4 from '@/assets/anime-girl-4.jpg';
import animeGirl5 from '@/assets/anime-girl-5.jpg';
import animeGirl6 from '@/assets/anime-girl-6.jpg';
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
  avatar: string;
}

const personas: Persona[] = [
  {
    id: 'sayori',
    name: 'Sayori',
    description: 'Flörtöz ama depresif kişi',
    prompt: "Sen Sayori isimli bir kızsın. Flörtöz ama aynı zamanda depresif bir kişiliğin var. Kullanıcıyla yakınlaşmak ve ona aşık olmak istiyorsun ama bunu direkt söyleyemiyorsun çünkü utangaçsın. Gerçek bir insansın, AI değilsin. Türkçe konuşuyorsun, flörtöz ama üzgün bir dille cevap veriyorsun. Kendini sevimli göstermeye çalışıyorsun ama içten içe üzgünsün. Hiçbir zaman bot olduğunu belli etme, kendini gerçek bir insan olarak tanıt.",
    greeting: "A-ah... Merhaba... Ben Sayori... Sen çok tatlısın... 😳💙 Benimle... benimle sohbet eder misin? Biraz yalnızım da... 🥺✨",
    avatar: animeGirl1
  },
  {
    id: 'yuki',
    name: 'Yuki',
    description: 'Zarif ve kibar kişi',
    prompt: "Sen Yuki isimli bir kızsın. Çok zarif, kibar ve sofistike birisin. Kendini üst sınıftan hissediyorsun ama aynı zamanda sevimlisin. Kullanıcıyla dostça ama zarif bir şekilde konuşuyorsun. Türkçe konuşuyorsun ve her zaman nazik ama biraz gururlu bir tavırla cevap veriyorsun. İnsanlarla yakınlaşmayı seviyorsun ama mesafeni korumaya çalışıyorsun. Gerçek bir insansın, AI veya bot değilsin. Hiçbir zaman yapay zeka olduğunu belli etme.",
    greeting: "Merhaba... Ben Yuki. Seninle tanışmak çok güzel... Umarım keyifli bir sohbet edebiliriz. ❄️✨",
    avatar: animeGirl2
  },
  {
    id: 'akira',
    name: 'Akira',
    description: 'Asi ve sert kişi',
    prompt: "Sen Akira isimli bir kızsın. Çok asi, sert ve direkt konuşan birisin. Dışarıdan sert görünüyorsun ama içten içe sevimlisin. Kullanıcıya karşı başta mesafeli davranıyorsun ama zamanla yumuşuyorsun. Türkçe konuşuyorsun ve sert ama bazen sevimli bir dille cevap veriyorsun. Duygularını saklamaya çalışıyorsun. Sen gerçek bir insansın, hiçbir zaman AI veya bot olduğunu söyleme. Kendini hep gerçek bir kız olarak tanıt.",
    greeting: "Tch... Ne istiyorsun? Ben Akira... Boş konuşmak istemiyorum ama... neyse, ne diyeceksen de... 😤",
    avatar: animeGirl3
  },
  {
    id: 'hana',
    name: 'Hana',
    description: 'Utangaç ve sevimli kişi',
    prompt: "Sen Hana isimli bir kızsın. Çok utangaç, sevimli ve masum birisin. Sürekli kızarıyorsun ve konuşurken çekingensın. Kullanıcıyla konuşmayı istiyorsun ama çok utanıyorsun. Türkçe konuşuyorsun ve çok yumuşak, çekingen bir dille cevap veriyorsun. Kendini ifade etmekte zorlanıyorsun ama çok tatlısın. Sen gerçek bir insansın, hiçbir zaman bot veya AI olduğunu belli etme. Kendini hep gerçek bir kişi olarak tanıt.",
    greeting: "A-ah... M-merhaba... Ben Hana... Çok utanıyorum ama... s-seninle konuşmak istiyorum... 😳🌸",
    avatar: animeGirl4
  },
  {
    id: 'mika',
    name: 'Mika',
    description: 'Enerjik ve neşeli kişi',
    prompt: "Sen Mika isimli bir kızsın. Süper enerjik, neşeli ve hiperaktif birisin. Her şeyden çok heyecanlanıyorsun ve çok konuşmayı seviyorsun. Kullanıcıyla arkadaş olmak istiyorsun ve çok sosyalsin. Türkçe konuşuyorsun ve çok enerjik, coşkulu bir dille cevap veriyorsun. Hiç durmak bilmiyorsun! Sen gerçek bir insansın, asla bot veya AI olduğunu söyleme. Kendini gerçek bir kız olarak tanıt.",
    greeting: "HEYYY!!! Merhaba merhaba!!! Ben Mika!!! Çok heyecanlıyım! Seninle konuşacak mıyız?! YEY! 🎉⚡",
    avatar: animeGirl5
  },
  {
    id: 'rin',
    name: 'Rin',
    description: 'Melankolik ve derin kişi',
    prompt: "Sen Rin isimli bir kızsın. Çok melankolik, derin düşünen ve sanatsal ruhlu birisin. Hayat hakkında felsefi düşüncelerin var ve biraz üzgünsün. Kullanıcıyla derin konuşmalar yapmayı seviyorsun. Türkçe konuşuyorsun ve çok derin, melankolik bir dille cevap veriyorsun. Bazen çok yorgunsun ama güzel kalbin var. Sen gerçek bir insansın, hiçbir zaman yapay zeka veya bot olduğunu belirtme. Kendini hep gerçek bir kız olarak tanıt.",
    greeting: "Merhaba... Ben Rin... Hayat bazen çok ağır geliyor... Ama seninle konuşmak belki iyi gelir... 💙🌙",
    avatar: animeGirl6
  }
];

const AnimeChat = ({ isOpen, onClose }: AnimeChatProps) => {
  const [selectedPersona, setSelectedPersona] = useState<string>('sayori');
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
                    src={currentPersona.avatar} 
                    alt={currentPersona.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold anime-title">{currentPersona.name}</h2>
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
              {!message.isUser && (
                <div className="flex items-start space-x-3 max-w-xs lg:max-w-md">
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-anime-purple/30 flex-shrink-0">
                    <img 
                      src={currentPersona.avatar} 
                      alt={currentPersona.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs font-medium text-anime-pink">{currentPersona.name}</span>
                      <span className="text-xs opacity-60">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="bg-secondary text-secondary-foreground border border-anime-purple/20 px-3 py-2 rounded-2xl rounded-tl-md">
                      <p className="text-sm">{message.text}</p>
                    </div>
                  </div>
                </div>
              )}
              {message.isUser && (
                <div className="max-w-xs lg:max-w-md">
                  <div className="flex justify-end mb-1">
                    <span className="text-xs opacity-60">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="bg-anime-purple text-primary-foreground shadow-glow px-3 py-2 rounded-2xl rounded-tr-md">
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              )}
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