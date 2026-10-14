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

  // Login
  "login.title": "ဝင်ရောက်ရန်",
  "login.subtitle":
    "ဆက်လက်ရန် အီးမေးလ် သို့မဟုတ် ဖုန်းနံပါတ်နှင့် စကားဝှက်ကို ထည့်ပါ။",
  "login.identifier": "အီးမေးလ် သို့မဟုတ် ဖုန်း",
  "login.identifierPlaceholder": "you@example.com သို့မဟုတ် 09xxxxxxx",
  "login.password": "စကားဝှက်",
  "login.showPassword": "စကားဝှက် ပြရန်",
  "login.hidePassword": "စကားဝှက် ဖျောက်ရန်",
  "login.submit": "ဝင်ရောက်ရန်",
  "login.submitting": "ဝင်ရောက်နေသည်...",
  "login.registeredTitle": "စာရင်းသွင်းမှု အောင်မြင်ပါသည်",
  "login.registeredBody": "ကျေးဇူးပြု၍ ဝင်ရောက်ပါ။",
  "login.errorTitle": "ဝင်ရောက်၍ မရပါ",
  "login.errorInvalid":
    "အချက်အလက် မမှန်ကန်ပါ။ အီးမေးလ် သို့မဟုတ် ဖုန်းနှင့် စကားဝှက်ကို စစ်ဆေးပြီး ထပ်ကြိုးစားပါ။",
  "login.noAccount": "အကောင့် မရှိသေးဘူးလား။",
  "login.createAccount": "အကောင့် ဖွင့်ရန်",
  "login.language": "ဘာသာစကား",
  "login.brandTagline":
    "ကျေးရွာ ရန်ပုံငွေများကို ရှင်းလင်းပြီး တာဝန်ခံမှုရှိစွာ စီမံခြင်း။",
  "login.brandPointPay":
    "KPay သို့မဟုတ် ငွေသားဖြင့် ပေးချေပြီး ငွေပေးချေမှုတိုင်းကို ခြေရာခံနိုင်သည်",
  "login.brandPointReceipts": "ပြေစာများကို အချိန်မရွေး ပြန်ကြည့်နိုင်သည်",
  "login.brandPointVillage":
    "အိမ်ထောင်စုများ၊ ကောက်ခံသူများနှင့် ရန်ပုံငွေများကို တစ်နေရာတည်းတွင် စီမံနိုင်သည်",

  // Signup and villager registration
  "signup.stepOf": "အဆင့် {current} / {total}",
  "signup.stepsLabel": "စာရင်းသွင်းမှု တိုးတက်မှု",
  "signup.stepVillage": "ကျေးရွာကုဒ်",
  "signup.stepDetails": "သင့်အချက်အလက်",
  "signup.codeTitle": "သင့်ကျေးရွာသို့ ဝင်ရောက်ရန်",
  "signup.codeSubtitle":
    "စာရင်းသွင်းရန် ကျေးရွာ အုပ်ချုပ်ရေးမှူးထံမှ ရရှိသော ကျေးရွာကုဒ်ကို ထည့်ပါ။",
  "signup.codeLabel": "ကျေးရွာကုဒ်",
  "signup.codePlaceholder": "ဥပမာ - DEV100",
  "signup.codeHint":
    "ကျေးရွာကုဒ်ကို သင့်ကျေးရွာ အုပ်ချုပ်ရေးမှူးထံမှ ရယူနိုင်သည်။",
  "signup.codeSubmit": "ဆက်လက်ရန်",
  "signup.codeChecking": "ကျေးရွာကုဒ် စစ်ဆေးနေသည်...",
  "signup.invalidCode": "ကျေးရွာကုဒ် မမှန်ကန်ပါ။ စစ်ဆေးပြီး ထပ်ကြိုးစားပါ။",
  "signup.haveAccount": "အကောင့် ရှိပြီးသားလား။",
  "signup.signIn": "ဝင်ရောက်ရန်",
  "signup.registerTitle": "အကောင့် ဖွင့်ရန်",
  "signup.registerSubtitle":
    "ကျေးရွာသား အကောင့်ဖွင့်ပြီး အိမ်တစ်အိမ်သို့ ဝင်ရောက်ပါ။",
  "signup.village": "သင့်ကျေးရွာ",
  "signup.changeVillage": "ကျေးရွာ ပြောင်းရန်",
  "signup.sectionAbout": "သင့်အကြောင်း",
  "signup.name": "အမည်အပြည့်အစုံ",
  "signup.dob": "မွေးသက္ကရာဇ်",
  "signup.optional": "မဖြည့်လည်းရ",
  "signup.dobHint": "နောက်မှ ဆက်တင်များတွင် ထည့်နိုင်သည်။",
  "signup.sectionSignIn": "ဝင်ရောက်မည့် နည်းလမ်း",
  "signup.signInIntro":
    "အီးမေးလ်၊ ဖုန်းနံပါတ် သို့မဟုတ် နှစ်မျိုးလုံး ထည့်ပါ။ အနည်းဆုံး တစ်မျိုး လိုအပ်ပါသည်။",
  "signup.email": "အီးမေးလ်",
  "signup.phone": "ဖုန်းနံပါတ်",
  "signup.phonePlaceholder": "09xxxxxxx",
  "signup.password": "စကားဝှက်",
  "signup.sectionHouse": "သင့်အိမ်",
  "signup.houseNumber": "အိမ်နံပါတ်",
  "signup.housePlaceholder": "အိမ်နံပါတ် ရွေးပါ",
  "signup.houseHint":
    "ကျေးရွာ အုပ်ချုပ်ရေးမှူး ဖန်တီးထားသော အိမ်နံပါတ်ကို ရွေးပါ။",
  "signup.houseNote":
    "အိမ်တစ်အိမ်တွင် ပထမဆုံး စာရင်းသွင်းသူသည် ထိုအိမ်၏ အိမ်ထောင်စုခေါင်းဆောင် ဖြစ်လာပြီး ချက်ချင်း အတည်ပြုခံရမည်။ အခြားသူများမှာ အိမ်ထောင်စုခေါင်းဆောင်၏ အတည်ပြုချက်ကို စောင့်ရပါမည်။",
  "signup.submit": "အကောင့် ဖွင့်ရန်",
  "signup.submitting": "အကောင့် ဖွင့်နေသည်...",
  "signup.errorTitle": "အကောင့် ဖွင့်၍ မရပါ",
  "signup.fixFields":
    "အမှတ်အသားပြထားသော အကွက်များကို စစ်ဆေးပြီး ထပ်ကြိုးစားပါ။",
  "signup.err.name": "အမည်သည် အက္ခရာ ၂ လုံးမှ ၁၀၀ လုံးအတွင်း ဖြစ်ရပါမည်။",
  "signup.err.email": "အီးမေးလ် မမှန်ကန်ပါ။",
  "signup.err.phone": "ဖုန်းနံပါတ် မမှန်ကန်ပါ။",
  "signup.err.identifier":
    "အီးမေးလ် သို့မဟုတ် ဖုန်းနံပါတ် အနည်းဆုံး တစ်ခု ထည့်ပါ။",
  "signup.err.password":
    "စကားဝှက်သည် အက္ခရာ ၈ လုံးမှ ၇၂ လုံးအတွင်း ဖြစ်ရပါမည်။",
  "signup.err.houseNumber": "မှန်ကန်သော အိမ်နံပါတ်ကို ရွေးပါ။",
  "signup.err.dob": "မွေးသက္ကရာဇ် မမှန်ကန်ပါ။ အနာဂတ်ရက် မဖြစ်ရပါ။",
  "signup.err.houseUnavailable": "ရွေးထားသော အိမ်ကို အသုံးပြု၍ မရပါ။",
  "signup.err.emailExists": "ဤအီးမေးလ်ဖြင့် အကောင့် ရှိပြီးသား ဖြစ်သည်။",
  "signup.err.phoneExists": "ဤဖုန်းနံပါတ်ဖြင့် အကောင့် ရှိပြီးသား ဖြစ်သည်။",
  "signup.err.accountExists": "ဤအချက်အလက်များဖြင့် အကောင့် ရှိပြီးသား ဖြစ်သည်။",
  "signup.err.generic": "အကောင့် ဖွင့်၍ မရပါ။ ထပ်ကြိုးစားပါ။",
  "signup.noHousesTitle": "အိမ်များ မရှိသေးပါ",
  "signup.noHousesBody":
    "{village} တွင် အသုံးပြုနေသော အိမ်နံပါတ် မရှိသေးပါ။ ကျေးရွာ အုပ်ချုပ်ရေးမှူးကို ဆက်သွယ်ပါ။",
  "signup.backToCode": "ကျေးရွာကုဒ်သို့ ပြန်ရန်",

  // Settings (Feature Q additions)
  "settings.profileDesc": "သင့်အမည်နှင့် ဝင်ရောက်မည့် နည်းလမ်း။",
  "settings.kpayTitle": "ငွေပေးချေမှု အချက်အလက်",
  "settings.kpayDesc":
    "KPay ငွေပေးချေမှုများ ကောက်ခံရန် အသုံးပြုသော သင့် KPay အကောင့် အချက်အလက်။",
  "settings.passwordDesc":
    "စကားဝှက် ပြောင်းပြီးနောက် အကောင့်မှ ထွက်သွားမည် ဖြစ်သည်။",
  "settings.preferencesDesc":
    "အက်ပ်တစ်ခုလုံးတွင် အသုံးပြုမည့် ဘာသာစကားကို ရွေးပါ။",
  "settings.saved": "ဆက်တင်များ သိမ်းပြီးပါပြီ။",
  "settings.phonePlaceholder": "09xxxxxxx",
  "profile.dob": "မွေးသက္ကရာဇ်",
  "profile.optional": "မဖြည့်လည်းရ",
  "profile.dobHint":
    "ကျေးရွာ လူဦးရေ စာရင်းအင်းအတွက် အသုံးပြုသည်။ မဖြည့်ဘဲ ထားနိုင်သည်။",
  "profile.signInGroup": "ဝင်ရောက်မည့် နည်းလမ်း",
  "profile.signInIntro":
    "အီးမေးလ်၊ ဖုန်းနံပါတ် သို့မဟုတ် နှစ်မျိုးလုံး ထည့်ပါ။ အနည်းဆုံး တစ်မျိုး လိုအပ်ပါသည်။",
  "profile.saved": "ပရိုဖိုင် သိမ်းပြီးပါပြီ။",
  "kpay.accountName": "KPay အကောင့် အမည်",
  "kpay.accountNumber": "KPay အကောင့် နံပါတ်",
  "kpay.save": "ပြောင်းလဲမှုများ သိမ်းရန်",
  "kpay.saving": "သိမ်းဆည်းနေသည်...",
  "kpay.saved": "ငွေပေးချေမှု အချက်အလက် သိမ်းပြီးပါပြီ။",
  "password.showPasswords": "စကားဝှက်များ ပြရန်",
  "password.signedOut":
    "လုံခြုံရေးအတွက် အကောင့်မှ ထွက်သွားပါပြီ။ စကားဝှက်အသစ်ဖြင့် ပြန်လည် ဝင်ရောက်ပါ။",
  "password.signInAgain": "ပြန်လည် ဝင်ရောက်ရန်",
};
