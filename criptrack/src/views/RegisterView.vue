<template>
  <div class="register-container">
    <div class="card">
      <h1>Registrarse</h1>
      <form @submit.prevent="handleRegister">
        <input v-model="newUser.nombre" type="text" placeholder="Nombre" />
        <input v-model="newUser.apellido" type="text" placeholder="Apellido" />
        <input v-model="newUser.email" type="email" placeholder="Email" />
        <input v-model="newUser.password" type="password" placeholder="Contraseña" />
        <button type="submit">Registrarse</button>
        <p v-if="error" class="error">{{ error }}</p>
        <p v-if="success" class="success">{{ success }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const newUser = reactive({
  nombre: '',
  apellido: '',
  email: '',
  password: '',
})

const error = ref('')
const success = ref('')

const handleRegister = () => {
  if (!newUser.nombre || !newUser.apellido || !newUser.email || !newUser.password) {
    error.value = 'Todos los campos son obligatorios.'
    success.value = ''
    return
  }

  const existingUsers = JSON.parse(localStorage.getItem('users') || '[]')

  const userExists = existingUsers.find(u => u.email === newUser.email)

  if (userExists) {
    error.value = 'El usuario ya está registrado con ese email.'
    success.value = ''
    return
  }

  const userToSave = {
    id: Date.now(),
    nombre: newUser.nombre,
    apellido: newUser.apellido,
    email: newUser.email,
    password: newUser.password,
  }

  existingUsers.push(userToSave)
  localStorage.setItem('users', JSON.stringify(existingUsers))

  error.value = ''
  success.value = '¡Registro exitoso! Redirigiendo al login...'
  setTimeout(() => router.push('/login'), 2000)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

.register-container {
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

.success {
  color: #38fcae;
  margin-top: 10px;
  font-weight: 500;
}
</style>
