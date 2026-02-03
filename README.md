# 🍳 Pick A Random Recipe

Discover new meals based on your dietary preferences using the Spoonacular API.

## Features

- 🎲 **Random Recipes** — Get 5 random recipes with one click
- 🥬 **Dietary Filters** — Vegetarian, vegan, keto, paleo, gluten-free, dairy-free, and more
- ❤️ **Favorites** — Save recipes you love (persisted to localStorage)
- 📅 **Meal Planner** — Plan your week with a visual calendar
- 🛒 **Shopping List** — Auto-generate a shopping list from your meal plan
  - Groups by store aisle
  - Combines duplicate ingredients
  - Check off items as you shop
  - Copy to clipboard
- 🌙 **Dark Mode** — Toggle or follows system preference
- 📱 **Responsive** — Works on mobile, tablet, and desktop

## Quick Start

```bash
# Clone the repo
git clone https://github.com/FenrirIsFree/get-rando-recipe.git
cd get-rando-recipe

# Install dependencies
npm install

# Create your .env file
cp .env.example .env
# Edit .env and add your Spoonacular API key

# Run the dev server
npm run dev
```

## Environment Variables

Get a free API key from [Spoonacular](https://spoonacular.com/food-api):

```
VITE_SPOONACULAR_API_KEY=your_api_key_here
```

## Scripts

- `npm run dev` — Start development server (localhost:5173)
- `npm run build` — Build for production
- `npm run preview` — Preview production build

## Tech Stack

- React 18
- Vite
- TanStack Query (React Query)
- Tailwind CSS
- React Select
- Axios

## Version History

- **v0.5.1** — Shopping list bug fixes (better pluralization, check all button, stale item cleanup)
- **v0.5.0** — Shopping list generator
- **v0.4.0** — Meal planner with weekly calendar, dark mode
- **v0.3.0** — React Query, Tailwind CSS, favorites
- **v0.2.0** — Environment variables, loading states, error handling

## License

MIT
