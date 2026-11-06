---
id: 'mercadolibre-sales'
startedAt: '2022-08-16'
endedAt: '2023-06-14'
isCurrent: true
isArchived: false
aggregate: true
displayName: 'Mercado Libre (Sales)'
summary: 'Unified Mercado Libre and Mercado Pago sales into one seamless seller experience, replacing a fragmented journey with a single page for marketplace orders and payment activity. The integration delivered a high-impact product change through a deliberately simple, maintainable implementation.'
role: 'Senior Software Engineer'
companyName: 'Mercado Libre'
industry: 'E-commerce & Fintech'
tags:
  - 'Platform Integration'
  - 'React'
  - 'Cross-Platform Integration'
  - 'Shared Architecture'
  - 'Seller Experience'
  - 'Cross-platform Data'
  - 'Simple Architecture'
  - 'Cross-Team Collaboration'
  - 'Product Transformation'
images:
  - src: 'https://miguelbogota.github.io/miguelbogotadev-api/assets/project-images/mercadolibre-sales/01.png'
    alt: 'Mercado Libre Sales - Unified Seller Dashboard'
  - src: 'https://miguelbogota.github.io/miguelbogotadev-api/assets/project-images/mercadolibre-sales/02.gif'
    alt: 'Mercado Libre Sales - Unified Seller Experience'
links: []
---

## Challenge

### Eliminating the boundary between Mercado Libre sales and Mercado Pago transactions so sellers could manage their complete sales activity from one place.

Sellers experienced Mercado Libre and Mercado Pago as parts of the same business, but the products exposed their information through separate journeys. Marketplace sales lived in Mercado Libre, while the corresponding payment activity lived in Mercado Pago. To understand what they had sold and how those transactions had been paid, sellers had to move between platforms and mentally reconstruct a complete view of their operation. That fragmentation created unnecessary effort around one of the most important workflows in the seller experience. The challenge was larger than placing two datasets on the same screen. Mercado Libre and Mercado Pago were independently developed platforms with different product responsibilities, teams, codebases, and ways of representing information. We needed to bring their sales experiences together without creating a tightly coupled implementation that would be difficult to understand or maintain. The integration had to preserve clear ownership between platforms while making those boundaries effectively disappear for sellers. It also required close collaboration between teams to agree on how information would be exposed, consumed, and presented as one coherent journey. A central goal was to resist overengineering. The visible product change was significant, but the implementation needed to remain straightforward enough for engineers on both sides to operate and extend confidently. Success meant delivering one clear sales page where sellers could understand their Mercado Libre orders and Mercado Pago activity together, with none of the underlying organizational or technical separation leaking into the experience.

## Solution

### Successfully merged two flagship ecosystems into a unified sales page, delivering a major seller-experience leap with a lean technical solution.

As a senior engineer on the sales team, I drove the work required to connect Mercado Libre and Mercado Pago as one seller-facing experience. I collaborated with engineers and product stakeholders across both platforms to understand the existing sales journeys, identify the information sellers needed in one place, and define integration boundaries that respected the responsibilities of each system. Rather than approaching the project as a complete merger of two large products, we focused on the seller's workflow and implemented the smallest architecture capable of delivering a unified result. Mercado Libre continued to own its marketplace domain and Mercado Pago continued to own its payment domain, while the sales experience brought the relevant information together behind a single, consistent interface. This separation was important: it allowed each platform to evolve independently and avoided duplicating domain logic simply to create the appearance of integration. My contribution centered on turning the cross-platform requirements into a practical implementation, coordinating the shared work, and keeping the resulting code understandable. The design deliberately minimized additional layers and abstractions. Where the product needed integration, we created an explicit connection; where the platforms could remain independent, we preserved that independence. This made the technical solution easier to reason about and reduced the long-term cost of a feature that crossed major organizational boundaries. The completed experience fundamentally changed how sellers interacted with the ecosystem. Instead of switching applications and reconciling information themselves, they could review their marketplace sales and related Mercado Pago activity from one page. The complexity of two flagship platforms was absorbed by the product, not passed on to the user. What made the project especially meaningful was the contrast between its product impact and its technical simplicity: we delivered a substantial improvement to a critical seller workflow without building an unnecessarily complicated system. The integration removed a persistent source of friction, strengthened the connection between Mercado Libre and Mercado Pago, and created a clean foundation for future cross-platform seller experiences.
