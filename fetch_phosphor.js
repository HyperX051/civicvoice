const fs = require('fs');
const https = require('https');

const iconMap = {
  chart: "chart-line-up",
  globe: "globe",
  sparkles: "sparkle",
  logo: "buildings",
  home: "house",
  issues: "warning-circle",
  polls: "chart-bar",
  bell: "bell",
  dashboard: "squares-four",
  manage: "wrench",
  audit: "shield-check",
  users: "users",
  search: "magnifying-glass",
  plus: "plus",
  close: "x",
  mapPin: "map-pin",
  thumbsUp: "thumbs-up",
  messageCircle: "chat-circle",
  clock: "clock",
  checkCircle: "check-circle",
  alertTriangle: "warning",
  arrowUp: "arrow-up",
  arrowDown: "arrow-down",
  chevronDown: "caret-down",
  chevronRight: "caret-right",
  externalLink: "arrow-square-out",
  filter: "funnel",
  menu: "list",
  logout: "sign-out",
  mail: "envelope",
  user: "user",
  trendUp: "trend-up",
  activity: "activity",
  map: "map-trifold",
  list: "list-dashes",
  send: "paper-plane-right",
  eye: "eye",
  trash: "trash",
  shield: "shield",
  vote: "check-square",
  target: "target",
  info: "info",
  sun: "sun",
  fileText: "file-text"
};

const fetchSvg = (name) => {
  return new Promise((resolve, reject) => {
    https.get(`https://raw.githubusercontent.com/phosphor-icons/core/main/raw/regular/${name}.svg`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          // Normalize width and height to 1em so they scale perfectly via CSS font-size
          const cleaned = data.replace(/width=".*?"/, 'width="1em"').replace(/height=".*?"/, 'height="1em"');
          resolve(cleaned);
        } else {
          resolve(`<svg viewBox="0 0 256 256" fill="currentColor"></svg>`);
        }
      });
    }).on('error', reject);
  });
};

async function main() {
  let fileContent = `// ============================================\n// SVG Icons — Phosphor Icon Library\n// ============================================\n\nexport const icons = {\n`;
  
  for (const [key, phName] of Object.entries(iconMap)) {
    const svg = await fetchSvg(phName);
    fileContent += `  ${key}: \`${svg.trim()}\`,\n`;
  }
  
  fileContent += `};\n`;
  
  fs.writeFileSync('frontend/www/js/icons.js', fileContent);
  console.log("Successfully generated icons.js with Phosphor icons!");
}

main();
