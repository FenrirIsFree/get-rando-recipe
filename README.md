# 🍳 Pick A Random Recipe

Discover new meals based on your dietary preferences using the Spoonacular API.

## Features

- 🎲 Get 5 random recipes with one click
- 🥬 Filter by diet (vegetarian, vegan, keto, paleo, gluten-free, dairy-free)
- ❤️ Save favorites to localStorage
- 📱 Responsive design with Tailwind CSS
- ⚡ Fast development with Vite

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

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Tech Stack

- React 18
- Vite
- TanStack Query (React Query)
- Tailwind CSS
- React Router
- Axios

## License

MIT
