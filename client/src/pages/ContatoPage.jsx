import { MessageCircle, Instagram, Twitter } from 'lucide-react';

export default function ContatoPage() {
  const channels = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      href: 'https://wa.me/5500000000000',
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      name: 'Instagram',
      icon: Instagram,
      href: 'https://instagram.com/xdenker',
      color: 'bg-pink-500 hover:bg-pink-600',
    },
    {
      name: 'X (Twitter)',
      icon: Twitter,
      href: 'https://x.com/xdenker',
      color: 'bg-slate-800 hover:bg-slate-900',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-xdenker-dark mb-2">Contato</h1>
      <p className="text-slate-600 mb-10">Canais de atendimento oficiais.</p>

      <div className="flex flex-wrap gap-6 justify-center">
        {channels.map((ch) => (
          <a
            key={ch.name}
            href={ch.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${ch.color} text-white rounded-2xl p-8 w-40 h-40 flex flex-col items-center justify-center gap-3 shadow-lg transition-transform hover:scale-105`}
          >
            <ch.icon size={36} />
            <span className="font-semibold">{ch.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
