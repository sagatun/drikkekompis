import axios from 'axios'
const server_url = import.meta.env.VITE_SERVER_URL

export async function chatGPTConversation (packageForChatGPT: any) {
  try {
    const response = await axios.post(
      `${server_url}/get-conversation`,
      packageForChatGPT,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    return response.data
  } catch (error) {
    console.error(error)
  }
}
