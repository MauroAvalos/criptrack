// src/services/apiClient.js
import axios from 'axios'

const apiUrls = [
  {
    baseURL: 'https://laboratorio3-f36a.restdb.io/rest/',
    apikey: '60eb09146661365596af552f'
  },
  {
    baseURL: 'https://labor3-d60e.restdb.io/rest/',
    apikey: '64a2e9bc86d8c525a3ed8f63'
  },
  {
    baseURL: 'https://laboratorio3-5459.restdb.io/rest/',
    apikey: '64a57c2b86d8c50fe6ed8fa5'
  },
  {
    baseURL: 'https://laboratorio-36cf.restdb.io/rest/',
    apikey: '64a5ccf686d8c5d256ed8fce'
  },
  {
    baseURL: 'https://laboratorio3-f36a.restdb.io/rest/',
    apikey: '64bdbb6f86d8c5e18ded91e3'
  },
  {
    baseURL: 'https://laboratorio3-5fc7.restdb.io/rest/',
    apikey: '64bdbc3386d8c5613ded91e7'
  },
  {
    baseURL: 'https://laboratorio-ab82.restdb.io/rest',
    apikey: '650b525568885487530c00bb'
  },
  {
    baseURL: 'https://laboratorio-afe2.restdb.io/rest/',
    apikey: '650b53356888544ec60c00bf'
  }
]

let current = 0

function createClient(index) {
  const { baseURL, apikey } = apiUrls[index]
  return axios.create({
    baseURL,
    headers: {
      'x-apikey': apikey
    }
  })
}

let api = createClient(current)

async function fallbackRequest(method, url, data) {
  while (current < apiUrls.length) {
    try {
      const response = await api[method](url, data)
      return response
    } catch (error) {
      current++
      if (current < apiUrls.length) {
        api = createClient(current)
      } else {
        throw new Error('Todas las APIs fallaron 😢')
      }
    }
  }
}

export default {
  async addTransaction(transaction) {
    return fallbackRequest('post', '/transactions', transaction)
  },

  async getTransactionsByUserId(user_id) {
    const res = await fallbackRequest('get', `/transactions?q={"user_id":${user_id}}`)
    return res.data
  },

  // Implementación de la función para eliminar una transacción por ID
  async deleteTransactionById(transactionId) {
    return fallbackRequest('delete', `/transactions/${transactionId}`)
  }
}
