import { reactive, watch } from 'vue'

// Valores por defecto
const defaultUser = {
  isAuthenticated: false,
  id: null,
  nombre: '',
  apellido: '',
  email: '',
}

// Recuperamos del localStorage y lo mezclamos con los valores por defecto
const storedUser = JSON.parse(localStorage.getItem('user')) || {}
const initialState = { ...defaultUser, ...storedUser }

export const user = reactive(initialState)

// Cada vez que cambia el usuario, lo guardamos
watch(
  user,
  (newVal) => {
    localStorage.setItem('user', JSON.stringify(newVal))
  },
  { deep: true }
)
