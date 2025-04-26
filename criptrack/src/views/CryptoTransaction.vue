<template>
  <div class="crypto-container">
    <h1>{{ editMode ? 'Editar Transacción' : 'Compra y Venta de Criptomonedas' }}</h1>
    <p v-if="userFullName">{{ userFullName }}, elija la operación a realizar:</p>

    <form @submit.prevent="registrarTransaccion" class="form">
      <label>Operación</label>
      <select v-model="tipoOperacion" :disabled="editMode" required class="input-field">
        <option value="purchase">Comprar</option>
        <option value="sale">Vender</option>
      </select>

      <label>Criptomoneda</label>
      <select v-model="crypto_code" @change="obtenerValorCripto" :disabled="editMode" required class="input-field">
        <option value="btc">Bitcoin (BTC)</option>
        <option value="eth">Ethereum (ETH)</option>
        <option value="dai">Dai (DAI)</option>
      </select>

      <div v-if="valorCripto && !editMode" class="crypto-info">
        <p>Valor Actual: {{ valorCripto }} ARS</p>
      </div>

      <label>Cantidad</label>
      <input type="number" v-model.number="cantidadCripto" placeholder="Cantidad" step="0.01" required class="input-field"/>

      <label>Monto en Dinero</label>
      <input type="number" :value="cantidadCripto * valorCripto" readonly class="input-field"/>

      <button type="submit" class="submit-btn">{{ editMode ? 'Actualizar Transacción' : 'Registrar Transacción' }}</button>
    </form>

    <p v-if="mensaje" class="message">
      <span class="success">{{ mensaje }}</span>
      <br />
      <span>Para ver los detalles de la transacción realizada, diríjase a la pantalla 
        <a href="/historial" class="link">Historial</a>.
      </span>
    </p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { user } from '../store/user'
import axios from 'axios'

const route = useRoute()
const tipoOperacion = ref('')
const crypto_code = ref('')
const cantidadCripto = ref(0)
const valorCripto = ref(null)
const mensaje = ref('')
const transaccionId = ref(null)
const editMode = ref(false)

const userFullName = computed(() => {
  return `${user.nombre} ${user.apellido}`
})

onMounted(() => {
  if (route.query.edit === 'true') {
    editMode.value = true
    transaccionId.value = route.query.id
    tipoOperacion.value = route.query.action
    crypto_code.value = route.query.crypto_code
    cantidadCripto.value = parseFloat(route.query.crypto_amount)
    valorCripto.value = parseFloat(route.query.money) / cantidadCripto.value
  }
})

const obtenerValorCripto = async () => {
  if (!crypto_code.value || editMode.value) return
  try {
    const fiat = 'ars'
    const response = await axios.get(`https://criptoya.com/api/argenbtc/${crypto_code.value}/${fiat}`)
    valorCripto.value = response.data.totalBid
  } catch (err) {
    console.error('Error al obtener el valor de la cripto', err)
    valorCripto.value = null
  }
}

const registrarTransaccion = async () => {
  if (cantidadCripto.value <= 0 || !valorCripto.value) {
    mensaje.value = 'Por favor, ingrese una cantidad válida de criptomoneda y asegúrese de que el valor esté disponible.'
    return
  }

  const nuevaTransaccion = {
    user_id: user.id,
    action: tipoOperacion.value,
    crypto_code: crypto_code.value,
    crypto_amount: cantidadCripto.value,
    money: cantidadCripto.value * valorCripto.value,
    datetime: new Date().toISOString()
  }

  try {
    if (editMode.value && transaccionId.value) {
      await axios.put(`https://laboratorio3-f36a.restdb.io/rest/transactions/${transaccionId.value}`, nuevaTransaccion, {
        headers: { 'x-apikey': '60eb09146661365596af552f' }
      })
      mensaje.value = 'Transacción actualizada con éxito.'
    } else {
      await axios.post('https://laboratorio3-f36a.restdb.io/rest/transactions', nuevaTransaccion, {
        headers: { 'x-apikey': '60eb09146661365596af552f' }
      })
      mensaje.value = 'Transacción registrada con éxito.'
    }
  } catch (err) {
    mensaje.value = `Error: ${err.response?.data || err.message}`
    console.error(err)
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

.crypto-container {
  font-family: 'Poppins', sans-serif;
  max-width: 600px;
  margin: 30px auto;
  color: #e3fef7;
}

h1 {
  color: #4deeea;
  font-size: 2rem;
  margin-bottom: 15px;
  text-align: center;
}

p {
  text-align: center;
  font-size: 1rem;
  color: #dbeff0;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  background-color: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  padding: 20px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

label {
  font-weight: 600;
  margin-bottom: 5px;
}

.input-field {
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.15);
  border: none;
  border-radius: 8px;
  color: #dbeff0;
  font-size: 1rem;
}

.input-field::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

input[type="number"],
select {
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  color: #dbeff0;
  padding: 10px;
  font-size: 1rem;
}

select {
  border: 1px solid rgba(255, 255, 255, 0.3);
}

select:focus,
input[type="number"]:focus {
  outline: none;
  border-color: #4deeea;
  background-color: rgba(0, 0, 0, 0.4);
}

.crypto-info p {
  color: #38fcae;
  font-size: 1.1rem;
}

.submit-btn {
  padding: 12px 20px;
  background-color: #4deeea;
  color: #1e1e1e;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 20px;
}

.submit-btn:hover {
  background-color: #34d5d0;
}

.message {
  text-align: center;
  margin-top: 20px;
  font-weight: 500;
}

.message.success {
  color: #38fcae;
}

.message.error {
  color: #ff6b6b;
}

.link {
  color: #4deeea;
  text-decoration: underline;
}

.link:hover {
  color: #34d5d0;
}
</style>
