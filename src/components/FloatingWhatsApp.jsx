import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useStoreSettings } from '../context/StoreSettingsContext';

export default function FloatingWhatsApp() {
  const { lang } = useLanguage();
  const { settings } = useStoreSettings();

  const waRaw = (settings?.whatsappNumber || '01819305805').replace(/[^0-9]/g, '');
  const waNumber = waRaw.startsWith('880') ? waRaw : waRaw.startsWith('0') ? '88' + waRaw : '880' + waRaw;

  const defaultMsg = encodeURIComponent(
    lang === 'bn'
      ? 'আসসালামু আলাইকুম Karishma Shop BD, আমি আপনাদের বুটিক ড্রেস ও ব্যাগ কালেকশন সম্পর্কে জানতে চাচ্ছি।'
      : 'Hello Karishma Shop BD, I would like to inquire about your boutique collection.'
  );

  return (
    <aside
      aria-label="WhatsApp Support"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 group"
    >
      {/* Tooltip Pill */}
      <span className="hidden sm:inline-block px-3 py-1.5 rounded-xl bg-brand-surface/95 border border-brand-gold/40 text-brand-gold text-xs font-bold shadow-xl shadow-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
        {lang === 'bn' ? '💬 হোয়াটসঅ্যাপে সরাসরি কথা বলুন' : '💬 Chat with us on WhatsApp'}
      </span>

      {/* Button */}
      <a
        href={`https://wa.me/${waNumber}?text=${defaultMsg}`}
        target="_blank"
        rel="noopener noreferrer"
        className="relative size-12 sm:size-14 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white flex items-center justify-center shadow-lg shadow-emerald-950/60 hover:scale-110 active:scale-95 transition-all duration-300"
        title="WhatsApp Support"
      >
        <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-25" />
        <MessageCircle className="size-6 sm:size-7 fill-white text-emerald-600" />
      </a>
    </aside>
  );
}
