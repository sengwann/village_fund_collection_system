import type { TranslationKey } from "./en";

export const my: Record<TranslationKey, string> = {
  // Navigation
  "nav.dashboard": "ဒက်ရှ်ဘုတ်",
  "nav.houses": "အိမ်များ",
  "nav.members": "အိမ်ထောင်စုဝင်များ",
  "nav.collectors": "ကောက်ခံသူများ",
  "nav.funds": "ရန်ပုံငွေများ",
  "nav.pay": "ငွေပေးချေရန်",
  "nav.receipts": "ပြေစာများ",
  "nav.verifyKpay": "KPay စစ်ဆေးရန်",
  "nav.cash": "ငွေသား",
  "nav.disputes": "အငြင်းပွားမှုများ",
  "nav.settings": "ဆက်တင်များ",
  "nav.logout": "ထွက်ရန်",
  "nav.platformAudit": "ပလက်ဖောင်း စာရင်းစစ်",
  "nav.villages": "ကျေးရွာများ",
  "nav.auditLog": "စာရင်းစစ် မှတ်တမ်း",

  // Shell
  "shell.platformAdmin": "ပလက်ဖောင်း အက်မင်",
  "shell.villageFundCollection": "ကျေးရွာ ရန်ပုံငွေ စနစ်",
  "shell.membership": "အဖွဲ့ဝင်အခြေအနေ",
  "shell.villageId": "ကျေးရွာ ID",
  "shell.pendingBanner":
    "သင့်အိမ်ထောင်စု အဖွဲ့ဝင်အခြေအနေသည် အတည်ပြုချက် စောင့်ဆိုင်းနေပါသည်။ အိမ်ထောင်စုခေါင်းဆောင်က အတည်ပြုပြီးသည်အထိ အချို့သော လုပ်ဆောင်ချက်များ အသုံးပြု၍ မရပါ။",
  "shell.pendingTitle": "အဖွဲ့ဝင်ခွင့် အတည်ပြုချက် စောင့်ဆိုင်းနေသည်",
  "shell.skipToContent": "အဓိက အကြောင်းအရာသို့ ကျော်ရန်",
  "shell.mainNavigation": "အဓိက မီနူး",
  "shell.menu": "မီနူး",
  "shell.closeMenu": "မီနူး ပိတ်ရန်",
  "shell.account": "အကောင့်",
  "shell.unavailable": "မရနိုင်သေးပါ",
  "shell.hasAlerts": "အာရုံစိုက်ရန် ရှိသည်",
  "shell.role.systemAdmin": "စနစ် အက်မင်",
  "shell.role.chief": "ကျေးရွာ အုပ်ချုပ်ရေးမှူး",
  "shell.role.villager": "ကျေးရွာသား",
  "shell.membership.active": "လက်ရှိ အဖွဲ့ဝင်",
  "shell.membership.pending": "စောင့်ဆိုင်းဆဲ",
  "shell.membership.rejected": "ပယ်ချခံရသည်",
  "shell.membership.removed": "ဖယ်ရှားခံရသည်",
  "shell.attention.title": "အာရုံစိုက်ရန်",
  "shell.attention.view": "ကြည့်ရန်",
  "shell.attention.disputesOne":
    "အငြင်းပွားမှု {count} ခု စစ်ဆေးရန် စောင့်ဆိုင်းနေသည်",
  "shell.attention.disputesOther":
    "အငြင်းပွားမှု {count} ခု စစ်ဆေးရန် စောင့်ဆိုင်းနေသည်",
  "shell.attention.noCollector":
    "လက်ရှိကာလအတွက် တာဝန်ပေးထားသော ကောက်ခံသူ မရှိပါ",
  "shell.attention.noFund": "အသုံးပြုနေသော ရန်ပုံငွေ မရှိပါ — ငွေကောက်ခံ၍ မရပါ",
  "shell.attention.kpayOne":
    "KPay ငွေပေးချေမှု {count} ခု စစ်ဆေးရန် စောင့်ဆိုင်းနေသည်",
  "shell.attention.kpayOther":
    "KPay ငွေပေးချေမှု {count} ခု စစ်ဆေးရန် စောင့်ဆိုင်းနေသည်",
  "shell.attention.rejectedOne":
    "ပယ်ချခံရသော ငွေပေးချေမှု {count} ခု — ပြန်တင်ပါ သို့မဟုတ် အငြင်းပွားပါ",
  "shell.attention.rejectedOther":
    "ပယ်ချခံရသော ငွေပေးချေမှု {count} ခု — ပြန်တင်ပါ သို့မဟုတ် အငြင်းပွားပါ",
  "shell.attention.membersOne":
    "အဖွဲ့ဝင်ခွင့် တောင်းဆိုမှု {count} ခု စောင့်ဆိုင်းနေသည်",
  "shell.attention.membersOther":
    "အဖွဲ့ဝင်ခွင့် တောင်းဆိုမှု {count} ခု စောင့်ဆိုင်းနေသည်",
  "shell.chief.title": "ကျေးရွာ အုပ်ချုပ်ရေးမှူး",
  "shell.chief.name": "အမည်",
  "shell.chief.phone": "ဖုန်း",
  "shell.chief.call": "ဖုန်းခေါ်ရန်",
  "shell.comingSoon": "မကြာမီ ရောက်ရှိမည်",
  "shell.soon": "မကြာမီ",
  "settings.membership": "အဖွဲ့ဝင်အခြေအနေ",
  "settings.accountNote":
    "ရာထူး၊ ကျေးရွာ၊ အိမ်နှင့် အဖွဲ့ဝင်အခြေအနေတို့ကို ကျေးရွာ အုပ်ချုပ်ရေးမှူးများက စီမံပြီး ဤနေရာတွင် ပြင်ဆင်၍ မရပါ။",

  // Settings page
  "settings.title": "ဆက်တင်များ",
  "settings.subtitle": "သင့်အကောင့်၊ လုံခြုံရေးနှင့် ဦးစားပေးများကို စီမံပါ။",
  "settings.backToDashboard": "ဒက်ရှ်ဘုတ်သို့ ပြန်ရန်",
  "settings.accountInfo": "အကောင့် အချက်အလက်",
  "settings.role": "ရာထူး",
  "settings.village": "ကျေးရွာ",
  "settings.house": "အိမ်",
  "settings.membershipStatus": "အဖွဲ့ဝင်အခြေအနေ",
  "settings.readOnlyNote":
    "ရာထူး၊ ကျေးရွာ၊ အိမ်နှင့် အဖွဲ့ဝင်အခြေအနေတို့ကို ကျေးရွာ အုပ်ချုပ်ရေးမှူးများက စီမံပြီး ဤနေရာတွင် ပြင်ဆင်၍ မရပါ။",
  "settings.editProfile": "ပရိုဖိုင် တည်းဖြတ်ရန်",
  "settings.changePassword": "စကားဝှက် ပြောင်းရန်",
  "settings.preferences": "ဦးစားပေးများ",
  "settings.appearance": "အသွင်အပြင်",
  "settings.language": "ဘာသာစကား",
  "settings.saveSettings": "ဆက်တင်များ သိမ်းရန်",
  "settings.saving": "သိမ်းဆည်းနေသည်...",

  // Profile form
  "profile.name": "အမည်",
  "profile.email": "အီးမေးလ်",
  "profile.phone": "ဖုန်း",
  "profile.saveProfile": "ပရိုဖိုင် သိမ်းရန်",
  "profile.saving": "သိမ်းဆည်းနေသည်...",
  "profile.identifierError":
    "အနည်းဆုံး ဝင်ရောက်မှု နည်းလမ်း တစ်ခု ပေးပါ - အီးမေးလ် သို့မဟုတ် ဖုန်း။",

  // Password form
  "password.current": "လက်ရှိ စကားဝှက်",
  "password.new": "စကားဝှက် အသစ်",
  "password.confirm": "စကားဝှက် အသစ် အတည်ပြုရန်",
  "password.change": "စကားဝှက် ပြောင်းရန်",
  "password.changing": "ပြောင်းလဲနေသည်...",
  "password.hint": "အနည်းဆုံး ၈ လုံးမှ အများဆုံး ၇၂ လုံး ဖြစ်ရပါမည်။",
  "password.success": "စကားဝှက် အောင်မြင်စွာ ပြောင်းလဲပြီးပါပြီ။",

  // Theme options
  "theme.light": "အလင်း",
  "theme.dark": "အမှောင်",
  "theme.system": "စနစ်",

  // Language options
  "language.en": "English",
  "language.my": "မြန်မာ",

  // Common
  "common.loading": "ဖတ်နေသည်...",
  "common.error": "တစ်ခုခု မှားယွင်းသွားပါသည်။ ထပ်ကြိုးစားပါ။",
  "common.save": "သိမ်းရန်",
  "common.cancel": "ပယ်ဖျက်ရန်",
  "common.back": "နောက်သို့",
};
