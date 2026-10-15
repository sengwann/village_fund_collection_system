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
  "nav.villages": "ကျေးရွာမျ`ား",
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

  // Membership rejoin
  "rejoin.title": "အိမ်ထောင်စုသို့ ပြန်လည်ဝင်ရောက်ရန်",
  "rejoin.subtitle":
    "{village} သို့ ပြန်လည်ဝင်ရောက်ရန် သင့်အိမ်ကို ရွေးပြီး တောင်းဆိုမှု အသစ် ပို့ပါ။",
  "rejoin.villageFallback": "ဤကျေးရွာ",
  "rejoin.statusRejectedTitle": "သင့်အဖွဲ့ဝင်ခွင့် တောင်းဆိုမှုကို ပယ်ချခဲ့သည်",
  "rejoin.statusRemovedTitle": "သင့်ကို အိမ်ထောင်စုမှ ဖယ်ရှားထားသည်",
  "rejoin.statusBody":
    "{village} ကို ဆက်လက်အသုံးပြုရန် အောက်တွင် အိမ်ထောင်စု တောင်းဆိုမှု အသစ် ပို့ပါ။",
  "rejoin.village": "ကျေးရွာ",
  "rejoin.membership": "အဖွဲ့ဝင်အခြေအနေ",
  "rejoin.formTitle": "အိမ်ထောင်စု တောင်းဆိုမှု အသစ်",
  "rejoin.formDesc": "ပြန်လည်ဝင်ရောက်လိုသော အိမ်ကို ရွေးပါ။",
  "rejoin.houseLabel": "အိမ်နံပါတ်",
  "rejoin.housePlaceholder": "အိမ်နံပါတ် ရွေးပါ",
  "rejoin.houseRequired": "ဆက်လက်ရန် အိမ်နံပါတ် ရွေးပါ။",
  "rejoin.nextTitle": "နောက်ဆက်တွဲ ဖြစ်မည့်အရာ",
  "rejoin.nextHasMembersTitle":
    "အိမ်တွင် လက်ရှိ အဖွဲ့ဝင်များ ရှိပြီးသား ဖြစ်လျှင်",
  "rejoin.nextHasMembersBody":
    "အိမ်ထောင်စုခေါင်းဆောင်က အတည်ပြုသည်အထိ သင့်တောင်းဆိုမှု စောင့်ဆိုင်းနေမည်။",
  "rejoin.nextEmptyTitle": "အိမ်တွင် လက်ရှိ အဖွဲ့ဝင် မရှိလျှင်",
  "rejoin.nextEmptyBody": "သင်သည် ချက်ချင်း အိမ်ထောင်စုခေါင်းဆောင် ဖြစ်လာမည်။",
  "rejoin.submit": "ပြန်လည်ဝင်ရောက်ရန် တောင်းဆိုမည်",
  "rejoin.submitting": "တောင်းဆိုမှု ပို့နေသည်...",
  "rejoin.noHousesTitle": "အသုံးပြုနေသော အိမ် မရှိသေးပါ",
  "rejoin.noHousesBody":
    "ဤကျေးရွာတွင် အသုံးပြုနေသော အိမ် မရှိသေးပါ။ ကျေးရွာ အုပ်ချုပ်ရေးမှူးကို ဆက်သွယ်ပါ။",
  "rejoin.signedInAs": "ဝင်ရောက်ထားသူ",

  // Forbidden page (Feature T)
  "forbidden.title": "ဝင်ရောက်ခွင့် မရှိပါ",
  "forbidden.body": "ဤစာမျက်နှာကို ကြည့်ရှုရန် သင့်တွင် ခွင့်ပြုချက် မရှိပါ။",
  "forbidden.hint":
    "ဤစာမျက်နှာသည် သင့်အကောင့်အတွက် မဟုတ်ပါက ဒက်ရှ်ဘုတ်သို့ ပြန်သွားပါ။ ဝင်ခွင့်ရှိသင့်သည်ဟု ယူဆပါက ကျေးရွာ အုပ်ချုပ်ရေးမှူးကို ဆက်သွယ်ပါ။",
  "forbidden.goHome": "ကျွန်ုပ်၏ ဒက်ရှ်ဘုတ်သို့ သွားရန်",

  // Platform admin dashboard (Feature D)
  "adminDashboard.title": "ပလက်ဖောင်း ဒက်ရှ်ဘုတ်",
  "adminDashboard.description":
    "စနစ်ရှိ ကျေးရွာအားလုံးကို အကျဉ်းချုပ် ကြည့်ရန်။",
  "adminDashboard.create": "ကျေးရွာ ဖန်တီးရန်",
  "adminDashboard.statusTitle": "အခြေအနေအလိုက် ကျေးရွာများ",
  "adminDashboard.totalVillages": "ကျေးရွာ စုစုပေါင်း",
  "adminDashboard.chartLabel":
    "ကျေးရွာ {total} ခု - လက်ရှိ {active} ခု၊ ယာယီရပ်ဆိုင်း {suspended} ခု၊ ပိတ်သိမ်း {deactivated} ခု",
  "adminDashboard.status.active": "လက်ရှိ အသုံးပြုနေသည်",
  "adminDashboard.status.suspended": "ယာယီ ရပ်ဆိုင်းထားသည်",
  "adminDashboard.status.deactivated": "ပိတ်သိမ်းထားသည်",
  "adminDashboard.suspendedOne": "ကျေးရွာ {count} ခု ယာယီ ရပ်ဆိုင်းထားသည်",
  "adminDashboard.suspendedOther": "ကျေးရွာ {count} ခု ယာယီ ရပ်ဆိုင်းထားသည်",
  "adminDashboard.review": "စစ်ဆေးရန်",
  "adminDashboard.recent": "မကြာသေးမီက ကျေးရွာများ",
  "adminDashboard.viewAll": "အားလုံး ကြည့်ရန်",
  "adminDashboard.created": "ဖန်တီးသည့်ရက် {date}",
  "adminDashboard.emptyTitle": "ကျေးရွာ မရှိသေးပါ",
  "adminDashboard.emptyBody": "စတင်ရန် ပထမဆုံး ကျေးရွာကို ဖန်တီးပါ။",

  // Village directory and management (Feature E)
  "adminVillages.title": "ကျေးရွာများ",
  "adminVillages.description":
    "ပလက်ဖောင်းရှိ ကျေးရွာအားလုံးကို ရှာဖွေ၊ စစ်ဆေးပြီး စီမံပါ။",
  "adminVillages.create": "ကျေးရွာ ဖန်တီးရန်",
  "adminVillages.searchLabel": "ကျေးရွာ ရှာရန်",
  "adminVillages.searchPlaceholder": "ကုဒ် သို့မဟုတ် အမည်ဖြင့် ရှာပါ",
  "adminVillages.clearSearch": "ရှာဖွေမှု ဖျက်ရန်",
  "adminVillages.filterLabel": "အခြေအနေအလိုက် စစ်ထုတ်ရန်",
  "adminVillages.filterAll": "အားလုံး",
  "adminVillages.resultCount": "ကျေးရွာ {total} ခုအနက် {shown} ခု ပြသနေသည်",
  "adminVillages.emptyTitle": "ကျေးရွာ မရှိသေးပါ",
  "adminVillages.emptyBody": "စတင်ရန် ပထမဆုံး ကျေးရွာကို ဖန်တီးပါ။",
  "adminVillages.noMatchTitle": "ကိုက်ညီသော ကျေးရွာ မတွေ့ပါ",
  "adminVillages.noMatchBody":
    "အခြား ရှာဖွေမှု သို့မဟုတ် အခြေအနေ စစ်ထုတ်မှုကို စမ်းကြည့်ပါ။",
  "adminVillages.clearFilters": "စစ်ထုတ်မှုများ ဖျက်ရန်",
  "adminVillages.back": "ကျေးရွာများသို့ ပြန်ရန်",
  "adminVillages.new.title": "ကျေးရွာ ဖန်တီးရန်",
  "adminVillages.new.description":
    "ကျေးရွာအသစ်နှင့် ၎င်း၏ ပထမဆုံး အုပ်ချုပ်ရေးမှူး အကောင့်ကို ဖန်တီးပါ။",
  "adminVillages.form.villageTitle": "ကျေးရွာ အချက်အလက်",
  "adminVillages.form.villageDesc":
    "ကျေးရွာသားများသည် ဤကုဒ်ကို ထည့်သွင်း၍ ကျေးရွာသို့ ဝင်ရောက်ရပါမည်။",
  "adminVillages.form.code": "ကျေးရွာကုဒ်",
  "adminVillages.form.codePlaceholder": "ဥပမာ - DEV101",
  "adminVillages.form.codeHint": "တိုတောင်းပြီး တစ်ခုတည်းသာ ရှိရပါမည်။",
  "adminVillages.form.name": "ကျေးရွာအမည်",
  "adminVillages.form.namePlaceholder": "ဥပမာ - ဖွံ့ဖြိုးမှုကျေးရွာသစ်",
  "adminVillages.form.chiefTitle": "ပထမဆုံး အုပ်ချုပ်ရေးမှူး အကောင့်",
  "adminVillages.form.chiefDesc":
    "အုပ်ချုပ်ရေးမှူးသည် ဤကျေးရွာ၏ အိမ်များ၊ ရန်ပုံငွေများနှင့် ကောက်ခံသူများကို စီမံပါသည်။",
  "adminVillages.form.chiefName": "အုပ်ချုပ်ရေးမှူး အမည်",
  "adminVillages.form.chiefEmail": "အုပ်ချုပ်ရေးမှူး အီးမေးလ်",
  "adminVillages.form.chiefPhone": "အုပ်ချုပ်ရေးမှူး ဖုန်းနံပါတ်",
  "adminVillages.form.phonePlaceholder": "09xxxxxxx",
  "adminVillages.form.contactHint":
    "အုပ်ချုပ်ရေးမှူးသည် အီးမေးလ် သို့မဟုတ် ဖုန်းနံပါတ်ဖြင့် ဝင်ရောက်ပါမည်။",
  "adminVillages.form.password": "ယာယီ စကားဝှက်",
  "adminVillages.form.passwordHint":
    "အုပ်ချုပ်ရေးမှူးထံ လုံခြုံစွာ ပေးပို့ပါ။ ဝင်ရောက်ပြီးနောက် ပြောင်းလဲသင့်ပါသည်။",
  "adminVillages.form.submit": "ကျေးရွာ ဖန်တီးရန်",
  "adminVillages.form.submitting": "ကျေးရွာ ဖန်တီးနေသည်...",
  "adminVillages.form.errorTitle": "ကျေးရွာ ဖန်တီး၍ မရပါ",
  "adminVillages.form.fixFields":
    "အမှတ်အသားပြထားသော အကွက်များကို စစ်ဆေးပြီး ထပ်ကြိုးစားပါ။",
  "adminVillages.form.generic": "ကျေးရွာ ဖန်တီး၍ မရပါ။ ထပ်ကြိုးစားပါ။",
  "adminVillages.err.codeExists": "ဤကျေးရွာကုဒ် ရှိပြီးသား ဖြစ်သည်။",
  "adminVillages.err.emailExists":
    "ဤအီးမေးလ်ဖြင့် အုပ်ချုပ်ရေးမှူး အကောင့် ရှိပြီးသား ဖြစ်သည်။",
  "adminVillages.err.phoneExists":
    "ဤဖုန်းနံပါတ်ဖြင့် အုပ်ချုပ်ရေးမှူး အကောင့် ရှိပြီးသား ဖြစ်သည်။",
  "adminVillages.err.exists":
    "ဤအချက်အလက်များဖြင့် ကျေးရွာ သို့မဟုတ် အုပ်ချုပ်ရေးမှူး အကောင့် ရှိပြီးသား ဖြစ်သည်။",
  "adminVillages.detail.infoTitle": "ကျေးရွာ အချက်အလက်",
  "adminVillages.detail.code": "ကျေးရွာကုဒ်",
  "adminVillages.detail.name": "ကျေးရွာအမည်",
  "adminVillages.detail.status": "အခြေအနေ",
  "adminVillages.detail.createdAt": "ဖန်တီးသည့်ရက်",
  "adminVillages.detail.updatedAt": "နောက်ဆုံး ပြင်ဆင်သည့်ရက်",
  "adminVillages.detail.lifecycleTitle": "အခြေအနေနှင့် လုပ်ဆောင်ချက်များ",
  "adminVillages.statusDesc.active":
    "ဤကျေးရွာသည် လက်ရှိ ပုံမှန် အသုံးပြုနေဆဲ ဖြစ်သည်။",
  "adminVillages.statusDesc.suspended":
    "ဤကျေးရွာကို ယာယီ ရပ်ဆိုင်းထားသည်။ မည်သည့်အချိန်တွင်မဆို ပြန်ဖွင့်နိုင်သည်။",
  "adminVillages.statusDesc.deactivated":
    "ဤကျေးရွာကို ပိတ်သိမ်းထားသည်။ စီမံနိုင်သော လုပ်ဆောင်ချက် မရှိတော့ပါ။ ကျေးရွာ မှတ်တမ်းနှင့် သမိုင်းကြောင်း ဒေတာများကို ဆက်လက် သိမ်းဆည်းထားသည်။",
  "adminVillages.suspend.button": "ကျေးရွာ ယာယီ ရပ်ဆိုင်းရန်",
  "adminVillages.suspend.hint":
    "ဤကျေးရွာကို ယာယီ ရပ်ဆိုင်းပါ။ နောက်မှ ပြန်ဖွင့်နိုင်သည်။",
  "adminVillages.reactivate.button": "ကျေးရွာ ပြန်ဖွင့်ရန်",
  "adminVillages.reactivate.hint":
    "ဤကျေးရွာကို လက်ရှိ အသုံးပြုနေသော အခြေအနေသို့ ပြန်ထားပါ။",
  "adminVillages.deactivate.title": "ကျေးရွာ ပိတ်သိမ်းရန်",
  "adminVillages.deactivate.hint":
    "ပိတ်သိမ်းခြင်းသည် MVP တွင် နောက်ပြန်လှည့်၍ မရပါ။ ကျေးရွာ မှတ်တမ်းနှင့် သမိုင်းကြောင်း ဒေတာများကို သိမ်းထားသော်လည်း ကျေးရွာအသုံးပြုသူများ ဝင်ရောက်ခွင့် ဆုံးရှုံးမည်။",
  "adminVillages.deactivate.button": "ကျေးရွာ ပိတ်သိမ်းရန်",
  "adminVillages.deactivate.confirmTitle": "ဤကျေးရွာကို ပိတ်သိမ်းမလား။",
  "adminVillages.deactivate.confirmBody":
    "{name} ({code}) ကို ပိတ်သိမ်းပါမည်။ ဤလုပ်ဆောင်ချက်ကို နောက်ပြန်လှည့်၍ မရပါ။ ကျေးရွာအသုံးပြုသူများ ဝင်ရောက်ခွင့် ဆုံးရှုံးမည်ဖြစ်ပြီး မှတ်တမ်းများကို ဆက်လက် သိမ်းထားမည်။",
  "adminVillages.deactivate.confirm": "ဟုတ်ကဲ့၊ ပိတ်သိမ်းမည်",
};
