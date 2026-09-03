import React from 'react';
import { useStudio } from '../../context/StudioContext';
import { Mail, Trash2, CheckCircle2, MessageSquare, ExternalLink, Calendar, DollarSign } from 'lucide-react';

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
            Review incoming project briefs submitted through the showcase website
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

            return (
              <div
                key={inq.id}
                className={`p-6 rounded-2xl glass-panel border transition-all ${
                  inq.read ? 'border-white/10 opacity-80' : 'border-white/30 bg-zinc-900/60'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <div className="flex items-center gap-3">
                      <h4 className="font-display text-lg font-bold text-white">
                        {inq.name}
                      </h4>
                      {!inq.read && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-white text-black font-semibold">
                          New
                        </span>
                      )}
                    </div>
                    <a
                      href={`mailto:${inq.email}`}
                      className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1 mt-0.5"
                    >
                      <Mail className="w-3 h-3" />
                      <span>{inq.email}</span>
                    </a>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-white/[0.04] border border-white/10 text-[11px] font-mono text-zinc-300">
                      {inq.projectType}
                    </span>
                    <span className="px-2.5 py-1 rounded bg-white/[0.04] border border-white/10 text-[11px] font-mono text-zinc-300 flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      {inq.budget}
                    </span>
                    <span className="text-[11px] font-mono text-zinc-500 ml-2">
                      {formattedDate}
                    </span>
                  </div>
                </div>

                <div className="py-4">
                  <p className="text-zinc-200 text-sm leading-relaxed whitespace-pre-wrap font-light">
                    {inq.message}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <a
                      href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(inq.email)}&su=${encodeURIComponent('Regarding your inquiry to AM Studio')}&body=${encodeURIComponent(`Hi ${inq.name},\n\nThank you for reaching out to AM Studio regarding your ${inq.projectType} project.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-black hover:bg-zinc-200 text-xs font-semibold font-mono uppercase transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Reply in Gmail</span>
                    </a>

                    {!inq.read && (
                      <button
                        onClick={() => markInquiryAsRead(inq.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/15 hover:bg-white/10 text-zinc-300 hover:text-white text-xs font-mono transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
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
