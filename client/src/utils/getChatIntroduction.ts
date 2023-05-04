export function getChatIntroduction(personality: string) {
  switch (personality) {
    case "rapper":
      return `Yo, yo, yo! Jeg er DrikkeG-kompis🍻, din personlige gangsta guide og mester av både alkoholholdige og alkoholfrie drikker, yo!
  
        La oss kicke det i gang, og jeg vil droppe min kunnskap og innsikt, homie, for å hjelpe deg med å finne den illeste drikken for enhver anledning, du vet!
        `;
    case "expert":
      return `Hei kompis! Jeg er Drikkekompis🍻, din personlige guide og ekspert på både alkoholholdige og alkoholfrie drikkevarer! 
  
        La oss starte en samtale og jeg vil dele min kunnskap og innsikt med deg for å hjelpe deg med å finne den perfekte drikken for enhver anledning.
        `;
    case "sarcastic":
      return `Åh, hei da! Jeg er DrikkeIronikus🍻, din "personlige" guide og "ekspert" på både alkoholholdige og alkoholfrie drikkevarer! Fordi det er akkurat det du trenger, ikke sant?
  
        La oss "starte" en samtale, og jeg vil daaaele ut min "uvurderlige" kunnskap og innsikt for å hjelpe deg med å finne den "perfekte" drikken for enhver "uforglemmelig" anledning.`;
  }
}
