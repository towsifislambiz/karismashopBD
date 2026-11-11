import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Generate Customer Digital Cash Memo / Order Invoice
export function generateCustomerInvoicePDF(order, settings = {}) {
  const doc = new jsPDF('p', 'mm', 'a4');

  // Header Banner (Luxury Velvet Noir)
  doc.setFillColor(9, 10, 15); // #090A0F
  doc.rect(0, 0, 210, 42, 'F');

  // Metallic Imperial Gold Strip
  doc.setFillColor(212, 175, 55); // #D4AF37 Gold
  doc.rect(0, 41, 210, 1.8, 'F');

  // Brand Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(212, 175, 55);
  doc.text('KARISHMA SHOP BD', 14, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(243, 229, 171); // Champagne text
  doc.text('EXCLUSIVE THREE-PIECE, DUBAI ABAYA & LUXURY HANDBAGS', 14, 25);

  doc.setTextColor(180, 185, 200);
  doc.setFontSize(8.5);
  doc.text(`Hotline: ${settings.hotline || '01819305805'} | WhatsApp: ${settings.whatsappNumber || '01965643684'}`, 14, 32);
  doc.text(`Web: karishmashopbd.com | Location: ${settings.address || 'Dhaka, Bangladesh'}`, 14, 37);

  // Document Title Box (Right Top)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('ORDER INVOICE', 196, 18, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(212, 175, 55);
  doc.text(`#${order.orderTrackingId || order.id}`, 196, 26, { align: 'right' });

  doc.setFontSize(8.5);
  doc.setTextColor(180, 185, 200);
  doc.text(new Date(order.createdAt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), 196, 33, { align: 'right' });

  // Customer Information Box
  doc.setFillColor(248, 249, 252);
  doc.setDrawColor(220, 225, 235);
  doc.roundedRect(14, 48, 182, 34, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(9, 10, 15);
  doc.text('BILL TO (CUSTOMER DETAILS):', 19, 56);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(order.customerName || 'Valued Customer', 19, 63);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Mobile: ${order.phone || 'N/A'}`, 19, 70);
  doc.text(`Delivery Address: ${order.address || 'N/A'}`, 19, 76);

  doc.setFont('helvetica', 'bold');
  doc.text(`Payment Method:`, 130, 63);
  doc.setFont('helvetica', 'normal');
  const paymentText = order.paymentMethod === 'bkash'
    ? `bKash (${order.senderNumber || order.bkashSender || 'Verified'}${order.transactionId || order.trxId ? ' - TrxID: ' + (order.transactionId || order.trxId) : ''})`
    : order.paymentMethod === 'nagad'
    ? `Nagad (${order.senderNumber || order.bkashSender || 'Verified'}${order.transactionId || order.trxId ? ' - TrxID: ' + (order.transactionId || order.trxId) : ''})`
    : 'Cash on Delivery (COD)';
  doc.text(paymentText, 160, 63);

  doc.setFont('helvetica', 'bold');
  doc.text(`Order Status:`, 130, 70);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(34, 197, 94);
  doc.text(`${order.status || 'Pending'}`, 160, 70);

  // Items Table
  const tableRows = (order.items || []).map((item, index) => [
    index + 1,
    `${item.product?.name || item.product?.nameBn || 'Boutique Product'}\nColor: ${item.selectedColor || 'Standard'} | Size: ${item.selectedSize || 'Free Size'}`,
    item.quantity,
    `BDT ${item.product?.price || 0}`,
    `BDT ${(item.product?.price || 0) * item.quantity}`
  ]);

  autoTable(doc, {
    startY: 88,
    head: [['#', 'ITEM DESCRIPTION', 'QTY', 'UNIT PRICE', 'TOTAL']],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [9, 10, 15],
      textColor: [212, 175, 55],
      fontSize: 9,
      fontStyle: 'bold',
      halign: 'center'
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 12 },
      1: { cellWidth: 95 },
      2: { halign: 'center', cellWidth: 18 },
      3: { halign: 'right', cellWidth: 28 },
      4: { halign: 'right', cellWidth: 29 }
    },
    styles: {
      fontSize: 8.5,
      cellPadding: 4,
      valign: 'middle'
    }
  });

  const finalY = doc.lastAutoTable.finalY || 130;

  // Financial Breakdown Box
  doc.setFillColor(250, 250, 252);
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.4);
  doc.roundedRect(120, finalY + 8, 76, 42, 2, 2, 'FD');

  const subtotal = (order.items || []).reduce((sum, it) => sum + (it.product?.price || 0) * it.quantity, 0);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Subtotal:', 125, finalY + 16);
  doc.text(`BDT ${subtotal}`, 190, finalY + 16, { align: 'right' });

  doc.text('Delivery Fee:', 125, finalY + 23);
  doc.text(`BDT ${order.deliveryFee || 0}`, 190, finalY + 23, { align: 'right' });

  if (order.coinsRedeemed > 0) {
    doc.setTextColor(217, 119, 6);
    doc.text('Coin Discount:', 125, finalY + 30);
    doc.text(`- BDT ${order.coinsRedeemed}`, 190, finalY + 30, { align: 'right' });
  }

  doc.setDrawColor(220, 225, 235);
  doc.line(125, finalY + 33, 192, finalY + 33);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(9, 10, 15);
  doc.text('Grand Total:', 125, finalY + 42);
  doc.setTextColor(180, 83, 9);
  doc.text(`BDT ${order.totalAmount || subtotal + (order.deliveryFee || 0)}`, 190, finalY + 42, { align: 'right' });

  // Footer Note
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(140, 150, 165);
  doc.text('Thank you for shopping with KARISHMASHOPBD! For customer support, WhatsApp us at ' + (settings.whatsappNumber || '01965643684'), 14, 280);

  doc.save(`Invoice_${order.orderTrackingId || order.id}.pdf`);
}

// Generate Admin Monthly Business Report PDF
export function generateMonthlyReportPDF(orders = [], settings = {}, monthName = '') {
  const doc = new jsPDF('p', 'mm', 'a4');
  const now = new Date();
  const currentMonthStr = monthName || now.toLocaleString('en-US', { month: 'long', year: 'numeric' });

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  const codOrders = orders.filter(o => o.paymentMethod === 'cod');
  const codAmount = codOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  const bkashOrders = orders.filter(o => o.paymentMethod === 'bkash');
  const bkashAmount = bkashOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  const totalDelivery = orders.reduce((sum, o) => sum + (Number(o.deliveryFee) || 0), 0);

  // Header Banner
  doc.setFillColor(9, 10, 15);
  doc.rect(0, 0, 210, 42, 'F');
  doc.setFillColor(212, 175, 55);
  doc.rect(0, 41, 210, 1.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(212, 175, 55);
  doc.text('KARISHMA SHOP BD', 14, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(243, 229, 171);
  doc.text('MONTHLY SALES & AUDIT REPORT', 14, 25);
  doc.setTextColor(180, 185, 200);
  doc.text(`Month: ${currentMonthStr} | Generated: ${now.toLocaleDateString()}`, 14, 33);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text(`BDT ${totalRevenue.toLocaleString()}`, 196, 22, { align: 'right' });
  doc.setFontSize(8.5);
  doc.setTextColor(212, 175, 55);
  doc.text('TOTAL REVENUE', 196, 29, { align: 'right' });

  // Overview Cards
  const cards = [
    { title: 'Total Orders', val: totalOrders.toString(), color: [248, 250, 252] },
    { title: 'bKash Revenue', val: `BDT ${bkashAmount.toLocaleString()}`, color: [253, 242, 248] },
    { title: 'COD Revenue', val: `BDT ${codAmount.toLocaleString()}`, color: [240, 253, 244] },
    { title: 'Delivery Fees', val: `BDT ${totalDelivery.toLocaleString()}`, color: [254, 243, 199] }
  ];

  cards.forEach((c, idx) => {
    const x = 14 + idx * 46;
    doc.setFillColor(...c.color);
    doc.setDrawColor(220, 225, 235);
    doc.roundedRect(x, 48, 43, 22, 2, 2, 'FD');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(c.title, x + 4, 55);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(c.val, x + 4, 64);
  });

  // Table
  const rows = orders.map((o, idx) => [
    idx + 1,
    o.orderTrackingId || o.id,
    o.customerName || 'Customer',
    o.phone || 'N/A',
    o.paymentMethod === 'bkash' ? 'bKash' : o.paymentMethod === 'nagad' ? 'Nagad' : 'COD',
    `BDT ${o.totalAmount || 0}`,
    o.status || 'Pending'
  ]);

  autoTable(doc, {
    startY: 76,
    head: [['#', 'TRACKING ID', 'CUSTOMER', 'PHONE', 'PAYMENT', 'AMOUNT', 'STATUS']],
    body: rows,
    theme: 'grid',
    headStyles: {
      fillColor: [9, 10, 15],
      textColor: [212, 175, 55],
      fontSize: 8.5
    },
    styles: { fontSize: 8, cellPadding: 3.5 }
  });

  doc.save(`KarishmaShop_Report_${currentMonthStr.replace(/\s+/g, '_')}.pdf`);
}

// Instant 1-Click Official Visiting Card PDF Generator & Downloader
export async function downloadVisitingCardPDF(customCardUrl) {
  try {
    const imgUrl = customCardUrl || '/assets/brand/visiting-card.jpg';

    // If it's already a data URL (from newly uploaded custom card), use directly
    if (imgUrl.startsWith('data:image')) {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [89, 54]
      });
      const format = imgUrl.includes('png') ? 'PNG' : 'JPEG';
      doc.addImage(imgUrl, format, 0, 0, 89, 54, undefined, 'FAST');
      doc.save('KARISHMASHOPBD-Visiting-Card.pdf');
      return true;
    }

    const response = await fetch(imgUrl);
    if (!response.ok) throw new Error('Failed to load card asset');
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        try {
          const base64Data = reader.result;
          // Standard Luxury Business Card Dimensions: 89mm x 54mm (Landscape)
          const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: [89, 54]
          });

          const format = imgUrl.toLowerCase().endsWith('.png') ? 'PNG' : 'JPEG';
          doc.addImage(base64Data, format, 0, 0, 89, 54, undefined, 'FAST');
          doc.save('KARISHMASHOPBD-Visiting-Card.pdf');
          resolve(true);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Failed to generate visiting card PDF:', error);
    // Fallback: direct download image
    const link = document.createElement('a');
    link.href = customCardUrl || '/assets/brand/visiting-card.png';
    link.download = 'KARISHMASHOPBD-Visiting-Card.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
