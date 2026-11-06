---
id: 'mercadolibre-summary'
startedAt: '2025-08-16'
endedAt: '2025-12-16'
isCurrent: true
isArchived: false
aggregate: true
displayName: 'Mercado Libre (Summary)'
summary: "Owned the end-to-end redesign of Mercado Libre's seller Summary platform, transforming a fixed dashboard into a personalized, card-based experience powered by server-driven UI. The architecture enabled independent teams to ship features safely while giving sellers control over how they viewed their business."
role: 'Senior Software Engineer'
companyName: 'Mercado Libre'
industry: 'E-commerce & Fintech'
tags:
  - 'Server-Driven UI'
  - 'Personalized Dashboards'
  - 'Go'
  - 'Node.js'
  - 'React'
  - 'TypeScript'
  - 'SSR'
  - 'System Architecture'
  - 'Cross-Team Platform'
  - 'A/B Testing'
images:
  - src: 'https://miguelbogota.github.io/miguelbogotadev-api/assets/project-images/mercadolibre-summary/01.png'
    alt: 'Mercado Libre Summary - Personalized Seller Dashboard'
  - src: 'https://miguelbogota.github.io/miguelbogotadev-api/assets/project-images/mercadolibre-summary/02.gif'
    alt: 'Mercado Libre Summary - Server-Driven Card Architecture'
links: []
---

## Challenge

### Transforming a fixed seller dashboard into a flexible platform for personalized business insights.

The Summary platform is the place where Mercado Libre sellers understand the state of their business. The existing dashboard delivered that information through a fixed experience, but sellers do not all operate in the same way. Some need immediate visibility into sales, while others need to prioritize reputation, notifications, or operational issues. A single predefined layout made it difficult to surface the right information for each seller and limited how the product could evolve.

The redesign needed to go beyond refreshing the interface. We wanted to rebuild Summary as a flexible, personalized platform where sellers could access information from different parts of their business, organize it around their own priorities, and preserve those preferences across devices.

The platform also served many internal teams. Reputation, sales, notifications, and other seller services needed to contribute features without depending on the Summary team to implement every card or coordinate every release. Solving that organizational constraint was as important as solving the frontend experience: the architecture needed to distribute ownership while preserving consistency, compatibility, performance, and operational control.

Finally, the platform had to support gradual rollout across multiple countries and establish a foundation for future capabilities such as AI-powered recommendations and conversational workflows. The challenge was to make Summary significantly more adaptable without making a high-traffic, business-critical application fragile or unnecessarily difficult to operate.

## Solution

### Building a personalized, server-driven platform that teams could extend independently.

I worked across the complete lifecycle of the redesign, from requirements analysis and architecture through implementation, testing, rollout, production monitoring, and ongoing support. The result was not only a new dashboard, but a platform designed to evolve with sellers and the teams building for them.

### Requirements and architecture

We began by reviewing the existing experience and working closely with Product and UX to understand what sellers actually needed from their business summary. A major part of my role was translating that research into technical requirements while ensuring that decisions made for the initial release would not constrain future personalization or AI capabilities.

We designed the system around three layers:

- **Backend — Go:** Retrieved information from multiple providers, including reputation, sales, notifications, and other seller services.
- **Middle-end — Go:** Combined provider data into contracts we called **bricks**. Each brick defined the UI component to render and the properties that component required.
- **Frontend — Node.js, TypeScript, and React SSR:** Interpreted the bricks, mapped them to React components, and rendered the seller-facing experience.

One of the most important architectural decisions was adopting server-driven UI contracts instead of hardcoding the complete dashboard in the frontend. The server described which cards belonged in the experience and provided the data required to render them. Summary remained responsible for composition and reliable rendering, while individual feature teams owned the content, appearance, and behavior of their cards.

This created a microfrontend-like ownership model without requiring every team to maintain a separate frontend application. Teams could develop and evolve features independently, and the Summary team no longer had to become the implementation bottleneck for every seller initiative.

The model introduced an important tradeoff. Distributed ownership required clear contracts, versioning rules, backward compatibility, and safe handling of incomplete or unexpected data. We accepted that additional platform complexity because it gave the product a much stronger foundation for extension and allowed teams to move independently without giving up shared standards.

### Implementation and personalization

The frontend was particularly challenging because the experience was entirely card-based. Sellers could rearrange cards, create custom views, and filter information according to how they managed their business. The interface needed to remain predictable while supporting layouts that could differ significantly from one seller to another.

We persisted those preferences through a backend service so a seller's organization followed them across devices. Implementing that behavior required careful state management, reusable React components, and coordination between the rendering layer, preference storage, and the services providing each card.

The brick architecture also gave us a path toward more intelligent experiences. Because the platform could decide which components and information to present, it could later support AI recommendations, contextual actions, and conversational workflows without replacing the rendering model.

### Testing and rollout

We validated the application at several levels. Unit tests covered isolated behavior, integration tests protected service and contract boundaries, and end-to-end tests exercised complete seller journeys. We also used stress testing to evaluate performance under heavy traffic and identify weaknesses before expanding the rollout.

A/B testing helped us measure whether the redesign was actually making Summary more useful and improving seller engagement. Technical completion was not enough; we needed evidence that the new experience helped sellers understand and manage their businesses more effectively.

Because Mercado Libre operates across multiple countries, we introduced the redesign gradually instead of releasing it everywhere at once. Each stage gave us an opportunity to monitor application behavior, investigate issues early, validate performance, and reduce the risk of cascading failures or unexpected traffic patterns.

### Production and continued evolution

My ownership continued after the initial rollout. I supported production monitoring, investigated issues, improved performance, and helped the platform accommodate new features and provider teams.

The central engineering challenge throughout the project was balancing flexibility, performance, and reliability while coordinating teams responsible for different parts of the seller experience. The final architecture gave sellers a configurable command center for their business, gave feature teams meaningful ownership, and gave Mercado Libre an extensible foundation for the next generation of personalized and AI-assisted seller experiences.
