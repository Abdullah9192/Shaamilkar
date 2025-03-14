import axios from 'axios'

export const Post = async (url, data) => {
  try {
    // Make POST request
    const response = await axios.post(url, data)
    console.log(response)
    // Return the response data directly.data
    return response.data
  } catch (error) {
    console.error('Error in POST API:', error.message)

    // Check if the error is from the server or a network issue
    if (error.response) {
      // Server responded with a status other than 2xx
      throw new Error(
        `Error: ${error.response.status} - ${error.response.statusText}`
      )
    } else {
      // Network error or no response
      throw new Error('Network error or no response from server')
    }
  }
}
export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp)
  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0') // Months are 0-based
  const yyyy = date.getFullYear()


  return `${dd}-${mm}-${yyyy}`
}
