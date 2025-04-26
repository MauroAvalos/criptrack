<template>
  <header class="header">
    <nav class="nav-container">
      <div class="nav-left">
        <router-link v-if="isAuthenticated" to="/">Inicio</router-link>
        <router-link v-if="isAuthenticated" to="/transaccion">Transacciones</router-link>
        <router-link v-if="isAuthenticated" to="/historial">Historial</router-link>
        <router-link v-if="isAuthenticated" to="/status">Estado actual</router-link>
        <router-link v-if="isAuthenticated" to="/investment-analysis">Análisis de Inversiones</router-link>

      </div>
  
      <div class="nav-right">
        <router-link v-if="!isAuthenticated" to="/login">Login</router-link>
        <router-link v-if="!isAuthenticated" to="/register">Registrarse</router-link>
        <button v-if="isAuthenticated" @click="logout">Cerrar sesión</button>
      </div>
    </nav>
  </header>
</template>
  
<script>
  import { computed } from 'vue'
  import { user } from '../store/user'
  import { useRouter } from 'vue-router'
  
  export default {
    setup() {
      const router = useRouter()
      const isAuthenticated = computed(() => user.isAuthenticated)
  
      const logout = () => {
        localStorage.removeItem('user')
        user.isAuthenticated = false
        user.id = null
        user.nombre = ''
        user.apellido = ''
        user.email = ''
        router.push('/login')
      }
  
      return {
        isAuthenticated,
        logout,
      }
    },
  }
</script>
  
<style scoped>
.header {
  background-color: #121212;
  padding: 15px 30px;
  border-bottom: 1px solid #282828;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-left,
.nav-right {
  display: flex;
  gap: 20px;
}

router-link {
  color: #1abc9c; /* Color turquesa */
  font-weight: 500;
  text-decoration: none; /* Elimina el subrayado */
  opacity: 0.7; /* Menos saturado cuando no está activo */
  transition: color 0.3s, opacity 0.3s;
}

router-link:hover {
  opacity: 1; /* Cuando pasas el mouse, se vuelve opaco */
}

.router-link-active {
  color: #1abc9c;
  font-weight: bold;
  opacity: 1; /* Al estar activo, el enlace se ve brillante */
}

button {
  background-color: transparent;
  color: #b3b3b3;
  border: 1px solid #b3b3b3;
  padding: 6px 14px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
}

button:hover {
  background-color: #1abc9c;
  color: white;
  border-color: #1abc9c;
}
</style>
