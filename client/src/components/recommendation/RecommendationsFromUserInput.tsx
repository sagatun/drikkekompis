import { useEffect, useState } from 'react'
import { createSystemPromptForUserInputRecommendation } from '../../utils/chatGPT-prompts'
import { useIsFetching, useMutation } from '@tanstack/react-query'
import { type Product } from '../../types'
import {
  findCategoryInInputText,
  randomizeAndCap,
  filterProductsByCategory,
  convertProductList,
  getNamesFromResponse
} from '../../utils/recommendationsUtils'
import ChatComponent from '../ChatComponent'
import { chatGPTConversation } from '../../api/chatGPT'
import { useAppState } from '../../context/AppState.context'
import slugify from 'slugify'

const gpt4model = 'gpt-4-1106-preview'

const listSizeLimit = 1000 // 128000 tokens is the max for GPT-4-turbo. 3000 is a safe limit for GPT-4-turbo

export default function RecommendationFromUserInput () {
  const [state, dispatch] = useAppState()
  const [previousCategories, setPreviousCategories] = useState<string[]>([''])
  const [GPTProductList, setGPTProductList] = useState<string[]>([''])
  const [persona, setPersona] = useState('no-products')
  const [inputMessage, setInputMessage] = useState('')
  const [randomizedProductsInStore, setRandomizedProductsInStore] = useState<
  Product[] | []
  >([])

  const productsIsFetching = useIsFetching({
    queryKey: ['fetchProductsInStore']
  })

  const {
    personality,
    categories,
    subCategories,
    productsInStore,
    selectedCategory,
    recommendedProducts,
    messages
  } = state

  // useeffect if randomizeProductsInStore is not empty
  useEffect(() => {
    if (randomizedProductsInStore.length > 0) {
      setPersona(personality)
    }
  }, [productsInStore])

  useEffect(() => {
    if (productsInStore.length > 0) {
      const randomizedProducts = productsInStore.sort(
        () => Math.random() - 0.5
      )
      setRandomizedProductsInStore(randomizedProducts)
    }
  }, [productsInStore])

  const setRecommendedProducts = (products: Product[] | []) => { dispatch({ type: 'SET_RECOMMENDED_PRODUCTS', payload: products }) }
  const setMessages = (newMessages: any[]) => { dispatch({ type: 'SET_MESSAGES', payload: newMessages }) }

  function handleChatGPTResponse (response: any) {
    const rawContent = response.conversationHistory.pop().content

    const namesFromResponse = getNamesFromResponse(rawContent, GPTProductList)

    setMessages([
      ...messages,
      {
        role: 'assistant',
        content: response.conversationText || 'Error: Unable to parse content'
      }
    ])

    const foundProducts = randomizedProductsInStore.filter((product: Product) =>
      [...namesFromResponse].includes(
        slugify(product.name, { lower: true, strict: true })
      )
    )

    if (foundProducts) {
      const updatedRecommendedProducts = [
        ...recommendedProducts,
        ...foundProducts
      ]

      setRecommendedProducts(updatedRecommendedProducts)
    }
  }

  function updateProductListOnCategoryChange (inputText: string) {
    if (inputText.length === 0) return

    const categoryFromUserInput = findCategoryInInputText(
      inputText,
      categories,
      subCategories
    ) ?? ['']

    let filtered_products: Product[] = []

    if (categoryFromUserInput.length > 0) {
      filtered_products =
        filterProductsByCategory(
          randomizedProductsInStore,
          categoryFromUserInput,
          subCategories
        ) ?? []
    }

    const categorySlug: string[] =
      categoryFromUserInput ||
      (selectedCategory?.name) ||
      'products'

    const category =
      categories.find((category) => category.code === categorySlug)?.name ||
      subCategories.find((subCategory) => subCategory.code === categorySlug)
        ?.name ||
      categorySlug

    const products =
      filtered_products && Boolean(filtered_products.length > 0)
        ? filtered_products
        : randomizedProductsInStore

    const mappedProducts =
      products.length > 0 ? convertProductList(products) : []

    const randomizedAndCappedProducts: string[] = randomizeAndCap(
      mappedProducts,
      listSizeLimit
    )

    console.log(
      'randomizedAndCappedProducts length: ',
      randomizedAndCappedProducts.length
    )

    setGPTProductList(randomizedAndCappedProducts)

    let p = 'no-products'
    if (randomizedProductsInStore.length > 0) {
      p = personality
      setPersona(p)
    }

    const prompt = createSystemPromptForUserInputRecommendation(
      category,
      p,
      randomizedAndCappedProducts
    )

    const conversationHistory = [{ role: 'system', content: prompt }]

    return conversationHistory
  }

  const chatGPTMutation = useMutation({
    mutationFn: chatGPTConversation,
    onSuccess: (response: any) => {
      handleChatGPTResponse(response)
    },
    onError: (error: any) => {
      console.log(error)
    }
  })

  const handleSendMessage = () => {
    const categoryFound = findCategoryInInputText(
      inputMessage,
      categories,
      subCategories
    ) ?? ['']
    setInputMessage('')

    if (categoryFound.length < 1) {
      const updatedProductList =
        updateProductListOnCategoryChange(inputMessage)
      setPreviousCategories(categoryFound)
      if (updatedProductList && updatedProductList?.length > 0) {
        const filteredMessages = messages.filter(
          (message) => message.role !== 'system'
        )
        const updatedMessages = [
          ...updatedProductList,
          ...filteredMessages,
          { content: inputMessage, role: 'user' }
        ]

        setMessages(updatedMessages)
        const packageForChatGPT = {
          conversationHistory: updatedMessages,
          chatGPTModel: gpt4model
        }
        try {
          chatGPTMutation.mutate(packageForChatGPT)
        } catch (e) {
          console.error(e)
        }
        return
      }
    }

    if (
      categoryFound.length > 0 ||
      messages.length === 1 ||
      (persona === 'no-products' && randomizedProductsInStore.length > 0)
    ) {
      const updatedProductList =
        previousCategories !== categoryFound ||
        messages.length === 1 ||
        categoryFound.length === 0
          ? updateProductListOnCategoryChange(inputMessage)
          : messages

      // Update the previousCategory state
      setPreviousCategories(categoryFound)
      if (updatedProductList && updatedProductList?.length > 0) {
        const filteredMessages = messages.filter(
          (message) => message.role !== 'system'
        )
        const updatedMessages = [
          ...updatedProductList,
          ...filteredMessages,
          { content: inputMessage, role: 'user' }
        ]

        setMessages(updatedMessages)
        const packageForChatGPT = {
          conversationHistory: updatedMessages,
          chatGPTModel: gpt4model
        }
        try {
          chatGPTMutation.mutate(packageForChatGPT)
        } catch (e) {
          console.error(e)
        }
        return
      }
    }

    const updatedMessages = [
      ...messages,
      { content: inputMessage, role: 'user' }
    ]

    setMessages(updatedMessages)
    const packageForChatGPT = {
      conversationHistory: updatedMessages,
      chatGPTModel: gpt4model
    }
    try {
      chatGPTMutation.mutate(packageForChatGPT)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <ChatComponent
      products={recommendedProducts}
      disabled={inputMessage.trim() === '' || productsIsFetching > 0}
      handleSendMessage={handleSendMessage}
      inputMessage={inputMessage}
      isPending={chatGPTMutation.isPending}
      setInputMessage={setInputMessage}
      messages={messages}
      setMessages={setMessages}
    />
  )
}
