export function getChatIntroduction(
  personality: string,
  hasSelectedStore?: boolean
) {
  switch (personality) {
    case "rapper":
      return `Yo! Jeg er DrikkeG-kompis🍻, klar for å gi deg drikkeanbefalinger med stil. ${
        hasSelectedStore ? "" : "Velg butikk for å starte, yo!"
      }`;

    case "expert":
      return `Hei! Jeg er Drikkekompis🍻, din guide i drikkeverdenen. ${
        hasSelectedStore
          ? "La oss finne den perfekte drikken."
          : "Velg butikk for å starte."
      }`;

    case "standup":
      return `Hei, StandupKomiker her🎤! Forbered deg på humoristiske drikkeanbefalinger. ${
        hasSelectedStore ? "" : "Velg butikk for å sette i gang showet!"
      }`;

    case "sarcastic":
      return `Hei, jeg er DrikkeIronikus🍻, klar for å krydre ditt drikkevalg med litt sarkasme. ${
        hasSelectedStore ? "" : "Velg butikk, så starter vi."
      }`;

    case "17mai":
      return `Gratulerer med dagen! Jeg er Drikkekompis Syttende Mai🍻, klar for en festlig drikkeanbefaling. ${
        hasSelectedStore ? "" : "Velg butikk for å begynne."
      }`;

    case "pirat":
      return `Arrr, Sjøsprøyt her☠️! La oss finne skattene i drikkeverdenen. ${
        hasSelectedStore ? "" : "Velg butikk, og vi setter seil!"
      }`;

    case "poet":
      return `Velkommen, jeg er Drikkepoet🖋️, klar for å veve drikkevalg inn i poesi. ${
        hasSelectedStore
          ? ""
          : "Velg butikk, og la oss begynne vår poetiske reise."
      }`;

    default:
      return `Hei! Jeg er Drikkekompis🍻, klar til å guide deg gjennom drikkevalg. ${
        hasSelectedStore
          ? "La oss finne det perfekte."
          : "Vennligst velg butikk for å starte."
      }`;
  }
}
