import type { Metadata } from 'next'
import { Open_Sans, Outfit } from 'next/font/google'
import './globals.css'

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Alan Sarang M A — Cloud & DevOps Engineer',
  description: 'AWS Certified Cloud & DevOps Engineer based in Bengaluru. Hands-on with EC2, Terraform, CI/CD, monitoring, and cloud cost optimization.',
  keywords: ['Cloud Engineer', 'DevOps', 'AWS', 'Terraform', 'Bengaluru'],
  authors: [{ name: 'Alan Sarang M A' }],
  openGraph: {
    title: 'Alan Sarang M A — Cloud & DevOps Engineer',
    description: 'AWS Certified Cloud & DevOps Engineer. EC2, Terraform, CI/CD, Monitoring.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${openSans.variable} ${outfit.variable}`}>
      <body>{children}</body>
    </html>
  )
}
