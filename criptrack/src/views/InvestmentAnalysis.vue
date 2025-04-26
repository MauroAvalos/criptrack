<template>
    <div class="investment-analysis-container">
      <h2>Análisis de Inversiones</h2>
      <div v-if="loading">Cargando datos...</div>
      <div v-else>
        <table v-if="results.length > 0">
          <thead>
            <tr>
              <th>Criptomoneda</th>
              <th>Resultado (ARS)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(result, index) in results" :key="index">
              <td>{{ result.crypto.toUpperCase() }}</td>
              <td :class="{'positive': result.result > 0, 'negative': result.result < 0}">
                ${{ result.result.toLocaleString('es-AR', { minimumFractionDigits: 2 }) }}
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else>No se encontraron resultados de inversiones.</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import api from '@/service/apiClient'
  import { user } from '@/store/user'
  
  const results = ref([])
  const loading = ref(true)
  
  const obtenerInversiones = async () => {
    if (!user.id) return
  
    try {
      // Obtener las transacciones del usuario
      const transacciones = await api.getTransactionsByUserId(user.id)
  
      // Filtrar por criptomonedas compradas y vendidas
      const balances = {}
      for (const t of transacciones) {
        const { crypto_code, crypto_amount, money, action } = t
        const amount = parseFloat(crypto_amount)
        const price = parseFloat(money)
  
        if (!balances[crypto_code]) {
          balances[crypto_code] = { purchases: [], sales: [] }
        }
  
        if (action === 'purchase') {
          balances[crypto_code].purchases.push({ amount, price })
        } else if (action === 'sale') {
          balances[crypto_code].sales.push({ amount, price })
        }
      }
  
      // Obtener el precio actual de las criptos
      const resultadoFinal = []
  
      for (const crypto in balances) {
        const { purchases, sales } = balances[crypto]
        let totalPurchaseCost = 0
        let totalSaleRevenue = 0
  
        // Calcular las compras totales
        purchases.forEach(p => {
          totalPurchaseCost += p.amount * p.price
        })
  
        // Calcular las ventas totales
        sales.forEach(s => {
          totalSaleRevenue += s.amount * s.price
        })
  
        // Calcular el resultado
        const result = totalSaleRevenue - totalPurchaseCost // Ganancia o pérdida
  
        resultadoFinal.push({
          crypto,
          result,
        })
      }
  
      results.value = resultadoFinal
    } catch (error) {
      console.error('Error al obtener datos de inversiones:', error)
    } finally {
      loading.value = false
    }
  }
  
  onMounted(() => {
    obtenerInversiones()
  })
  </script>
  
  <style scoped>
  .investment-analysis-container {
    font-family: 'Poppins', sans-serif;
    max-width: 1000px;
    margin: 30px auto;
    text-align: center;
    color: #e3fef7;
  }
  
  h2 {
    color: #4deeea;
    font-size: 1.8rem;
    margin-bottom: 20px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
  }
  
  th, td {
    padding: 10px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    text-align: left;
    color: #dbeff0;
  }
  
  th {
    background-color: rgba(0, 0, 0, 0.3);
    color: #4deeea;
  }
  
  tbody tr:nth-child(even) {
    background-color: rgba(255, 255, 255, 0.02);
  }
  
  .positive {
    color: green;
  }
  
  .negative {
    color: red;
  }
  </style>
  