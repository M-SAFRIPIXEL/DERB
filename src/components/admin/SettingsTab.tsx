import React from 'react';
import { DBStoreSettings } from '../../lib/firebaseService';

interface SettingsTabProps {
  settings: DBStoreSettings;
  onUpdateSettings: (settings: DBStoreSettings) => void;
  onSaveSettings: (settings: DBStoreSettings) => Promise<void>;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  settings,
  onUpdateSettings,
  onSaveSettings,
}) => {
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSaveSettings(settings);
    } catch {
      // Error handled by parent
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-white">إعدادات المتجر والشريط الإخباري</h1>
        <p className="text-xs text-white/50">
          تعديل نص الشريط العلوي الأصفر (Notice Ticker) ورقم هاتف خدمة الواتساب.
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="bg-[#141414] border border-[#222] rounded-3xl p-6 sm:p-8 space-y-5"
      >
        <div className="space-y-2">
          <label className="text-xs font-bold text-white/80 block">نص الشريط العلوي (باللغة العربية):</label>
          <textarea
            rows={2}
            value={settings.announcementAr}
            onChange={(e) => onUpdateSettings({ ...settings, announcementAr: e.target.value })}
            className="w-full p-3 bg-[#0A0A0A] border border-[#333] rounded-xl text-xs text-white focus:outline-none focus:border-[#CCFF00]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-white/80 block">Top Ticker Notice (English):</label>
          <textarea
            rows={2}
            value={settings.announcementEn}
            onChange={(e) => onUpdateSettings({ ...settings, announcementEn: e.target.value })}
            className="w-full p-3 bg-[#0A0A0A] border border-[#333] rounded-xl text-xs text-white focus:outline-none focus:border-[#CCFF00]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/80 block">رقم واتساب خدمة الزبائن:</label>
            <input
              type="text"
              value={settings.whatsappNumber}
              onChange={(e) => onUpdateSettings({ ...settings, whatsappNumber: e.target.value })}
              className="w-full p-3 bg-[#0A0A0A] border border-[#333] rounded-xl text-xs text-white font-mono focus:outline-none focus:border-[#CCFF00]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/80 block">الحد الأدنى للشحن المجاني (درهم مغربي):</label>
            <input
              type="number"
              value={settings.freeShippingThreshold}
              onChange={(e) =>
                onUpdateSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })
              }
              className="w-full p-3 bg-[#0A0A0A] border border-[#333] rounded-xl text-xs text-white font-mono focus:outline-none focus:border-[#CCFF00]"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-[#CCFF00] hover:bg-[#b8e600] text-black font-black rounded-xl text-sm transition font-kvant uppercase tracking-wider"
        >
          حفظ الإعدادات في قاعدة البيانات
        </button>
      </form>
    </div>
  );
};
