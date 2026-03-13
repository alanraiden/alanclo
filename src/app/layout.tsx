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

const BASE_URL = 'https://alansarang.online'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  /* ── Basic ── */
  title: {
    default: 'Alan Sarang | Cloud & DevOps Engineer — AWS Certified',
    template: '%s | Alan Sarang',
  },
  description:
    'AWS Certified Cloud & DevOps Engineer from Bengaluru. Expert in EC2, Terraform, CI/CD, CloudWatch & cost optimisation. Open to new opportunities.',
  keywords: [
    'Cloud Engineer', 'DevOps Engineer', 'AWS', 'Terraform', 'CI/CD',
    'Bengaluru', 'Karnataka', 'India', 'EC2', 'VPC', 'CloudWatch',
    'Prometheus', 'Grafana', 'GitHub Actions', 'Docker', 'Linux',
    'AWS Certified', 'Solutions Architect', 'Infrastructure as Code',
  ],
  authors: [{ name: 'Alan Sarang M A', url: BASE_URL }],
  creator: 'Alan Sarang M A',
  publisher: 'Alan Sarang M A',

  /* ── Canonical ── */
  alternates: { canonical: BASE_URL },

  /* ── Open Graph ── */
  openGraph: {
    type: 'website',
    url: BASE_URL,
    siteName: 'Alan Sarang | Cloud & DevOps Engineer',
    title: 'Alan Sarang | Cloud & DevOps Engineer — AWS Certified',
    description:
      'AWS Certified Cloud & DevOps Engineer from Bengaluru. Expert in EC2, Terraform, CI/CD, CloudWatch & cost optimisation. Open to new opportunities.',
    locale: 'en_IN',
  },

  /* ── Twitter / X Card ── */
  twitter: {
    card: 'summary_large_image',
    title: 'Alan Sarang | Cloud & DevOps Engineer — AWS Certified',
    description:
      'AWS Certified Cloud & DevOps Engineer from Bengaluru. Expert in EC2, Terraform, CI/CD, CloudWatch & cost optimisation. Open to new opportunities.',
    creator: '@alansarang',
  },

  /* ── Robots ── */
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },

  /* ── Verification placeholders ── */
  verification: {
    // google: 'your-google-site-verification-token',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${openSans.variable} ${outfit.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#00F5D2" />
        <meta name="color-scheme" content="dark" />
        <link rel="canonical" href={BASE_URL} />
      </head>
      <body>{children}</body>
    </html>
  )
}
