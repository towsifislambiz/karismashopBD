import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Copy,
  Download,
  MessageSquare,
  ArrowRight,
  Package,
  Truck,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useOrders } from '../context/OrderContext';
import { useStoreSettings } from '../context/StoreSettingsContext';
import { generateCustomerInvoicePDF } from '../utils/pdfGenerator';

export default function OrderSuccessPage() {
  const { trackingId } = useParams();
  const { lang, t } = useLanguage();
  const { orders } = useOrders();
  const { settings } = useStoreSettings();

  const [copied, setCopied] = useState(false);

  // Find order
  const order = orders.find(o => o.orderTrackingId === trackingId || o.id === trackingId);

  const displayId = trackingId || order?.orderTrackingId || 'KS-CONFIRMED';

  const handleCopy = () => {
    navigator.clipboard.writeText(displayId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    if (order) {
      generateCustomerInvoicePDF(order, settings);
    } else {
      // Mock invoice if order not found in state
      const fallback = {
        orderTrackingId: displayId,
        customerName: 'সম্মানিত ক্রেতা',
        phone: '01XXXXXXXXX',
        address: 'Dhaka, Bangladesh',
        paymentMethod: 'cod',
        status: 'Confirmed',
        totalAmount: 2450,
        deliveryFee: 80,
        items: []
      };
      generateCustomerInvoicePDF(fallback, settings);
    }
  };

  const rawWa = (settings?.whatsappNumber || '01749765271').replace(/[^0-9]/g, '');
  const waNumber = rawWa.startsWith('880') ? rawWa : rawWa.startsWith('0') ? '88' + rawWa : '880' + rawWa;
  const waMsg = encodeURIComponent(
    `আসসালামু আলাইকুম Karishma Shop BD, আমার অর্ডার #${displayId} কনফার্ম হয়েছে। বিস্তারিত আপডেট জানাতে অনুরোধ করছি। ধন্যবাদ!`
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-slate-100 space-y-8">
      {/* 1. Success Hero Box */}
      <div className="text-center p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-brand-surface via-brand-card to-brand-noir border border-brand-gold/40 shadow-2xl space-y-4">
        <div className="size-20 rounded-3xl bg-gradient-to-tr from-brand-gold to-brand-goldDark text-brand-noir flex items-center justify-center mx-auto shadow-gold-glow animate-bounce">
          <CheckCircle2 className="size-10 stroke-[2.5]" />
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            {t('orderSuccessTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            {lang === 'bn'
              ? 'আমাদের কাস্টমার কেয়ার টিম শীঘ্রই আপনার সাথে ফোনে যোগাযোগ করে পার্সেলটি পাঠিয়ে দেবে।'
              : 'Our fulfillment team will confirm and dispatch your parcel shortly.'}
          </p>
        </div>

        {/* Tracking ID Badge */}
        <div className="inline-flex items-center gap-3 p-2.5 sm:px-4 rounded-2xl bg-brand-noir border border-brand-gold/50 shadow-inner">
          <span className="text-xs text-slate-400 font-bold">{t('orderTrackingId')}:</span>
          <span className="font-mono text-base sm:text-lg font-black text-brand-gold tracking-wider">
            #{displayId}
          </span>
          <button
            onClick={handleCopy}
            className="p-1 text-slate-400 hover:text-white transition"
            title="Copy ID"
          >
            <Copy className="size-4" />
          </button>
          {copied && <span className="text-[10px] text-emerald-400 font-bold">{t('copied')}</span>}
        </div>
      </div>

      {/* 2. Order Summary Card if Available */}
      {order && (
        <div className="p-6 rounded-3xl bg-brand-surface border border-brand-border space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-brand-border">
            <h3 className="font-serif text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Package className="size-4 text-brand-gold" />
              <span>{lang === 'bn' ? 'অর্ডারের সারাংশ' : 'Order Breakdown'}</span>
            </h3>
            <span className="text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-md">
              ✓ {order.status || 'Pending'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-300">
            <div>
              <p><strong className="text-white">গ্রাহকের নাম:</strong> {order.customerName}</p>
              <p><strong className="text-white">মোবাইল:</strong> {order.phone}</p>
              <p><strong className="text-white">ডেলিভারি ঠিকানা:</strong> {order.address}</p>
            </div>
            <div>
              <p><strong className="text-white">পেমেন্ট মেথড:</strong> {order.paymentMethod === 'bkash' ? `বিকাশ (${order.bkashSender || 'Sent'})` : 'ক্যাশ অন ডেলিভারি'}</p>
              <p><strong className="text-white">ডেলিভারি চার্জ:</strong> ৳{order.deliveryFee}</p>
              <p className="text-sm font-black text-brand-gold pt-1">
                সর্বমোট প্রদেয়: ৳{order.totalAmount}
              </p>
            </div>
          </div>

          {/* Items Preview */}
          <div className="pt-3 border-t border-brand-border space-y-2">
            {order.items?.map((it, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-brand-card p-2 rounded-xl">
                <img
                  src={it.product?.image || it.product?.images?.[0] || '/assets/brand/logo.png'}
                  alt=""
                  className="size-10 rounded-lg object-contain bg-black"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white truncate">{it.product?.nameBn || it.product?.name}</p>
                  <p className="text-[11px] text-slate-400">{it.selectedColor} • পরিমাণ: {it.quantity} টি</p>
                </div>
                <span className="font-mono font-bold text-brand-gold">৳{(it.product?.price || 0) * it.quantity}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Primary Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Download PDF Button */}
        <button
          onClick={handleDownloadPDF}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-brand-gold via-brand-goldLight to-brand-goldDark text-brand-noir font-black text-xs sm:text-sm shadow-gold-glow hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2"
        >
          <Download className="size-4" />
          <span>{t('downloadInvoice')}</span>
        </button>

        {/* WhatsApp Help */}
        <a
          href={`https://wa.me/${waNumber}?text=${waMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-emerald-950/40 transition flex items-center justify-center gap-2 active:scale-95"
        >
          <MessageSquare className="size-4 fill-white" />
          <span>{t('whatsappSupport')}</span>
        </a>
      </div>

      <div className="text-center pt-4">
        <Link
          to="/shop"
          className="text-xs font-bold text-brand-gold hover:underline inline-flex items-center gap-1"
        >
          <span>← {t('continueShopping')}</span>
        </Link>
      </div>
    </div>
  );
}
