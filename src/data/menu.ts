export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
  customizations?: {
    sizes?: { name: string; priceAdd: number }[];
    milkOptions?: string[];
    extras?: { name: string; price: number }[];
  };
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export const categories: Category[] = [
  { id: "hot-drinks", name: "Hot Drinks", icon: "☕" },
  { id: "cold-drinks", name: "Cold Drinks", icon: "🧊" },
  { id: "pastries", name: "Pastries", icon: "🥐" },
  { id: "breakfast", name: "Breakfast", icon: "🍳" },
  { id: "lunch", name: "Lunch", icon: "🥗" },
];

const coffeeCustomizations = {
  sizes: [
    { name: "Small", priceAdd: 0 },
    { name: "Medium", priceAdd: 0.5 },
    { name: "Large", priceAdd: 1 },
  ],
  milkOptions: ["Whole Milk", "Oat Milk", "Almond Milk", "Soy Milk", "None"],
  extras: [
    { name: "Extra Shot", price: 0.75 },
    { name: "Vanilla Syrup", price: 0.5 },
    { name: "Caramel Drizzle", price: 0.5 },
    { name: "Whipped Cream", price: 0.5 },
  ],
};

export const menuItems: MenuItem[] = [
  // Hot Drinks
  { id: "1", name: "Espresso", description: "Rich, bold single origin espresso with a golden crema", price: 3.5, category: "hot-drinks", image: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&h=400&fit=crop", available: true, customizations: coffeeCustomizations },
  { id: "2", name: "Cappuccino", description: "Perfectly balanced espresso with velvety steamed milk foam", price: 4.5, category: "hot-drinks", image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop", available: true, customizations: coffeeCustomizations },
  { id: "3", name: "Flat White", description: "Double shot with silky microfoam, Australian style", price: 4.75, category: "hot-drinks", image: "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=400&h=400&fit=crop", available: true, customizations: coffeeCustomizations },
  { id: "4", name: "Pour Over", description: "Hand-poured single origin, brewed to perfection", price: 5.0, category: "hot-drinks", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop", available: true },
  { id: "5", name: "Matcha Latte", description: "Ceremonial grade matcha whisked with steamed milk", price: 5.5, category: "hot-drinks", image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400&h=400&fit=crop", available: true, customizations: { sizes: coffeeCustomizations.sizes, milkOptions: coffeeCustomizations.milkOptions } },
  
  // Cold Drinks
  { id: "6", name: "Iced Americano", description: "Chilled double espresso over ice", price: 4.0, category: "cold-drinks", image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&h=400&fit=crop", available: true, customizations: coffeeCustomizations },
  { id: "7", name: "Cold Brew", description: "24-hour steeped, smooth and naturally sweet", price: 4.75, category: "cold-drinks", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop", available: true, customizations: { sizes: coffeeCustomizations.sizes } },
  { id: "8", name: "Iced Matcha", description: "Chilled matcha with your choice of milk over ice", price: 5.5, category: "cold-drinks", image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&h=400&fit=crop", available: true },
  { id: "9", name: "Fresh Lemonade", description: "House-squeezed with a hint of lavender", price: 4.0, category: "cold-drinks", image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&h=400&fit=crop", available: true },

  // Pastries
  { id: "10", name: "Butter Croissant", description: "Flaky, golden, hand-laminated with French butter", price: 3.75, category: "pastries", image: "https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=400&h=400&fit=crop", available: true },
  { id: "11", name: "Pain au Chocolat", description: "Dark chocolate wrapped in buttery layers", price: 4.25, category: "pastries", image: "https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=400&h=400&fit=crop", available: true },
  { id: "12", name: "Cinnamon Roll", description: "Warm, gooey with cream cheese glaze", price: 4.5, category: "pastries", image: "https://images.unsplash.com/photo-1509365390695-33aee754301f?w=400&h=400&fit=crop", available: true },
  { id: "13", name: "Almond Tart", description: "Frangipane-filled with toasted almond flakes", price: 5.0, category: "pastries", image: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=400&h=400&fit=crop", available: false },

  // Breakfast
  { id: "14", name: "Avocado Toast", description: "Sourdough, smashed avo, poached egg, chili flakes", price: 12.0, category: "breakfast", image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=400&fit=crop", available: true },
  { id: "15", name: "Granola Bowl", description: "House granola, Greek yogurt, seasonal berries, honey", price: 9.5, category: "breakfast", image: "https://images.unsplash.com/photo-1511690743698-d9d18f7e20f1?w=400&h=400&fit=crop", available: true },
  { id: "16", name: "Eggs Benedict", description: "Poached eggs, smoked salmon, hollandaise on brioche", price: 14.0, category: "breakfast", image: "https://images.unsplash.com/photo-1608039829572-9b0189188f87?w=400&h=400&fit=crop", available: true },

  // Lunch
  { id: "17", name: "Grilled Halloumi Salad", description: "Mixed greens, roasted peppers, pomegranate, tahini", price: 13.5, category: "lunch", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop", available: true },
  { id: "18", name: "Truffle Grilled Cheese", description: "Three-cheese blend with truffle oil on sourdough", price: 11.0, category: "lunch", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=400&fit=crop", available: true },
  { id: "19", name: "Poke Bowl", description: "Fresh tuna, avocado, edamame, sesame rice", price: 15.0, category: "lunch", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop", available: true },
];

// Mock orders for admin
export interface Order {
  id: string;
  customerName: string;
  items: { menuItem: MenuItem; quantity: number; size?: string; milk?: string; extras?: string[] }[];
  total: number;
  status: "new" | "in-progress" | "ready" | "completed";
  pickupTime: string;
  createdAt: string;
}

export const mockOrders: Order[] = [
  {
    id: "ORD-001",
    customerName: "Alex Chen",
    items: [
      { menuItem: menuItems[1], quantity: 2, size: "Large", milk: "Oat Milk" },
      { menuItem: menuItems[10], quantity: 1 },
    ],
    total: 15.25,
    status: "new",
    pickupTime: "10:30 AM",
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: "ORD-002",
    customerName: "Sarah Kim",
    items: [
      { menuItem: menuItems[13], quantity: 1 },
      { menuItem: menuItems[6], quantity: 1, size: "Medium" },
    ],
    total: 16.5,
    status: "in-progress",
    pickupTime: "11:00 AM",
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
  },
  {
    id: "ORD-003",
    customerName: "Marcus Rivera",
    items: [
      { menuItem: menuItems[3], quantity: 1 },
      { menuItem: menuItems[11], quantity: 2 },
    ],
    total: 13.5,
    status: "ready",
    pickupTime: "11:15 AM",
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
  },
  {
    id: "ORD-004",
    customerName: "Emma Watson",
    items: [
      { menuItem: menuItems[17], quantity: 1 },
      { menuItem: menuItems[7], quantity: 1 },
    ],
    total: 16.5,
    status: "completed",
    pickupTime: "9:45 AM",
    createdAt: new Date(Date.now() - 120 * 60000).toISOString(),
  },
];
