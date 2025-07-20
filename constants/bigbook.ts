import { BigBookCategory } from "@/types/bigbook";

export const bigBookData: BigBookCategory[] = [
  {
    id: "forewords",
    title: "Forewords & Prefaces",
    description: "Introduction and historical context of the Big Book",
    sections: [
      {
        id: "preface",
        title: "Preface",
        url: "https://www.aa.org/sites/default/files/2021-11/en_bigbook_preface.pdf",
        pages: "xi-xii",
        description: "Introduction to the fourth edition"
      },
      {
        id: "foreword-first",
        title: "Foreword to First Edition",
        url: "https://www.aa.org/sites/default/files/2021-11/en_bigbook_forewordfirstedition.pdf",
        pages: "xiii-xiv",
        description: "Original 1939 foreword"
      },
      {
        id: "foreword-second",
        title: "Foreword to Second Edition",
        url: "https://www.aa.org/sites/default/files/2021-11/en_bigbook_forewordsecondedition.pdf",
        pages: "xv-xvi",
        description: "1955 edition updates"
      },
      {
        id: "foreword-third",
        title: "Foreword to Third Edition",
        url: "https://www.aa.org/sites/default/files/2021-11/en_bigbook_forewordthirdedition.pdf",
        pages: "xvii-xviii",
        description: "1976 edition updates"
      },
      {
        id: "foreword-fourth",
        title: "Foreword to Fourth Edition",
        url: "https://www.aa.org/sites/default/files/2021-11/en_bigbook_forewordfourthedition.pdf",
        pages: "xix-xx",
        description: "2001 edition updates"
      },
      {
        id: "doctors-opinion",
        title: "The Doctor's Opinion",
        url: "https://www.aa.org/sites/default/files/2021-11/en_bigbook_foreworddoctorsopinion.pdf",
        pages: "xxiii-xxxii",
        description: "Dr. William Silkworth's medical perspective"
      }
    ]
  },
  {
    id: "chapters",
    title: "Main Chapters",
    description: "The core text describing the AA recovery program",
    sections: [
      {
        id: "chapter-1",
        title: "Bill's Story",
        url: "https://www.aa.org/sites/default/files/2021-11/en_bigbook_chapt1.pdf",
        pages: "1-16",
        description: "Co-founder Bill Wilson's personal story"
      },
      {
        id: "chapter-2",
        title: "There Is A Solution",
        url: "https://www.aa.org/sites/default/files/2021-11/en_bigbook_chapt2.pdf",
        pages: "17-29",
        description: "The nature of alcoholism and recovery"
      },
      {
        id: "chapter-3",
        title: "More About Alcoholism",
        url: "https://www.aa.org/sites/default/files/2021-11/en_bigbook_chapt3.pdf",
        pages: "30-43",
        description: "Understanding the disease of alcoholism"
      },
      {
        id: "chapter-4",
        title: "We Agnostics",
        url: "https://www.aa.org/sites/default/files/2021-11/en_bigbook_chapt4.pdf",
        pages: "44-57",
        description: "Spirituality for the skeptical"
      },
      {
        id: "chapter-5",
        title: "How It Works",
        url: "https://www.aa.org/sites/default/files/2021-11/en_bigbook_chapt5.pdf",
        pages: "58-71",
        description: "The Twelve Steps of Alcoholics Anonymous"
      },
      {
        id: "chapter-6",
        title: "Into Action",
        url: "https://www.aa.org/sites/default/files/2021-11/en_bigbook_chapt6.pdf",
        pages: "72-88",
        description: "Working the Steps in daily life"
      },
      {
        id: "chapter-7",
        title: "Working With Others",
        url: "https://www.aa.org/sites/default/files/2021-11/en_bigbook_chapt7.pdf",
        pages: "89-103",
        description: "Helping other alcoholics recover"
      },
      {
        id: "chapter-8",
        title: "To Wives",
        url: "https://www.aa.org/sites/default/files/2021-11/en_bigbook_chapt8.pdf",
        pages: "104-121",
        description: "Guidance for spouses of alcoholics"
      },
      {
        id: "chapter-9",
        title: "The Family Afterward",
        url: "https://www.aa.org/sites/default/files/2021-11/en_bigbook_chapt9.pdf",
        pages: "122-135",
        description: "Rebuilding family relationships"
      },
      {
        id: "chapter-10",
        title: "To Employers",
        url: "https://www.aa.org/sites/default/files/2021-11/en_bigbook_chapt10.pdf",
        pages: "136-150",
        description: "Workplace considerations for alcoholics"
      },
      {
        id: "chapter-11",
        title: "A Vision For You",
        url: "https://www.aa.org/sites/default/files/2021-11/en_bigbook_chapt11.pdf",
        pages: "151-164",
        description: "The future of AA and recovery"
      }
    ]
  },
  {
    id: "personal-stories",
    title: "Personal Stories",
    description: "Real recovery experiences from AA members",
    sections: [
      {
        id: "part-1",
        title: "Part I: Pioneers of A.A.",
        url: "https://www.aa.org/sites/default/files/2021-11/en_bigbook_personalstories_partI.pdf",
        pages: "169-276",
        description: "Stories from early AA members"
      },
      {
        id: "part-2",
        title: "Part II: They Stopped in Time",
        url: "https://www.aa.org/sites/default/files/2021-11/en_bigbook_personalstories_partII.pdf",
        pages: "277-431",
        description: "Stories of those who recovered early"
      },
      {
        id: "part-3",
        title: "Part III: They Lost Nearly All",
        url: "https://www.aa.org/sites/default/files/2021-11/en_bigbook_personalstories_partIII.pdf",
        pages: "435-559",
        description: "Stories of those who hit bottom hard"
      }
    ]
  },
  {
    id: "appendices",
    title: "Appendices",
    description: "Additional resources and perspectives",
    sections: [
      {
        id: "appendix-1",
        title: "I. The A.A. Tradition",
        url: "https://www.aa.org/sites/default/files/2021-11/en_bigbook_appendicei.pdf",
        description: "The Twelve Traditions of AA"
      },
      {
        id: "appendix-2",
        title: "II. Spiritual Experience",
        url: "https://www.aa.org/sites/default/files/2021-11/en_bigbook_appendiceii.pdf",
        description: "Understanding spiritual awakening"
      },
      {
        id: "appendix-3",
        title: "III. The Medical View on A.A.",
        url: "https://www.aa.org/sites/default/files/2021-11/en_bigbook_appendiceiii.pdf",
        description: "Medical profession's perspective"
      },
      {
        id: "appendix-4",
        title: "IV. The Lasker Award",
        url: "https://www.aa.org/sites/default/files/2021-11/en_bigbook_appendiceiv.pdf",
        description: "Recognition from medical community"
      },
      {
        id: "appendix-5",
        title: "V. The Religious View on A.A.",
        url: "https://www.aa.org/sites/default/files/2021-11/en_bigbook_appendicev.pdf",
        description: "Religious community's perspective"
      },
      {
        id: "appendix-6",
        title: "VI. How to Get in Touch With A.A.",
        url: "https://www.aa.org/sites/default/files/2021-11/en_bigbook_appendicevi.pdf",
        description: "Finding local AA meetings"
      }
    ]
  }
];

