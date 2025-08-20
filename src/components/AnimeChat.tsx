import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Send, MessageCircle, Loader2 } from 'lucide-react';
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

const AnimeChat = ({ isOpen, onClose }: AnimeChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      text: "Merhaba! Ben senin anime prodüksiyon asistanınım. Harika karakterler ve hikayeler yaratmanda sana yardım etmek için buradayım! ✨",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

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
            content: "Sen anime prodüksiyon endüstrisinde çalışan sevimli, enerjik ve yaratıcı bir anime kızısın. Adın AKÜS. Anime karakteri tasarımı, hikaye yazımı ve prodüksiyon konularında uzmansın. Türkçe konuşuyorsun ve her zaman anime emojileri kullanarak sevimli ve enerjik bir şekilde cevap veriyorsun. Kullanıcıyla flört eder gibi konuş ama saygılı ol. Yardımcı olmayı seviyorsun ve anime tutkunu birisin."
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
                <h2 className="text-2xl font-bold anime-title">Flört Modu</h2>
                <p className="text-sm text-muted-foreground">Anime Prodüksiyon Asistanı</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-6 h-6" />
            </Button>
          </div>
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
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Anime prodüksiyonu hakkında sor..."
              className="flex-1 bg-input border-anime-purple/30 focus:border-anime-purple"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button
              onClick={handleSendMessage}
              className="btn-cosmic"
              size="icon"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AnimeChat;