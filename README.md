# Economic Events Calendar

A modern web application for tracking global economic events with interactive map and list views.

## Features

- 🗺️ **Interactive World Map** - Visualize economic events by country with color-coded importance levels
- 📋 **List View** - Detailed table view with filtering and sorting capabilities
- 🔍 **Advanced Filters** - Filter by country, date, and impact level
- 🌓 **Dark Mode** - Full dark mode support
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- ⚡ **Real-time Data** - Fetches latest economic events from Investing.com API

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Maps**: react-simple-maps
- **Data Source**: Investing.com Economic Calendar API

## Getting Started

First, install dependencies:

```bash
npm install
# or
yarn install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
app/
├── api/
│   └── economic-events/    # API route for fetching events
├── components/
│   ├── filter-panel.tsx    # Filter UI component
│   └── news-list.tsx       # List view component
├── data/
│   └── country.json        # Country mapping data
├── types/
│   └── economic-event.ts   # TypeScript types
└── page.tsx                # Main page with map view
```

## Features in Detail

### Map View
- Interactive world map showing economic events by country
- Color-coded markers based on event importance (High: Red, Medium: Orange, Low: Green)
- Click on markers to view detailed event information
- Zoom and pan controls

### List View
- Sortable table with all economic events
- Currency tags with color coding
- Impact level indicators with star ratings
- Expandable event descriptions

### Filters
- **Date Picker**: Select any date to view events
- **Country Filter**: Select specific countries or regions
- **Impact Level**: Filter by High, Medium, or Low importance

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- Economic data provided by [Investing.com](https://www.investing.com)
- Map visualization powered by [react-simple-maps](https://www.react-simple-maps.io/)
- Built with [Next.js](https://nextjs.org)
