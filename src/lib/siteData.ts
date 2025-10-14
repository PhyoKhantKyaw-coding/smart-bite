export const siteData = {
  about: [
    { label: "Our Story", to: "/about/our-story" },
    { label: "Team", to: "/about/team" },
    { label: "Careers", to: "/about/careers" },
  ],
  contact: [
    { label: "Support", to: "/contact/support" },
    { label: "Locations", to: "/contact/locations" },
    { label: "Press", to: "/contact/press" },
  ],
  menu: {
    categories: [
      { label: "Burgers", to: "/menu?category=Burgers" },
      { label: "Pizza", to: "/menu?category=Pizza" },
      { label: "Asian Cuisine", to: "/menu?category=Asian%20Cuisine" },
      { label: "Desserts", to: "/menu?category=Desserts" },
      { label: "Beverages", to: "/menu?category=Beverages" },
    ],
    featured: [
      { label: "Classic Beef Burger", to: "/food/1" },
      { label: "Margherita Pizza", to: "/food/2" },
      { label: "Pad Thai", to: "/food/3" },
    ],
  },
};

export type SiteLink = { label: string; to: string };
