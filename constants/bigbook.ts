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

// Key excerpts for offline reading
export const keyExcerpts = [
  {
    title: "The Twelve Steps",
    content: `1. We admitted we were powerless over alcohol—that our lives had become unmanageable.

2. Came to believe that a Power greater than ourselves could restore us to sanity.

3. Made a decision to turn our will and our lives over to the care of God as we understood Him.

4. Made a searching and fearless moral inventory of ourselves.

5. Admitted to God, to ourselves, and to another human being the exact nature of our wrongs.

6. Were entirely ready to have God remove all these defects of character.

7. Humbly asked Him to remove our shortcomings.

8. Made a list of all persons we had harmed, and became willing to make amends to them all.

9. Made direct amends to such people wherever possible, except when to do so would injure them or others.

10. Continued to take personal inventory and when we were wrong promptly admitted it.

11. Sought through prayer and meditation to improve our conscious contact with God as we understood Him, praying only for knowledge of His will for us and the power to carry that out.

12. Having had a spiritual awakening as the result of these Steps, we tried to carry this message to alcoholics, and to practice these principles in all our affairs.`,
    source: "Chapter 5: How It Works"
  },
  {
    title: "The Promises",
    content: `If we are painstaking about this phase of our development, we will be amazed before we are half way through. We are going to know a new freedom and a new happiness. We will not regret the past nor wish to shut the door on it. We will comprehend the word serenity and we will know peace. No matter how far down the scale we have gone, we will see how our experience can benefit others. That feeling of uselessness and self-pity will disappear. We will lose interest in selfish things and gain interest in our fellows. Self-seeking will slip away. Our whole attitude and outlook upon life will change. Fear of people and of economic insecurity will leave us. We will intuitively know how to handle situations which used to baffle us. We will suddenly realize that God is doing for us what we could not do for ourselves.

Are these extravagant promises? We think not. They are being fulfilled among us—sometimes quickly, sometimes slowly. They will always materialize if we work for them.`,
    source: "Chapter 6: Into Action, Pages 83-84"
  }
];