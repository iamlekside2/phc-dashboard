export const NIGERIAN_STATES = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno',
  'Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT','Gombe',
  'Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara',
  'Lagos','Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau',
  'Rivers','Sokoto','Taraba','Yobe','Zamfara'
];

export const LGAS_BY_STATE = {
  'Abia':['Aba North','Aba South','Arochukwu','Bende','Ikwuano','Isiala Ngwa'],
  'Adamawa':['Demsa','Fufore','Ganye','Girei','Gombi','Yola North','Yola South'],
  'Akwa Ibom':['Abak','Eastern Obolo','Eket','Ikono','Ikot Abasi','Uyo'],
  'Anambra':['Aguata','Awka North','Awka South','Idemili North','Nnewi North','Onitsha'],
  'Bauchi':['Alkaleri','Bauchi','Bogoro','Dass','Gamawa','Tafawa Balewa'],
  'Bayelsa':['Brass','Ekeremor','Kolokuma','Nembe','Ogbia','Yenagoa'],
  'Benue':['Ado','Agatu','Buruku','Gboko','Guma','Makurdi','Otukpo'],
  'Borno':['Bama','Chibok','Damboa','Jere','Konduga','Maiduguri','Monguno'],
  'Cross River':['Akamkpa','Bekwarra','Calabar Municipal','Calabar South','Ikom','Ogoja'],
  'Delta':['Aniocha North','Burutu','Ethiope East','Oshimili South','Uvwie','Warri South'],
  'Ebonyi':['Abakaliki','Afikpo North','Ebonyi','Ikwo','Ishielu','Ohaukwu'],
  'Edo':['Akoko-Edo','Benin City','Egor','Ikpoba-Okha','Oredo','Ovia North'],
  'Ekiti':['Ado-Ekiti','Efon','Ekiti West','Gbonyin','Ido-Osi','Ikere'],
  'Enugu':['Aninri','Enugu East','Enugu North','Enugu South','Nsukka','Udi'],
  'FCT':['Abaji','Bwari','Gwagwalada','Kuje','Kwali','Municipal'],
  'Gombe':['Akko','Balanga','Billiri','Dukku','Gombe','Nafada','Yamaltu'],
  'Imo':['Aboh Mbaise','Ahiazu Mbaise','Ideato North','Owerri Municipal','Owerri North','Owerri West'],
  'Jigawa':['Auyo','Babura','Birnin Kudu','Dutse','Garki','Hadejia','Ringim'],
  'Kaduna':['Chikun','Giwa','Igabi','Kaduna North','Kaduna South','Kawo','Zaria'],
  'Kano':['Dala','Fagge','Gwale','Kano Municipal','Kumbotso','Nassarawa','Tarauni'],
  'Katsina':['Batagarawa','Daura','Dutsin-Ma','Funtua','Jibia','Katsina','Malumfashi'],
  'Kebbi':['Argungu','Bagudo','Birnin Kebbi','Bunza','Gwandu','Jega','Yauri'],
  'Kogi':['Adavi','Ajaokuta','Dekina','Idah','Kabba','Lokoja','Okene'],
  'Kwara':['Asa','Ilorin East','Ilorin South','Ilorin West','Moro','Offa','Oyun'],
  'Lagos':['Agege','Ajeromi-Ifelodun','Alimosho','Eti-Osa','Ikeja','Lagos Island','Surulere'],
  'Nasarawa':['Akwanga','Doma','Karu','Keffi','Lafia','Nasarawa','Toto'],
  'Niger':['Agaie','Bida','Bosso','Chanchaga','Kontagora','Minna','Suleja'],
  'Ogun':['Abeokuta North','Abeokuta South','Ado-Odo','Ifo','Ijebu Ode','Obafemi Owode','Sagamu'],
  'Ondo':['Akure North','Akure South','Idanre','Ile Oluji','Okitipupa','Ondo West','Owo'],
  'Osun':['Atakumosa','Ede North','Ife Central','Ife East','Ilesha West','Osogbo','Iwo'],
  'Oyo':['Afijio','Akinyele','Ibadan North','Ibadan South','Ido','Ogbomoso North','Oyo East'],
  'Plateau':['Barkin Ladi','Bassa','Jos East','Jos North','Jos South','Mangu','Riyom'],
  'Rivers':['Bonny','Eleme','Obio-Akpor','Okrika','Oyigbo','Port Harcourt','Tai'],
  'Sokoto':['Bodinga','Dange-Shuni','Gwadabawa','Illela','Sokoto North','Sokoto South','Wamako'],
  'Taraba':['Ardo Kola','Bali','Gashaka','Ibi','Jalingo','Takum','Wukari'],
  'Yobe':['Bursari','Damaturu','Fika','Geidam','Nguru','Potiskum','Yusufari'],
  'Zamfara':['Anka','Bakura','Bungudu','Gummi','Gusau','Kaura Namoda','Talata Mafara'],
};

export const DIAGNOSES = [
  'Malaria','Typhoid Fever','Hypertension','Diabetes','Pneumonia','Diarrhea',
  'Tuberculosis','Anemia','Skin Infections','Eye Infections','STIs',
  'Malnutrition','Arthritis','Asthma','Urinary Tract Infection'
];

export const DRUGS = [
  'Artemether-Lumefantrine','Amoxicillin','Metformin','Lisinopril','ORS Sachets',
  'Paracetamol','Cotrimoxazole','Vitamin A','Iron Supplements','Albendazole',
  'Folic Acid','Omeprazole','Diazepam','Ciprofloxacin','Oral Contraceptives'
];

export const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export const VACCINE_TYPES = ['BCG','OPV','DPT','Measles','Hepatitis B','Yellow Fever'];

export const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

export const HOURS = Array.from({ length: 12 }, (_, i) => `${7 + i}:00`);

export const NATIONAL = {
  totalPHCs: 6247,
  totalVisits: 1847392,
  ancVisits: 312004,
  deliveries: 48203,
  immunisations: 891230,
  referrals: 23891,
  staffCount: 41203,
  drugAdequacy: 73,
};
