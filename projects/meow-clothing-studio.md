---
id: 'meow-clothing-studio'
startedAt: '2026-04-23'
endedAt: '2026-05-23'
isCurrent: false
isArchived: false
aggregate: false
displayName: 'Meow Clothing Studio'
summary: 'A clothing storefront that separates product discovery and checkout into independent Next.js applications with shared UI and cart functionality.'
role: 'Frontend Developer'
companyName: 'Personal Project'
industry: 'E-commerce'
tags:
  - 'Next.js'
  - 'React'
  - 'TypeScript'
  - 'Tailwind CSS'
  - 'Turborepo'
  - 'Vercel Microfrontends'
  - 'Vitest'
images: []
links:
  - label: 'GitHub repository'
    icon: 'bxl bx-github'
    url: 'https://github.com/miguelbogota/meow-clothing-studio'
  - label: 'Website'
    icon: 'bx bx-arrow-out-up-right-square'
    url: 'https://meow-clothing-studio-marketplace.vercel.app'
---

## Challenge

### Keeping shopping and checkout consistent across independent applications.

Splitting a storefront into microfrontends introduces shared navigation and cart-state concerns. The challenge was to preserve a continuous browsing and checkout experience while allowing each application to have a focused responsibility.

## Solution

### Sharing cart behavior and UI through a Turborepo workspace.

I built marketplace and checkout applications with Next.js and TypeScript, supported by shared component and cart packages. The cart persists in local storage and uses storage events and custom events to update the interface across application boundaries and tabs. Product filtering, detail pages, quantity controls, and checkout forms complete the shopping flow.
