# 🍳 Get Rando Recipe

A modern React app that fetches random recipes from the Spoonacular API based on your dietary preferences.

## Features

- 🎲 Get 5 random recipes with one click
- 🥗 Filter by dietary restrictions (vegetarian, vegan, gluten-free, keto, paleo)
- ❤️ Save favorite recipes to localStorage
- 📖 View ingredients and cooking instructions
- 🔗 Link to original recipe sources
- 📱 Fully responsive mobile design

## Tech Stack

- **React 18** with Hooks
- **TanStack Query** (React Query) for data fetching
- **Tailwind CSS** for styling
- **Axios** for API calls
- **React Select** for multi-select dropdowns

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- [Spoonacular API key](https://spoonacular.com/food-api) (free tier available)

### Installation

1. Clone the repo
   ```bash
   git clone https://github.com/FenrirIsFree/get-rando-recipe.git
   cd get-rando-recipe
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and add your Spoonacular API key:
   ```
   REACT_APP_SPOONACULAR_API_KEY=your_api_key_here
   ```

4. Start the development server
   ```bash
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Select any dietary restrictions from the dropdown
2. Click "Get 5 Random Recipes"
3. Click on any recipe card to see full details
4. Click the heart icon to save favorites
5. Access your saved favorites anytime with the "Favorites" button

## Project Structure

```
src/
├── App.js              # Main app component with state management
├── index.js            # Entry point with React Query provider
├── index.css           # Tailwind CSS imports
└── components/
    ├── foodOptions.js  # Dietary restriction selector
    └── RecipeCard.js   # Recipe preview card
```

## Changelog

### v0.3.0
- Replaced Redux with TanStack Query
- Replaced Bootstrap with Tailwind CSS
- Added favorite recipes feature (localStorage)
- Added responsive mobile design
- Added recipe images and dietary tags
- Improved loading and error states

### v0.2.0
- Moved API key to environment variable
- Added loading spinner and error handling
- Updated dependencies
- Improved documentation

### v0.1.0
- Initial release (Parsity bootcamp project)

## License

MIT

---

*Built as a learning project, March 2023. Modernized February 2026.*
