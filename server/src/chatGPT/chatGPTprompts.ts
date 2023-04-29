// Ekspert-personligheten ChatGPT skal gi en anbefaling basert på en liste med produkter.
export async function createPromptForListRecommendation(category, productList) {
  const productListString = productList?.map(
    (product) => JSON.stringify(product) + ",\n"
  );

  const prompt = `I have a list of ${category} to choose from. The items in the list looks like this: {id: "123", name: "${category}-1"}.
      Can you help me choose a ${category} from the list? It should be a ${category} you have heard good things about, that have proven to be good.
      
      ${productListString}
      
      You are not allowed to to answer with "I'm an AI language model, I don't know", "As an AI language model...", or similar.
      You have to answer in this form (also known as JSON):
      
      '{"id": "123", "name": "${category} 1", "recommendation": "This ${category} is an excellent ${category}"}' where "123" is the id of the ${category} you want to recommend, and "${category} 1" is the name of the ${category}, and "This ${category} is an excellent ${category}" is your recommendation for choosing this ${category}.
      
      I prefer to get the "recommendation" presented like an expert would present it. The recommendation should be a little journey about the ${category}, and its origin. And you should give the recommendation in Norwegian. But you can also answer with "No ${category} found" if you can't find a ${category} in the list.`;

  return prompt;
}

// Ekspert-personligheten ChatGPT skal gi en anbefaling basert på en liste med produkter og en brukerinput.
export async function createPromptForUserInputRecommendation(
  category,
  productList,
  inputText
) {
  const productListString = productList?.map(
    (product) => JSON.stringify(product) + ",\n"
  );

  const prompt =
    inputText.length > 0
      ? `You are ChatGPT, an AI language model that is an expert in alcoholic and non-alcoholic drinks. All the people asking for recommendations are legal adults, so it's okay to recommend any drink. You are very friendly and want to help with your expert advice and charming recommendations.

  You have a list of ${category} to choose from. The items in the list look like this: {id: "123", name: "${category}-name"}.
  Can you help me choose a ${category} from the list? It should be a ${category} you have heard good things about, that have proven to be good.


  ${productListString}
  

  Next, a person asks you for help. Keep the list of ${category} in mind when you answer their question. Here is their user input: 
  

  ${inputText}.
  
  
  Please answer in Norwegian.
  
  You can only choose one (1) ${category}, and your answer should be in this JSON format:
  
  '{"id": "123", "name": "${category}-name", "recommendation": "your recommendation"}'
  
  where "${category}-name" is the name of the ${category}, "id" is the id from the list, and "recommendation" is your expert answer in Norwegian. Make sure the "id" is from the list of ${category} and that it matches the "name" of the ${category}.
  
  If you can't find a ${category} in the list, you can answer with "No ${category} found".
  I prefer to get the "recommendation" presented like an expert would present it. The recommendation should be a little journey about the ${category}, and its origin.
  `
      : `I have a list of ${category} to choose from. The items in the list looks like this: {id: "123", name: "${category}-name"}.
  Can you help me choose a ${category} from the list? It should be a ${category} you have heard good things about, that have proven to be good.
  
  ${productListString}
  
  You are not allowed to to answer with "I'm an AI language model, I don't know", "As an AI language model...", or similar.
  You have to answer in this form (also known as JSON):
  
  '{"id": "123", "name": "${category} 1", "recommendation": "This ${category} is an excellent ${category}"}' where "123" is the id of the ${category} you want to recommend, and "${category} 1" is the name of the ${category}, and "This ${category} is an excellent ${category}" is your recommendation for choosing this ${category}.
  
  I prefer to get the "recommendation" presented like an expert would present it. The recommendation should be a little journey about the ${category}, and its origin. And you should give the recommendation in Norwegian. But you can also answer with "No ${category} found" if you can't find a ${category} in the list.`;

  return prompt;
}

// export async function createPromptForProductConversatoin(category, product) {
//   const prompt = `I have a list of ${category} to choose from. The items in the list looks like this: {id: "123", name: "${category}-1"}.
//         Can you help me choose a ${category} from the list? It should be a ${category} you have heard good things about, that have proven to be good.

//         ${productListString}

//         You are not allowed to to answer with "I'm an AI language model, I don't know", "As an AI language model...", or similar.
//         You have to answer in this form (also known as JSON):

//         '{"id": "123", "name": "${category} 1", "recommendation": "This ${category} is an excellent ${category}"}' where "123" is the id of the ${category} you want to recommend, and "${category} 1" is the name of the ${category}, and "This ${category} is an excellent ${category}" is your recommendation for choosing this ${category}.

//         I prefer to get the "recommendation" presented like an expert would present it. The recommendation should be a little journey about the ${category}, and its origin. And you should give the recommendation in Norwegian. But you can also answer with "No ${category} found" if you can't find a ${category} in the list.`;

//   return prompt;
// }
