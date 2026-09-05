import React from 'react';
import { useStudio } from '../../context/StudioContext';
import { Mail, Phone, Trash2, CheckCircle2, MessageSquare, ExternalLink, Calendar } from 'lucide-react';
import { WhatsApp } from '../Icons';

export default function InquiriesManager() {
  const { inquiries, markInquiryAsRead, deleteInquiry } = useStudio();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h3 className="font-display text-2xl font-bold text-white tracking-tight">
            Client Inquiries & Dispatches
          </h3>
          <p className="text-zinc-400 text-xs font-mono mt-1">
            Review wedding briefs, reply directly via WhatsApp or Gmail, and connect with couples
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] text-xs font-mono text-zinc-300">
            Total: {inquiries.length}
          </span>
          <span className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] text-xs font-mono text-zinc-300">
            Unread: {inquiries.filter(i => !i.read).length}
          </span>
        </div>
      </div>

      {inquiries.length === 0 ? (
        <div className="p-16 text-center rounded-2xl glass-panel border border-white/10">
          <MessageSquare className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
          <p className="font-mono text-zinc-400 text-sm">No inquiries received yet.</p>
          <p className="text-xs text-zinc-500 font-mono mt-1">
            Client submissions via the contact form will automatically populate here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inq) => {
            const formattedDate = new Date(inq.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            // Clean client phone for wa.me and tel:
            const rawPhone = (inq.phone || '').replace(/\D/g, '');
            const cleanPhone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;

            const whatsappMessage = `Hi ${inq.name}, this is AM Studio! Thank you for inquiring about your wedding invitation website (${inq.projectType || 'Wedding Invitation'}${inq.budget ? ` • ${inq.budget}` : ''}). We'd love to share custom live demo previews with you and discuss your celebration! When would be a good time to connect?`;

            const gmailSubject = `Regarding your Wedding Invitation Inquiry - AM Studio (${inq.projectType || 'Wedding'})`;
            const gmailBody = `Hi ${inq.name},\n\nThank you for reaching out to AM Studio regarding your ${inq.projectType || 'wedding invitation website'}!\n\nWe have received your event details and would love to design an unforgettable digital invitation experience for you.\n\nWarm regards,\nAM Studio Team\n+91 97316 96952\nhttps://am-studioin.vercel.app/`;

            return (
              <div
                key={inq.id}
                className={`p-6 rounded-2xl glass-panel border transition-all ${
                  inq.read ? 'border-white/10 opacity-85' : 'border-white/30 bg-zinc-900/60 shadow-lg'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-white/10">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <h4 className="font-display text-lg font-bold text-white">
                        {inq.name}
                      </h4>
                      {!inq.read && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-white text-black font-semibold tracking-wider">
                          New
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                      {inq.email && (
                        <a
                          href={`mailto:${inq.email}`}
                          className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors"
                          title="Click to email"
                        >
                          <Mail className="w-3.5 h-3.5 text-zinc-400" />
                          <span>{inq.email}</span>
                        </a>
                      )}

                      {inq.phone ? (
                        <a
                          href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMessage)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors"
                          title="Open WhatsApp chat with client"
                        >
                          <WhatsApp className="w-3.5 h-3.5 fill-current text-zinc-400" />
                          <span>{inq.phone}</span>
                        </a>
                      ) : (
                        <span className="text-xs font-mono text-zinc-500 flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-zinc-600" />
                          <span>No phone provided</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-white/[0.04] border border-white/10 text-[11px] font-mono text-zinc-300">
                      {inq.projectType}
                    </span>
                    {inq.budget && (
                      <span className="px-2.5 py-1 rounded bg-white/[0.04] border border-white/10 text-[11px] font-mono text-zinc-300 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-zinc-400" />
                        {inq.budget}
                      </span>
                    )}
                    <span className="text-[11px] font-mono text-zinc-500 ml-1">
                      {formattedDate}
                    </span>
                  </div>
                </div>

                <div className="py-4">
                  <div className="text-[11px] font-mono uppercase text-zinc-500 mb-1">Client Message:</div>
                  <p className="text-zinc-200 text-sm leading-relaxed whitespace-pre-wrap font-light bg-black/20 p-3.5 rounded-xl border border-white/5">
                    {inq.message}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Primary WhatsApp Reply Button */}
                    {cleanPhone ? (
                      <a
                        href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMessage)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold font-mono uppercase transition-all shadow-md hover:scale-[1.02] active:scale-[0.98]"
                        title={`Reply directly to ${inq.name} on WhatsApp`}
                      >
                        <WhatsApp className="w-4 h-4 fill-current" />
                        <span>Reply on WhatsApp</span>
                      </a>
                    ) : null}

                    {/* Reply in Gmail */}
                    {inq.email && (
                      <a
                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(inq.email)}&su=${encodeURIComponent(gmailSubject)}&body=${encodeURIComponent(gmailBody)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/20 hover:bg-white/10 text-zinc-300 hover:text-white text-xs font-semibold font-mono uppercase transition-colors"
                        title="Compose reply in Gmail"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Reply in Gmail</span>
                      </a>
                    )}

                    {!inq.read && (
                      <button
                        onClick={() => markInquiryAsRead(inq.id)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/15 hover:bg-white/10 text-zinc-300 hover:text-white text-xs font-mono transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Mark as Read</span>
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      if (confirm('Delete this inquiry?')) {
                        deleteInquiry(inq.id);
                      }
                    }}
                    className="p-2 rounded-lg hover:bg-red-950/40 text-zinc-500 hover:text-red-400 border border-transparent hover:border-red-500/20 transition-colors"
                    title="Delete Inquiry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
