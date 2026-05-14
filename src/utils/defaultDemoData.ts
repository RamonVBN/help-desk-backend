

export const DEFAULT_DEMO_DATA = {
  ADMIN: {
    id: '1',
    name: 'Administrador Demo',
    email: 'admin.demo@gmail.com',
    password: '$2b$08$eJz2bXdHSgbYZyyI0gttQOBp1WT93GZZUL5jDBeZWQTB9hmXyQx5W',
    role: 'ADMIN' as const,
    isDemoAccount: true
  },

  TECHNICIAN: {
    id: '2',
    name: 'Técnico Demo',
    email: 'tech.demo@gmail.com',
    password: '$2b$08$eJz2bXdHSgbYZyyI0gttQOBp1WT93GZZUL5jDBeZWQTB9hmXyQx5W',
    role: 'TECHNICIAN' as const,
    isDemoAccount: true
  },

  CLIENT: {
    id: '3',
    name: 'Cliente Demo',
    email: 'client.demo@gmail.com',
    password: '$2b$08$eJz2bXdHSgbYZyyI0gttQOBp1WT93GZZUL5jDBeZWQTB9hmXyQx5W',
    role: 'CLIENT' as const,
    isDemoAccount: true
  }
}