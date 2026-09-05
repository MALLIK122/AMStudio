import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { X, Download, Copy, Check, Printer, QrCode, Sparkles, ExternalLink } from 'lucide-react';

export default function QRCodeGeneratorModal({ project, onClose }) {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [standeePreviewUrl, setStandeePreviewUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState('standee'); // 'standee' | 'qr'
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!project) return;
    // Determine the most accurate live destination link
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://am-studio-umber.vercel.app';
    let dest = project.liveUrl || '';
    if (!dest || dest.startsWith('/images/')) {
      dest = `${baseUrl}/#projects`;
    } else if (dest.startsWith('/')) {
      dest = `${baseUrl}${dest}`;
    }
    setTargetUrl(dest);
  }, [project]);

  // Generate high-resolution QR Code
  useEffect(() => {
    if (!targetUrl) return;

    QRCode.toDataURL(targetUrl, {
      width: 1024,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => {
        setQrDataUrl(url);
      })
      .catch((err) => {
        console.error('Failed to generate QR Code:', err);
      });
  }, [targetUrl]);

  // Render Printable Table Standee Card onto Canvas
  useEffect(() => {
    if (!qrDataUrl || !project) return;

    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Background: Deep Luxury Obsidian
    const bgGradient = ctx.createLinearGradient(0, 0, 0, 1600);
    bgGradient.addColorStop(0, '#09090b');
    bgGradient.addColorStop(0.5, '#040405');
    bgGradient.addColorStop(1, '#000000');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1200, 1600);

    // 2. Luxury Double Border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 4;
    ctx.strokeRect(50, 50, 1100, 1500);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(66, 66, 1068, 1468);

    // Corner Ornaments
    const drawCorner = (x, y, r1, r2) => {
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 2.5;
      ctx.moveTo(x + r1, y);
      ctx.lineTo(x, y);
      ctx.lineTo(x, y + r2);
      ctx.stroke();
    };
    drawCorner(80, 80, 40, 40);
    drawCorner(1120, 80, -40, 40);
    drawCorner(80, 1520, 40, -40);
    drawCorner(1120, 1520, -40, -40);

    // 3. Studio Brand Header
    ctx.textAlign = 'center';
    ctx.fillStyle = '#a1a1aa';
    ctx.font = '500 24px "Space Grotesk", sans-serif';
    ctx.fillText('A M   S T U D I O', 600, 140);

    // 4. Welcome Headline
    ctx.fillStyle = '#ffffff';
    ctx.font = '600 32px "Space Grotesk", sans-serif';
    ctx.fillText('WELCOME TO OUR CELEBRATION', 600, 230);

    // 5. Couple / Project Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 56px "Space Grotesk", serif';
    
    // Auto-wrap title if long
    const titleText = project.title || 'Wedding Celebration';
    const words = titleText.split(' ');
    let line = '';
    let y = 330;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > 950 && n > 0) {
        ctx.fillText(line.trim(), 600, y);
        line = words[n] + ' ';
        y += 65;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), 600, y);

    // Subtitle / Tagline
    ctx.fillStyle = '#d4d4d8';
    ctx.font = '400 24px "Space Grotesk", sans-serif';
    const categoryInfo = `${(project.category || 'Luxury Invitation').toUpperCase()} • ${project.year || '2026'}`;
    ctx.fillText(categoryInfo, 600, y + 55);

    // Decorative Divider Line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(350, y + 90);
    ctx.lineTo(850, y + 90);
    ctx.stroke();

    // 6. Centered QR Code Box
    const qrImg = new Image();
    qrImg.crossOrigin = 'anonymous';
    qrImg.onload = () => {
      const qrBoxSize = 580;
      const qrBoxX = (1200 - qrBoxSize) / 2;
      const qrBoxY = y + 130;

      // QR White Container Box
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 30;
      ctx.shadowOffsetY = 15;
      
      // Rounded rect
      const radius = 28;
      ctx.beginPath();
      ctx.moveTo(qrBoxX + radius, qrBoxY);
      ctx.lineTo(qrBoxX + qrBoxSize - radius, qrBoxY);
      ctx.quadraticCurveTo(qrBoxX + qrBoxSize, qrBoxY, qrBoxX + qrBoxSize, qrBoxY + radius);
      ctx.lineTo(qrBoxX + qrBoxSize, qrBoxY + qrBoxSize - radius);
      ctx.quadraticCurveTo(qrBoxX + qrBoxSize, qrBoxY + qrBoxSize, qrBoxX + qrBoxSize - radius, qrBoxY + qrBoxSize);
      ctx.lineTo(qrBoxX + radius, qrBoxY + qrBoxSize);
      ctx.quadraticCurveTo(qrBoxX, qrBoxY + qrBoxSize, qrBoxX, qrBoxY + qrBoxSize - radius);
      ctx.lineTo(qrBoxX, qrBoxY + radius);
      ctx.quadraticCurveTo(qrBoxX, qrBoxY, qrBoxX + radius, qrBoxY);
      ctx.closePath();
      ctx.fill();

      ctx.shadowColor = 'transparent';

      // Draw QR inside
      const padding = 35;
      ctx.drawImage(
        qrImg, 
        qrBoxX + padding, 
        qrBoxY + padding, 
        qrBoxSize - (padding * 2), 
        qrBoxSize - (padding * 2)
      );

      // 7. Instructions under QR
      const textStartY = qrBoxY + qrBoxSize + 70;
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 30px "Space Grotesk", sans-serif';
      ctx.fillText('SCAN WITH YOUR PHONE CAMERA', 600, textStartY);

      ctx.fillStyle = '#a1a1aa';
      ctx.font = '400 22px "Inter", sans-serif';
      ctx.fillText('Explore Wedding Timeline • Background Music • Venue Maps & RSVP', 600, textStartY + 45);

      // 8. Footer
      ctx.fillStyle = '#71717a';
      ctx.font = '400 18px "Space Grotesk", sans-serif';
      ctx.fillText('POWERED BY AM STUDIO • LUXURY DIGITAL INVITATIONS', 600, 1490);

      // Update standee preview
      setStandeePreviewUrl(canvas.toDataURL('image/png', 1.0));
    };
    qrImg.src = qrDataUrl;
  }, [qrDataUrl, project]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    const safeTitle = (project.title || 'project').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    a.download = `am-studio-${safeTitle}-qr-code.png`;
    a.click();
  };

  const handleDownloadStandee = () => {
    if (!standeePreviewUrl) return;
    const a = document.createElement('a');
    a.href = standeePreviewUrl;
    const safeTitle = (project.title || 'project').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    a.download = `am-studio-${safeTitle}-table-standee.png`;
    a.click();
  };

  const handlePrint = () => {
    if (!standeePreviewUrl) return;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${project.title || 'AM Studio'} - Printable Table Standee</title>
          <style>
            @page { size: A5 portrait; margin: 0; }
            body { margin: 0; padding: 0; background: #000; display: flex; align-items: center; justify-content: center; height: 100vh; }
            img { max-width: 100%; max-height: 100vh; object-fit: contain; }
          </style>
        </head>
        <body>
          <img src="${standeePreviewUrl}" onload="window.print();window.close();" />
        </body>
      </html>
    `);
    win.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/90 backdrop-blur-xl animate-fade-in overflow-y-auto">
      {/* Click outside to close */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-4xl bg-zinc-950 border border-white/20 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl z-10 my-auto flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                Instant QR Code &amp; Table Standee Generator
              </h3>
              <p className="text-xs text-zinc-300 font-mono">
                {project?.title} • High-Resolution Print Ready
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white text-zinc-400 hover:text-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Target URL control */}
          <div className="p-4 rounded-xl glass-panel border border-white/10 space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 font-semibold">
              Destination URL for QR Code
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="url"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                className="flex-1 w-full glass-input px-3.5 py-2 rounded-xl text-xs font-mono text-zinc-200"
                placeholder="https://..."
              />
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleCopyLink}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/20 hover:bg-white/10 text-xs font-mono text-white transition-colors"
                  title="Copy link"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <a
                  href={targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl border border-white/20 hover:bg-white/10 text-white transition-colors"
                  title="Test link"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* View Switcher */}
          <div className="flex items-center justify-center">
            <div className="p-1 rounded-xl bg-zinc-900 border border-white/15 inline-flex items-center gap-1">
              <button
                onClick={() => setViewMode('standee')}
                className={`px-4 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
                  viewMode === 'standee'
                    ? 'bg-white text-black font-bold shadow'
                    : 'text-zinc-300 hover:text-white'
                }`}
              >
                Table Standee Card
              </button>
              <button
                onClick={() => setViewMode('qr')}
                className={`px-4 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
                  viewMode === 'qr'
                    ? 'bg-white text-black font-bold shadow'
                    : 'text-zinc-300 hover:text-white'
                }`}
              >
                QR Code Only
              </button>
            </div>
          </div>

          {/* Preview Area */}
          <div className="flex items-center justify-center p-4 rounded-2xl bg-black/60 border border-white/10 min-h-[360px]">
            {viewMode === 'standee' ? (
              standeePreviewUrl ? (
                <div className="relative max-h-[460px] rounded-xl overflow-hidden shadow-2xl border border-white/20">
                  <img
                    src={standeePreviewUrl}
                    alt="Table Standee Preview"
                    className="max-h-[460px] w-auto object-contain mx-auto"
                  />
                </div>
              ) : (
                <div className="text-xs font-mono text-zinc-400">Generating Table Standee Card...</div>
              )
            ) : (
              qrDataUrl ? (
                <div className="p-6 rounded-2xl bg-white shadow-2xl flex flex-col items-center gap-3">
                  <img
                    src={qrDataUrl}
                    alt="QR Code"
                    className="w-56 h-56 object-contain"
                  />
                  <span className="text-[11px] font-mono text-zinc-500 font-semibold uppercase">
                    Scan to Open Website
                  </span>
                </div>
              ) : (
                <div className="text-xs font-mono text-zinc-400">Generating QR Code...</div>
              )
            )}
          </div>

          <p className="text-[11px] font-mono text-zinc-400 text-center">
            Print this card in A5 / A4 size and place it on wedding entrance tables or reception desks. Guests can scan with any phone camera to navigate to the live website instantly!
          </p>
        </div>

        {/* Action Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-6 border-t border-white/10 bg-black/40">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-white/20 text-zinc-300 hover:text-white text-xs font-mono uppercase transition-colors"
          >
            Close
          </button>

          <div className="flex flex-wrap items-center gap-2.5 ml-auto">
            <button
              onClick={handleDownloadQr}
              disabled={!qrDataUrl}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/20 hover:bg-white/10 text-white text-xs font-mono uppercase transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Download QR Only</span>
            </button>

            <button
              onClick={handlePrint}
              disabled={!standeePreviewUrl}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/20 hover:bg-white/10 text-white text-xs font-mono uppercase transition-colors disabled:opacity-50"
            >
              <Printer className="w-4 h-4" />
              <span>Print Standee</span>
            </button>

            <button
              onClick={handleDownloadStandee}
              disabled={!standeePreviewUrl}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-xs font-mono uppercase hover:bg-zinc-200 transition-all shadow-lg disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Download Standee (PNG)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
