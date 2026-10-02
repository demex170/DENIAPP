import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Copy, Check, Download, Send, MessageCircle } from 'lucide-react';
import { Modal } from './Modal.tsx';
import { Button } from './Button.tsx';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  url,
  title,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && canvasRef.current && url) {
      QRCode.toCanvas(
        canvasRef.current,
        url,
        {
          width: 240,
          margin: 2,
          color: {
            dark: '#1c1917',
            light: '#ffffff',
          },
        },
        (err) => {
          if (err) console.error('QR code generation error:', err);
        }
      );
    }
  }, [isOpen, url]);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `DENI-QR-${title.replace(/\s+/g, '-')}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const shareText = encodeURIComponent(`გეპატიჟებით ღონისძიებაზე: ${title}\nიხილეთ ონლაინ მოსაწვევი:\n${url}`);
  const whatsappUrl = `https://api.whatsapp.com/send?text=${shareText}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="მოსაწვევის გაზიარება"
      subtitle="გაუგზავნე სტუმრებს ბმული ან დაბეჭდე QR კოდი"
      maxWidth="sm"
    >
      <div className="flex flex-col items-center text-center space-y-5">
        {/* QR Canvas */}
        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm flex items-center justify-center">
          <canvas ref={canvasRef} className="rounded-lg" />
        </div>

        {/* Link box */}
        <div className="w-full flex items-center gap-2 p-2 bg-stone-100/80 rounded-xl border border-stone-200">
          <input
            type="text"
            readOnly
            value={url}
            className="w-full bg-transparent text-xs text-stone-700 px-2 select-all focus:outline-none truncate font-mono"
          />
          <Button
            size="sm"
            variant="secondary"
            onClick={handleCopy}
            icon={copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          >
            {copied ? 'დაკოპირდა' : 'კოპირება'}
          </Button>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-2 gap-2.5 w-full">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-3.5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-medium hover:bg-emerald-700 transition-colors shadow-xs"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </a>

          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-3.5 py-2.5 bg-sky-500 text-white rounded-xl text-xs font-medium hover:bg-sky-600 transition-colors shadow-xs"
          >
            <Send className="w-4 h-4" />
            <span>Telegram</span>
          </a>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={handleDownload}
          icon={<Download className="w-4 h-4" />}
        >
          QR კოდის ჩამოტვირთვა (PNG)
        </Button>
      </div>
    </Modal>
  );
};
