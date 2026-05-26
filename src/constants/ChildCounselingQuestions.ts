export interface ChildCounselingQuestion {
  id: string;
  en: string;
  ne: string;
}

export const CHILD_COUNSELING_QUESTIONS: ChildCounselingQuestion[] = [
  {
    id: "newborn_vaccination_facility",
    en: "Did you send the newborn baby to the health facility for vaccination?",
    ne: "नवजात शिशुलाई खोप लगाउन स्वास्थ्य संस्थामा पठाउनु भएको हो?",
  },
  {
    id: "bathed_after_24_hours",
    en: "Did you bathe the baby only after 24 hours of birth?",
    ne: "बच्चा जन्मिएको २४ घण्टा पूरा भएपछि मात्र नुहाउनुभएको थियो?",
  },
  // {
  //   id: "sent_for_vaccination_2",
  //   en: "Did you send the new baby to the health facility for vaccination?",
  //   ne: "नयाँ बच्चालाई खोप लगाउन स्वास्थ्य संस्थामा पठाउनु भएको थियो?",
  // },
  {
    id: "all_vaccines_23_months",
    en: "Have you given all necessary vaccines to the child within 23 months?",
    ne: "बच्चालाई २३ महिनाभित्र सबै आवश्यक खोपहरू लगाउनु भएको हो?",
  },
  {
    id: "good_health_condition",
    en: "Is the baby's health condition good?",
    ne: "शिशुको स्वास्थ्य अवस्था राम्रो छ?",
  },
  {
    id: "has_diarrhea",
    en: "Does the child have diarrhea?",
    ne: "बच्चालाई झाडापखाला लागेको छ?",
  },
  {
    id: "has_breathing_problems",
    en: "Does the child have breathing problems?",
    ne: "बच्चालाई श्वासप्रश्वास सम्बन्धी समस्या भएको छ?",
  },
  {
    id: "has_pneumonia",
    en: "Does the child have pneumonia?",
    ne: "बच्चालाई निमोनिया भएको छ?",
  },
  {
    id: "home_treatment_cold",
    en: "Did you advise home treatment for common respiratory problems like a cold?",
    ne: "रुघाखोकी जस्ता सामान्य श्वासप्रश्वास समस्या लागेर घरमै उपचारका लागि सल्लाह दिनुभएको हो?",
  },
  {
    id: "referred_breathing_problems",
    en: "Did you refer to the health facility as needed for breathing problems?",
    ne: "बच्चालाई श्वासप्रश्वास सम्बन्धी समस्या भएर आवश्यक अनुसार स्वास्थ्य संस्थामा रेफर गर्नु भएको हो?",
  },
];

export const MALNUTRITION_CONTENT = {
  title: { en: "Malnutrition", ne: "कुपोषण" },
  main_question: { id: "has_malnutrition", en: "Does the child have malnutrition?", ne: "बच्चालाई कुपोषण लागेको छ?" },
  severity_medium: { en: "Medium", ne: "मध्यम" },
  severity_high: { en: "High", ne: "कडा" },
  sub_questions: [
    { id: "malnutrition_not_cured", en: "Not cured after treatment?", ne: "उपचारपछि निको भएको छैन?" },
    { id: "malnutrition_dropped_out", en: "Stopped going to health facility during treatment?", ne: "उपचार गर्दा गर्दै स्वास्थ्य संस्था जान छोडेको हो?" },
    { id: "malnutrition_no_weight_gain", en: "No weight gain even after treatment?", ne: "उपचार गर्दा पनि तौल वृद्धि भएको छैन?" },
  ]
};

