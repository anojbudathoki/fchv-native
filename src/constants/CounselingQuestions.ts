export interface CounselingQuestion {
  id: string;
  en: string;
  ne: string;
}

export const COUNCELING_QUESTION_AFTER_PREGNANT: CounselingQuestion[] = [
  {
    id: 'pregnancy_test_referral',
    en: 'Was the client referred to a health facility for a pregnancy test?',
    ne: 'गर्भ जाँचको लागि स्वास्थ्य संस्थामा पठाउनुभयो (रेफर गर्नुभयो)?'
  },
  {
    id: 'labor_starts_advice',
    en: 'Was the client advised to go to a health facility as soon as labor pains start?',
    ne: 'सुत्केरी व्यथा लाग्ने बित्तिकै स्वास्थ्य संस्था जान सल्लाह दिनुभयो?'
  },
]

export const COUNCELING_QUESTION_AFTER_PREGNANT_ONE_TIME: CounselingQuestion[] = [
  {
    id: 'delivery_transport_arranged',
    en: 'Has transportation been arranged to take the client to a health facility for delivery?',
    ne: 'सुत्केरी हुन स्वास्थ्य संस्था जानका लागि गाडी वा यातायातको व्यवस्था मिलाइएको छ?'
  },
  {
    id: 'early_breastfeeding_advice',
    en: 'Was the client advised to start breastfeeding within the first hour of birth?',
    ne: 'बच्चा जन्मेको एक घण्टाभित्रै आमाको दूध खुवाउन सुरु गर्न सल्लाह दिनुभयो?'
  },
  {
    id: 'skin_to_skin_advice',
    en: 'Was the client advised to keep the baby skin-to-skin immediately after birth?',
    ne: 'बच्चा जन्मने बित्तिकै आमाको नाङ्गो छातीमा टाँसेर (न्यानो पारेर) राख्न सल्लाह दिनुभयो?'
  },
  {
    id: "bathed_after_24_hours",
    en: "Did you bathe the baby only after 24 hours of birth?",
    ne: "बच्चा जन्मिएको २४ घण्टा पूरा भएपछि मात्र नुहाउनुभएको थियो?",
  },
]


export const COUNSELING_REFERRAL_QUESTIONS: CounselingQuestion[] = [
  {
    id: 'danger_signs_pregnancy_advice',
    en: 'Was the client advised to go to a health facility immediately if danger signs like bleeding or severe lower abdominal pain appear?',
    ne: 'रगत बग्ने वा तल्लो पेट धेरै दुख्ने जस्ता खतराका लक्षण देखिएमा तुरुन्तै स्वास्थ्य संस्था जान सल्लाह दिनुभयो?'
  },
];

export const COUNSELING_REFERRAL_QUESTIONS_AFTER_CHILD_BORN: CounselingQuestion[] = [
  {
    id: 'danger_signs_postpartum_advice',
    en: 'Was the client advised to go to a health facility immediately if any danger signs appear in the mother or newborn?',
    ne: 'सुत्केरी आमा वा नवजात शिशुमा कुनै खतराका लक्षण देखिएमा तुरुन्तै स्वास्थ्य संस्था जान सल्लाह दिनुभयो?'
  },
  {
    id: 'problem_referral',
    en: 'Was the mother or baby referred to a health facility immediately if a problem arose?',
    ne: 'आमा वा बच्चामा कुनै समस्या देखिएमा तुरुन्तै स्वास्थ्य संस्थामा पठाउनुभयो (रेफर गर्नुभयो)?'
  },
  {
    id: 'exclusive_breastfeeding_advice',
    en: 'Was the client advised to exclusively breastfeed the baby for the first 6 months?',
    ne: 'बच्चा ६ महिना पुगुन्जेल आमाको दूध मात्र खुवाउन (पानी पनि नदिई) सल्लाह दिनुभयो?'
  },
]

export const COUNSELING_REFERRAL_QUESTIONS_ONE_TIME_MOTHER: CounselingQuestion[] = [
  {
    id: 'postnatal_family_care',
    en: 'Are family members taking good care of the postnatal mother?',
    ne: 'परिवारका सदस्यहरूले सुत्केरी आमाको राम्रोसँग हेरचाह गरिरहेका छन्?'
  },
  {
    id: 'family_planning_advice',
    en: 'Was counseling provided on family planning methods?',
    ne: 'परिवार नियोजनका साधनहरूका बारेमा सल्लाह दिनुभयो?'
  },
]
