export default function DashboardLayout({
    children
  }: {
    children: React.ReactNode
  }) {
    return (
      <section className="h-full flex justify-center items-center">
        {children}
      </section>
    )
  }