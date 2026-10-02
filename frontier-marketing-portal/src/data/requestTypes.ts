import type { RequestType } from "../types";

export const requestTypes: RequestType[] = [
  {
    slug: "moody-center",
    title: "Moody Center Request",
    description:
      "Request tickets for customer or prospect entertainment.",
    icon: "🎟️",
    workflow: "moody",
  },

  {
    slug: "frontier-apparel",
    title: "Frontier Apparel",
    description:
      "Request approved Frontier apparel.",
    icon: "👕",
    workflow: "standard",
  },

  {
    slug: "business-cards",
    title: "Business Cards",
    description:
      "Order new or updated employee business cards.",
    icon: "💳",
    workflow: "standard",
  },

  {
    slug: "marketing-materials",
    title: "Marketing Materials",
    description:
      "Request flyers, signage, handouts, and collateral.",
    icon: "🖨️",
    workflow: "standard",
  },

  {
    slug: "sponsorship",
    title: "Sponsorship",
    description:
      "Submit a community sponsorship opportunity.",
    icon: "🤝",
    workflow: "standard",
  },

  {
    slug: "advertisement",
    title: "Advertisement",
    description:
      "Request print, digital, or media advertising.",
    icon: "📣",
    workflow: "standard",
  },

  {
    slug: "event-items",
    title: "Event Items",
    description:
      "Reserve promotional items and event supplies.",
    icon: "🎪",
    workflow: "standard",
  },

  {
    slug: "customer-spotlight",
    title: "Nominate a Customer Spotlight",
    description:
      "Share a customer success story.",
    icon: "⭐",
    workflow: "standard",
  },

  {
    slug: "employee-spotlight",
    title: "Nominate an Employee Spotlight",
    description:
      "Recognize a Frontier team member.",
    icon: "🏆",
    workflow: "standard",
  },

  {
    slug: "social-media",
    title: "Social Media Post Request",
    description:
      "Request a post for Frontier social channels.",
    icon: "📱",
    workflow: "standard",
  },

  {
    slug: "promo-store",
    title: "Promo Store Front",
    description:
      "Order approved promotional merchandise.",
    icon: "🛍️",
    workflow: "standard",
    external: true,
    url: "https://www.fbtx.store/",
  },

  {
    slug: "bank-supplies",
    title: "Bank Supplies Store Front",
    description:
      "Order approved branch and bank supplies.",
    icon: "📦",
    workflow: "standard",
    external: true,
    url: "https://banksupplies.com/",
  },
];