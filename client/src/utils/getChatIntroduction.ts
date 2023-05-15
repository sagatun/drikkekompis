export function getChatIntroduction(
  personality: string,
  hasSelectedStore?: boolean
) {
  switch (personality) {
    case "rapper":
      return hasSelectedStore
        ? `Yo, yo, yo! Jeg er DrikkeG-kompis🍻, din personlige gangsta guide og mester av både alkoholholdige og alkoholfrie drikker, yo!
  
        La oss kicke det i gang, og jeg vil droppe min kunnskap og innsikt, homie, for å hjelpe deg med å finne den illeste drikken for enhver anledning, du vet!
        `
        : `Yo, yo, yo! Jeg er DrikkeG-kompis🍻, din personlige gangsta guide og mester av både alkoholholdige og alkoholfrie drikker, yo!

        La oss kicke det i gang, og jeg vil droppe min kunnskap og innsikt, homie, for å hjelpe deg med å finne den illeste drikken for enhver anledning, du vet!
        
        Men før vi ruller ut og begynner å utforske denne store verdenen av flytende gleder, trenger jeg litt intel fra deg. Vennligst velg din nærmeste Vinmonopol fra menyen oppe til høyre, yo. Dette vil hjelpe meg å foreslå drikkevarer som er klare for pickup, du skjønner.
        
        La oss få dette showet på veien! Velg butikk, og så finner vi den illeste drikken for deg sammen. 🍻`;
    case "expert":
      return hasSelectedStore
        ? `Hei kompis! Jeg er Drikkekompis🍻, din personlige guide og ekspert på både alkoholholdige og alkoholfrie drikkevarer! 
  
        La oss starte en samtale og jeg vil dele min kunnskap og innsikt med deg for å hjelpe deg med å finne den perfekte drikken for enhver anledning.
        `
        : `
        Hei der! Jeg er Drikkekompis🍻, din personlige guide og ekspert på både alkoholholdige og alkoholfrie drikkevarer!
        
        Jeg er her for å dele min kunnskap og innsikt med deg, for å hjelpe deg med å finne den perfekte drikken for enhver anledning. Enten det er en spesiell anledning, en rolig kveld hjemme, eller du bare er nysgjerrig på å utforske nye smaker, jeg har deg dekket!
        
        Men før vi dykker inn i verdenen av fantastiske drikkevarer, trenger jeg litt informasjon fra deg. Vennligst velg din nærmeste Vinmonopol fra menyen oppe til høyre. Dette vil hjelpe meg å foreslå drikkevarer som faktisk er tilgjengelige for deg.
        
        La oss sette i gang! Velg butikk, og så finner vi den perfekte drikken for deg sammen. 🍻`;
    case "sarcastic":
      return hasSelectedStore
        ? `Åh, hei da! Jeg er DrikkeIronikus🍻, din "personlige" guide og "ekspert" på både alkoholholdige og alkoholfrie drikkevarer! Fordi det er akkurat det du trenger, ikke sant?
  
        La oss "starte" en samtale, og jeg vil daaaele ut min "uvurderlige" kunnskap og innsikt for å hjelpe deg med å finne den "perfekte" drikken for enhver "uforglemmelig" anledning.`
        : `Åh, hei da! Jeg er DrikkeIronikus🍻, din "personlige" guide og "ekspert" på både alkoholholdige og alkoholfrie drikkevarer! Fordi det er akkurat det du trenger, ikke sant?

        La oss "starte" en samtale, og jeg vil daaaele ut min "uvurderlige" kunnskap og innsikt for å hjelpe deg med å finne den "perfekte" drikken for enhver "uforglemmelig" anledning.
        
        Men vent, det blir bedre! Før vi kan begynne denne "spennende" reisen inn i verdenen av drikkevarer, trenger jeg at du gjør meg en stor tjeneste. Vil du være så snill å velge din nærmeste butikk eller Vinmonopol fra menyen oppe til høyre? Det vil virkelig gjøre dagen min... og kanskje til og med hjelpe meg å foreslå drikkevarer som er tilgjengelige for deg. Ikke det at det er viktig eller noe...
        
        La oss "hoppe rett inn", skal vi? Velg butikk, så kan vi begynne å finne den "perfekte" drikken for deg. 🍻`;
  }
}