// AA Prayers for offline reading
export const aaPrayers = [
  {
    title: "Third Step Prayer",
    content: `God, I offer myself to Thee — to build with me and to do with me as Thou wilt. Relieve me of the bondage of self, that I may better do Thy will. Take away my difficulties, that victory over them may bear witness to those I would help of Thy Power, Thy Love, and Thy Way of life. May I do Thy will always!`,
    source: "Alcoholics Anonymous, Page 63"
  },
  {
    title: "Seventh Step Prayer",
    content: `My Creator, I am now willing that you should have all of me, good and bad. I pray that you now remove from me every single defect of character which stands in the way of my usefulness to you and my fellows. Grant me strength, as I go out from here, to do your bidding. Amen.`,
    source: "Alcoholics Anonymous, Page 76"
  },
  {
    title: "Eleventh Step Prayer",
    content: `Lord, make me a channel of thy peace—that where there is hatred, I may bring love—that where there is wrong, I may bring the spirit of forgiveness—that where there is discord, I may bring harmony—that where there is error, I may bring truth—that where there is doubt, I may bring faith—that where there is despair, I may bring hope—that where there are shadows, I may bring light—that where there is sadness, I may bring joy. Lord, grant that I may seek rather to comfort than to be comforted—to understand, than to be understood—to love, than to be loved. For it is by self-forgetting that one finds. It is by forgiving that one is forgiven. It is by dying that one awakens to Eternal Life. Amen.`,
    source: "Twelve Steps and Twelve Traditions, Page 99 (St. Francis Prayer)"
  },
  {
    title: "Serenity Prayer",
    content: `God, grant me the serenity to accept the things I cannot change,
Courage to change the things I can,
And wisdom to know the difference.

Living one day at a time,
Enjoying one moment at a time,
Accepting hardship as a pathway to peace,
Taking, as Jesus did, this sinful world as it is,
Not as I would have it,
Trusting that You will make all things right,
If I surrender to Your will,
So that I may be reasonably happy in this life,
And supremely happy with You forever in the next.
Amen.`,
    source: "Attributed to Reinhold Niebuhr (Full Version)"
  },
  {
    title: "Set Aside Prayer",
    content: `Dear God, please help me to set aside everything I think I know about myself, my disease, the 12 Steps, and especially You; so that I may have an open mind and a new experience with all these things. Please help me see the truth.`,
    source: "Commonly used in AA meetings"
  },
  {
    title: "Acceptance Prayer",
    content: `And acceptance is the answer to all my problems today. When I am disturbed, it is because I find some person, place, thing, or situation—some fact of my life—unacceptable to me, and I can find no serenity until I accept that person, place, thing, or situation as being exactly the way it is supposed to be at this moment.

Nothing, absolutely nothing, happens in God's world by mistake. Until I could accept my alcoholism, I could not stay sober; unless I accept life completely on life's terms, I cannot be happy. I need to concentrate not so much on what needs to be changed in the world as on what needs to be changed in me and in my attitudes.`,
    source: "Alcoholics Anonymous, Page 417"
  }
];