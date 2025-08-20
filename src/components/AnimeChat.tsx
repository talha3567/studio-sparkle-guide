import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Send, MessageCircle } from 'lucide-react';
import animeHero from '@/assets/anime-hero.jpg';

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

  const animeResponses = [
    "Bu harika bir fikir! Hadi bunu kozmik sihirle hayata geçirelim! ⭐",
    "Yaratıcılığına bayılıyorum! Mor ve pembe temalar anime estetiği için mükemmel! 💜",
    "Karakter tasarım konseptin muhteşem! Yıldız ışığı efektleri eklemeyi düşündün mü? ✨",
    "Çok havalı! Bunu daha da geliştirmene yardım edebilirim. En sevdiğin anime stili nedir? 🌟",
    "İnanılmaz! Hayal gücün yıldızlar kadar parlak! Hadi birlikte güzel bir şey yaratalım! 💫",
    "Buna yardım etmek için heyecanlıyım! Anime prodüksiyonu hayalleri gerçeğe dönüştürmekle ilgili! 🎨"
  ];

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: messages.length + 1,
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: messages.length + 2,
        text: animeResponses[Math.floor(Math.random() * animeResponses.length)],
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
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
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AnimeChat;