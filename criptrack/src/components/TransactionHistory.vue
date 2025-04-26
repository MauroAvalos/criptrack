<template>
  <div class="transaction-container">
    <h2>Historial de Transacciones</h2>

    <p v-if="loading" class="loading">Cargando transacciones...</p>

    <div class="table-wrapper" v-if="transacciones.length > 0 && !loading">
      <table>
        <thead>
          <tr>
            <th>Operación</th>
            <th>Criptomoneda</th>
            <th>Cantidad</th>
            <th>Monto (ARS)</th>
            <th>Fecha</th>
            <th>Acciones</th> <!-- Nueva columna de acciones -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="(t, index) in transacciones" :key="index">
            <td>{{ t.action === 'purchase' ? 'Compra' : 'Venta' }}</td>
            <td>{{ t.crypto_code.toUpperCase() }}</td>
            <td>{{ t.crypto_amount }}</td>
            <td>{{ t.money.toFixed(2) }}</td>
            <td>{{ formatFecha(t.datetime) }}</td>
            <!-- Columna de acciones con botones -->
            <td>
              <button @click="editarTransaccion(t)">Editar</button>
              <button @click="eliminarTransaccion(t)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-else-if="!loading" class="no-data">No se encontraron transacciones.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/service/apiClient'
import { user } from '@/store/user'

const transacciones = ref([])
const loading = ref(true)
const router = useRouter()

const formatFecha = (fechaISO) => {
  const fecha = new Date(fechaISO)
  return fecha.toLocaleString('es-AR', {
    dateStyle: 'short',
    timeStyle: 'short'
  })
}

const obtenerHistorial = async () => {
  if (!user.id) {
    console.error('El usuario no está autenticado')
    return
  }

  try {
    const result = await api.getTransactionsByUserId(user.id)
    // Ordenar las transacciones de la más reciente a la más antigua
    transacciones.value = result.sort((a, b) => new Date(b.datetime) - new Date(a.datetime))
  } catch (error) {
    console.error('Error al obtener transacciones:', error.message)
  } finally {
    loading.value = false
  }
}

const editarTransaccion = (transaccion) => {
  // Navegar a la pantalla de edición con parámetros por query
  router.push({
    path: '/transaccion',
    query: {
      edit: 'true',
      id: transaccion._id,
      action: transaccion.action,
      crypto_code: transaccion.crypto_code,
      crypto_amount: transaccion.crypto_amount,
      money: transaccion.money
    }
  })
}

const eliminarTransaccion = async (transaccion) => {
  const confirmar = confirm('¿Estás seguro que deseas eliminar esta transacción?')
  if (!confirmar) return

  try {
    await api.deleteTransactionById(transaccion._id)
    transacciones.value = transacciones.value.filter(t => t._id !== transaccion._id)
  } catch (err) {
    console.error('Error al eliminar transacción:', err)
  }
}

onMounted(() => {
  obtenerHistorial()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

.transaction-container {
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

.loading,
.no-data {
  color: #dbeff0;
  font-size: 1rem;
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

tbody tr:nth-child(even) {
  background-color: rgba(255, 255, 255, 0.02);
}

button {
  min-width: 90px;
  padding: 8px 14px;
  margin: 0 5px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  text-align: center;
  display: inline-block;
}

button:hover {
  opacity: 0.9;
}

button:first-of-type {
  background-color: #4deeea;
  color: #000;
}

button:last-of-type {
  background-color: #ff5c5c;
  color: #fff;
}

@media (max-width: 600px) {
  .table-wrapper {
    overflow-x: auto;
  }

  table {
    font-size: 0.9rem;
    min-width: 600px;
  }

  th, td {
    padding: 8px;
  }

  button {
    min-width: 80px;
    padding: 6px 10px;
    font-size: 0.85rem;
  }
}
</style>
