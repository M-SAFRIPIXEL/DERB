import React from 'react';
import { Copy, Download } from 'lucide-react';
import { DBSubscriber } from '../../lib/firebaseService';

interface SubscribersTabProps {
  subscribers: DBSubscriber[];
  onCopySubscribers: () => void;
  onDownloadCSV: () => void;
}

export const SubscribersTab: React.FC<SubscribersTabProps> = ({
  subscribers,
  onCopySubscribers,
  onDownloadCSV,
}) => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">
            أعضاء نادي فيلوستوريا والمشتركون في الإعلانات ({subscribers.length})
          </h1>
          <p className="text-xs text-white/50">
            قائمة الإيميلات المسجلة للحصول على إشعارات الكبسولات والإصدارات المحدودة.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onCopySubscribers}
            className="px-3.5 py-2 bg-[#1A1A1A] hover:bg-[#252525] border border-[#333] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition"
          >
            <Copy className="w-3.5 h-3.5 text-[#CCFF00]" />
            <span>نسخ جميع الإيميلات</span>
          </button>
          <button
            onClick={onDownloadCSV}
            className="px-3.5 py-2 bg-[#CCFF00] hover:bg-[#b8e600] text-black font-black rounded-xl text-xs flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>تحميل كملف CSV</span>
          </button>
        </div>
      </div>

      <div className="bg-[#141414] border border-[#222] rounded-2xl overflow-hidden">
        <div className="p-3 bg-[#1B1B1B] border-b border-[#222] grid grid-cols-12 text-xs font-bold text-white/60">
          <span className="col-span-8">البريد الإلكتروني للزبون</span>
          <span className="col-span-4 text-left">تاريخ الاشتراك</span>
        </div>
        <div className="divide-y divide-[#1C1C1C] max-h-96 overflow-y-auto">
          {subscribers.length === 0 ? (
            <div className="p-8 text-center text-xs text-white/40">لا يوجد مشتركون مسجلون بعد</div>
          ) : (
            subscribers.map((sub) => (
              <div
                key={sub.id}
                className="p-3 grid grid-cols-12 text-xs hover:bg-[#181818] transition items-center"
              >
                <span className="col-span-8 font-mono text-[#CCFF00] truncate">{sub.email}</span>
                <span className="col-span-4 font-mono text-white/40 text-left text-[11px]">
                  {new Date(sub.subscribedAt).toLocaleDateString('ar-MA')}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
