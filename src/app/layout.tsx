import './globals.css'

export const metadata = {
  title: 'Admin Panel - Sistema de Administración',
  description: 'Panel de administración para el sistema de microservicios',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="bg-gray-50">{children}</body>
    </html>
  )
}
