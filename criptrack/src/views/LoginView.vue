<template>
  <div class="login-container">
    <div class="card">
      <h1>Iniciar Sesión</h1>
      <form @submit.prevent="handleLogin">
        <input v-model="credentials.email" type="email" placeholder="Email" />
        <input v-model="credentials.password" type="password" placeholder="Contraseña" />
        <button type="submit">Iniciar Sesión</button>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { user } from '../store/user'

const router = useRouter()

const credentials = reactive({
  email: '',
  password: '',
})

const error = ref('')

const handleLogin = () => {
  const existingUsers = JSON.parse(localStorage.getItem('users') || '[]')

  const matchedUser = existingUsers.find(
    u => u.email === credentials.email && u.password === credentials.password
  )

  if (matchedUser) {
    user.isAuthenticated = true
    user.id = matchedUser.id
    user.nombre = matchedUser.nombre
    user.apellido = matchedUser.apellido
    user.email = matchedUser.email

    localStorage.setItem('user', JSON.stringify(matchedUser))

    error.value = ''
    router.push('/')
  } else {
    error.value = 'Email o contraseña incorrectos.'
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  font-family: 'Poppins', sans-serif;
}

.card {
  background-color: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 40px;
  border-radius: 16px;
  text-align: center;
  color: #e3fef7;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 400px;
}

h1 {
  font-size: 2rem;
  color: #4deeea;
  margin-bottom: 20px;
}

input {
  display: block;
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  background-color: rgba(255, 255, 255, 0.15);
  color: #dbeff0;
}

input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

button {
  padding: 10px 20px;
  background-color: #4deeea;
  color: #1e1e1e;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #34d5d0;
}

.error {
  color: #ff6b6b;
  margin-top: 10px;
  font-weight: 500;
}
</style>
