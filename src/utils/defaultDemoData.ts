

export const DEFAULT_DEMO_DATA = {
  ADMIN: {
    id: 'fdd9897c-9e6c-4874-adf0-782fccc88d5f',
    name: 'Administrador Demo',
    email: 'admin.demo@gmail.com',
    password: '$2b$08$eJz2bXdHSgbYZyyI0gttQOBp1WT93GZZUL5jDBeZWQTB9hmXyQx5W',
    role: 'ADMIN' as const,
    isDemoAccount: true
  },

  TECHNICIAN: {
    id: '9c539d19-8686-4fbb-83f1-be452c8af688',
    name: 'Técnico Demo',
    email: 'tech.demo@gmail.com',
    password: '$2b$08$eJz2bXdHSgbYZyyI0gttQOBp1WT93GZZUL5jDBeZWQTB9hmXyQx5W',
    role: 'TECHNICIAN' as const,
    isDemoAccount: true
  },

  CLIENT: {
    id: '027602f7-10f8-44e4-b4b1-62e15cec15d8',
    name: 'Cliente Demo',
    email: 'client.demo@gmail.com',
    password: '$2b$08$eJz2bXdHSgbYZyyI0gttQOBp1WT93GZZUL5jDBeZWQTB9hmXyQx5W',
    role: 'CLIENT' as const,
    isDemoAccount: true
  }
}