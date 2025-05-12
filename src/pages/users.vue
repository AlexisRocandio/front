<template>
  <v-container fluid class="pa-0">
    <v-app-bar flat :color="header" class="elevation-1">
      <v-container>
        <v-toolbar-title class="text-h5 text-center w-100 font-weight-bold text-white">
          CRUD-SPI
        </v-toolbar-title>
      </v-container>
    </v-app-bar>

    <v-container class="mt-8">
      <v-card class="mb-6">
        <v-card-title class="justify-center align-center">
          <v-avatar size="40" class="mr-2">
            <v-img src="/img/default-avatar.png" alt="Avatar" />
          </v-avatar>
          <span class="text-h6 font-weight-medium">
            Bienvenid@{{ user?.name ? `, ${user.name.toUpperCase()}` : '' }}
          </span>
        </v-card-title>
        <v-card-actions class="justify-center">
          <v-btn color="error" variant="tonal" @click="logout">
            <v-icon left>mdi-logout</v-icon>
            Cerrar sesión
          </v-btn>
        </v-card-actions>
      </v-card>

      <v-alert type="success" v-if="success" class="mb-4" border="start" prominent>
        {{ success }}
      </v-alert>

      <v-alert type="error" v-if="error" class="mb-4" border="start" prominent>
        {{ error }}
      </v-alert>


      <v-card>
        <v-card-actions v-if="isAdmin" class="justify-end">
          <v-btn color="primary" @click="dialogCrear = true">
            <v-icon left>mdi-account-plus</v-icon> Crear Usuario
          </v-btn>

        </v-card-actions>

        <v-card-title class="text-h6 text-center">Usuarios Registrados</v-card-title>

        <v-data-table :headers="headers" :items="users" :loading="loading" loading-text="Cargando usuarios..."
          class="elevation-1">
          <template #item.actions="{ item }">
            <template v-if="isAdmin">
              <v-btn icon @click="editarUsuario(item)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon @click="eliminarUsuario(item)">
                <v-icon color="red">mdi-delete</v-icon>
              </v-btn>
            </template>
            <template v-else>
              <span class="text-caption text-disabled">Sin permisos</span>
            </template>
          </template>
        </v-data-table>
      </v-card>
    </v-container>

    <v-dialog v-model="dialogEditar" max-width="500">
      <v-card>
        <v-card-title class="text-center">Editar Usuario</v-card-title>
        <v-card-text>
          <v-text-field v-model="usuarioEditado.name" label="Nombre" />
          <v-text-field v-model="usuarioEditado.email" label="Correo" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialogEditar = false">Cancelar</v-btn>
          <v-btn color="primary" @click="guardarCambios">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogCrear" max-width="500">
      <v-card>
        <v-card-title class="text-center">Crear Nuevo Usuario</v-card-title>
        <v-card-text>
          <v-text-field v-model="nuevoUsuario.name" label="Nombre" />
          <v-text-field v-model="nuevoUsuario.email" label="Correo" />
          <v-text-field v-model="nuevoUsuario.password" label="Contraseña" type="password" />
          <v-select v-model="nuevoUsuario.role" :items="['user', 'admin']" label="Rol" variant="outlined" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="cancelarCrearUsuario">Cancelar</v-btn>
          <v-btn color="primary" @click="crearUsuario">Crear</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/back'
import { useRouter } from 'vue-router'
import { computed } from 'vue'


const router = useRouter()
const success = ref('')
const error = ref('')
const users = ref([])
const loading = ref(false)
const dialogEditar = ref(false)
const usuarioEditado = ref({
  id: '',
  name: '',
  email: '',
})
const user = JSON.parse(localStorage.getItem('user') || 'null')
const isAdmin = user?.role === 'admin'
const header = '#002147'

const dialogCrear = ref(false)
const nuevoUsuario = ref({
  name: '',
  email: '',
  password: '',
  role: 'user',
})

const crearUsuario = async () => {
  try {
    await api.post('/api/users', {
      name: nuevoUsuario.value.name,
      email: nuevoUsuario.value.email,
      password: nuevoUsuario.value.password,
      role: nuevoUsuario.value.role,
    })
    dialogCrear.value = false
    await cargarUsuarios()
    success.value = 'Usuario creado correctamente'
    nuevoUsuario.value = { name: '', email: '', password: '', role: 'user' }
    setTimeout(() => {
      success.value = ''
    }, 3000)
  } catch (err) {
    console.error('Error al crear usuario:', err)
  }
}

const cancelarCrearUsuario = () => {
  dialogCrear.value = false
  nuevoUsuario.value = { name: '', email: '', password: '', role: 'user' }
}

const headers = computed(() => {
  const baseHeaders = [
    { title: 'ID', key: 'id' },
    { title: 'Nombre', key: 'name' },
    { title: 'Correo', key: 'email' },
  ]

  if (isAdmin) {
    baseHeaders.push({ title: 'Rol', key: 'role' })
  }

  baseHeaders.push({ title: 'Acciones', key: 'actions', sortable: false })

  return baseHeaders
})

const cargarUsuarios = async () => {
  loading.value = true
  try {
    const { data } = await api.get('/api/users')
    users.value = data
  } catch (err) {
    console.error('Error al obtener usuarios:', err)
  } finally {
    loading.value = false
  }
}

const editarUsuario = (usuario) => {
  usuarioEditado.value = { ...usuario, password: '' }
  dialogEditar.value = true
}
const guardarCambios = async () => {
  try {
    await api.put(`/api/users/${usuarioEditado.value.id}`, {
      name: usuarioEditado.value.name,
      email: usuarioEditado.value.email,
    })
    success.value = 'Cambios guardados correctamente'
    dialogEditar.value = false
    await cargarUsuarios()

    setTimeout(() => {
      success.value = ''
    }, 3000)
  } catch (err) {
    console.error('Error al guardar cambios:', err)
    error.value = 'Error al guardar los cambios'
  }
}



const eliminarUsuario = async (usuario) => {
  const confirmado = confirm(`¿Eliminar a ${usuario.name}?`)
  if (!confirmado) return

  try {
    await api.delete(`/api/users/${usuario.id}`)
    await cargarUsuarios()
  } catch (err) {
    console.error('Error al eliminar usuario:', err)
  }
}

function logout() {
  localStorage.removeItem('user')
  router.push('/')
}


onMounted(cargarUsuarios)
</script>
