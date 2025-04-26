<template>
    <div class="status-container">
      <h2>Estado actual de mis finanzas</h2>
  
      <p v-if="loading">Cargando estado...</p>
  
      <div class="table-wrapper" v-if="resumen.length > 0 && !loading">
        <table>
          <thead>
            <tr>
              <th>Criptomoneda</th>
              <th>Cantidad</th>
              <th>Dinero (ARS)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in resumen" :key="index">
              <td>{{ item.crypto.toUpperCase() }}</td>
              <td>{{ item.amount.toFixed(4) }}</td>
              <td>${{ item.arsValue.toLocaleString('es-AR', { minimumFractionDigits: 2 }) }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th colspan="2">Total</th>
              <th>${{ total.toLocaleString('es-AR', { minimumFractionDigits: 2 }) }}</th>
            </tr>
          </tfoot>
        </table>
      </div>
  
      <p v-else-if="!loading" class="no-data">No tenés criptomonedas actualmente.</p>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import api from '@/service/apiClient'
  import { user } from '@/store/user'
  import axios from 'axios'
  
  const resumen = ref([])
  const total = ref(0)
  const loading = ref(true)
  
  const obtenerEstado = async () => {
    if (!user.id) return
  
    try {
      const transacciones = await api.getTransactionsByUserId(user.id)
  
      // Paso 1: Calcular cantidades netas
      const balances = {}
      for (const t of transacciones) {
        const code = t.crypto_code.toLowerCase()
        const amount = parseFloat(t.crypto_amount)
  
        if (!balances[code]) balances[code] = 0
        balances[code] += t.action === 'purchase' ? amount : -amount
      }
  
      // Paso 2: Filtrar cripto con saldo > 0
      const criptoConSaldo = Object.entries(balances).filter(([, amount]) => amount > 0)
  
      // Paso 3: Obtener precios de CriptoYa y calcular ARS
      const resultados = []
  
      for (const [crypto, amount] of criptoConSaldo) {
        try {
          const { data } = await axios.get(`https://criptoya.com/api/satoshitango/${crypto}/ars`, {
            headers: { 'Cache-Control': 'no-cache' }
          })
  
          const precio = data.totalBid // se puede ajustar a 'ask' o 'bid' según se prefiera
          const arsValue = amount * precio
  
          resultados.push({ crypto, amount, arsValue })
          total.value += arsValue
        } catch (e) {
          console.warn(`No se pudo obtener precio para ${crypto}:`, e.message)
        }
      }
  
      resumen.value = resultados
    } catch (err) {
      console.error('Error al obtener estado:', err.message)
    } finally {
      loading.value = false
    }
  }
  
  onMounted(() => {
    obtenerEstado()
  })
  </script>
  
  <style scoped>
  .status-container {
    font-family: 'Poppins', sans-serif;
    max-width: 1000px;
    margin: 30px auto;
    color: #e3fef7;
    text-align: center;
  }
  
  h2 {
    color: #4deeea;
    font-size: 1.8rem;
    margin-bottom: 20px;
  }
  
  .table-wrapper {
    background-color: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(12px);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    padding: 20px;
    overflow-x: auto;
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
  
  tfoot th {
    font-size: 1.2rem;
    color: #fff;
  }
  
  tbody tr:nth-child(even) {
    background-color: rgba(255, 255, 255, 0.02);
  }
  
  .no-data {
    color: #dbeff0;
    font-size: 1rem;
  }
  </style>
  