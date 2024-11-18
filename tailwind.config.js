module.exports = {
  content: [
    "./src/**/*.{js,jsx,css}", // Include all JS, JSX, and CSS files in src
    "./popup/**/*.{js,html}",   // Include all JS and HTML files in popup
    "./styles/**/*.{css}",       // Include all CSS files in styles
    "./background/**/*.{js}",    // Include all JS files in background
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)'
      },
      spacing: {
        'popup-width': '450px',
        'popup-height': '700px'
      }
    }
  },
  plugins: [],
  corePlugins: {
    float: false,
    objectFit: false,
    objectPosition: false,
    clear: false,
    placeholderColor: false,
    placeholderOpacity: false
  }
};