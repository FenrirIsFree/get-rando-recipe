# 🍳 Get Rando Recipe

A React app that fetches random recipes from the Spoonacular API based on your dietary preferences.

## Features

- 🎲 Get 5 random recipes with one click
- 🥗 Filter by dietary restrictions (vegetarian, vegan, gluten-free, etc.)
- 📖 View ingredients and cooking instructions
- 🔗 Link to original recipe sources

## Tech Stack

- React 18
- Redux for state management
- Axios for API calls
- Bootstrap 5 for styling

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
   Then edit `.env` and add your Spoonacular API key.

4. Start the development server
   ```bash
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Select any dietary restrictions from the dropdown
2. Click "Get 5 Random Recipes"
3. Click on any recipe title to see full details
4. Click "Back to Results" to browse other options

## License

MIT

---

*Built as a learning project during Parsity bootcamp, March 2023*
