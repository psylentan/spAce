# MCP Installation Guide

## Overview
The Multi-Channel Pipelines (MCPs) are built directly into Cursor.ai and don't require separate package installation. This guide will help you set up and configure the MCPs for your project.

## Prerequisites
- Cursor.ai IDE
- Node.js (v16 or higher)
- A modern web browser (Chrome recommended for debugging tools)

## Setup Steps

### 1. Create Required Directories
```bash
mkdir scripts debug-screenshots
```

### 2. Environment Configuration
Create a `.env` file in your project root:

```env
# BrowserTools MCP Configuration
BROWSER_TOOLS_DEBUG_MODE=true
BROWSER_TOOLS_SCREENSHOT_DIR=./debug-screenshots

# FileSearch MCP Configuration
FILE_SEARCH_INDEX_UPDATE=true
FILE_SEARCH_EXCLUDE_PATTERNS=node_modules,dist,build

# WebSearch MCP Configuration
WEB_SEARCH_CACHE_TIMEOUT=3600
```

### 3. MCP Configuration Files

#### BrowserTools MCP Configuration
Create `browser-tools-mcp.config.js`:
```javascript
module.exports = {
  debug: {
    enabled: true,
    consoleCapture: true,
    networkCapture: true
  },
  audit: {
    accessibility: true,
    performance: true,
    seo: true,
    bestPractices: true
  },
  screenshot: {
    outputDir: './debug-screenshots',
    format: 'png'
  }
};
```

#### FileSearch MCP Configuration
Create `file-search-mcp.config.js`:
```javascript
module.exports = {
  search: {
    includeDirs: ['src/', 'assets/'],
    excludeDirs: ['node_modules/', 'dist/'],
    fileTypes: ['.ts', '.tsx', '.js', '.jsx', '.json']
  },
  indexing: {
    enabled: true,
    updateOnChange: true
  }
};
```

#### WebSearch MCP Configuration
Create `web-search-mcp.config.js`:
```javascript
module.exports = {
  search: {
    defaultSources: ['docs.phaser.io', 'github.com/photonstorm/phaser'],
    cacheTimeout: 3600,
    maxResults: 10
  }
};
```

### 4. Test Scripts
Add the following scripts to your `package.json`:

```json
{
  "scripts": {
    "mcp:browser-tools-test": "node scripts/test-browser-tools-mcp.js",
    "mcp:file-search-test": "node scripts/test-file-search-mcp.js",
    "mcp:web-search-test": "node scripts/test-web-search-mcp.js",
    "mcp:test-all": "npm run mcp:browser-tools-test && npm run mcp:file-search-test && npm run mcp:web-search-test"
  }
}
```

## Usage

### BrowserTools MCP
```typescript
// In your game code
const screenshot = await mcp_browser_tools_takeScreenshot();
const consoleLogs = await mcp_browser_tools_getConsoleLogs();
const performanceReport = await mcp_browser_tools_runPerformanceAudit();
```

### FileSearch MCP
```typescript
// In your development scripts
const searchResults = await codebase_search({
    query: "player movement implementation",
    target_directories: ["src/"]
});

const files = await file_search({
    query: "scene",
    explanation: "Finding scene-related files"
});
```

### WebSearch MCP
```typescript
// In your development scripts
const searchResults = await web_search({
    search_term: "Phaser 3 game optimization techniques",
    explanation: "Finding performance optimization guides"
});
```

## Verification
After setting up the MCPs, you can verify their functionality:

1. Run the test scripts:
```bash
npm run mcp:test-all
```

2. Check the debug-screenshots directory for captured screenshots
3. Verify console output for test results

## Troubleshooting

### Common Issues

1. **BrowserTools MCP**
   - Issue: Screenshots not saving
     - Check if debug-screenshots directory exists
     - Verify BROWSER_TOOLS_SCREENSHOT_DIR path in .env

2. **FileSearch MCP**
   - Issue: Search not finding files
     - Check file-search-mcp.config.js includeDirs
     - Verify FILE_SEARCH_INDEX_UPDATE is true

3. **WebSearch MCP**
   - Issue: Search not returning results
     - Check internet connection
     - Verify web-search-mcp.config.js configuration

## Best Practices

1. **BrowserTools MCP**
   - Use screenshots for visual debugging
   - Regular performance audits
   - Monitor console for errors

2. **FileSearch MCP**
   - Keep search patterns specific
   - Use appropriate target directories
   - Combine with grep for precise results

3. **WebSearch MCP**
   - Include version numbers in searches
   - Use framework-specific terms
   - Cache results when appropriate

## Next Steps

1. Review the individual MCP documentation for advanced features
2. Set up automated testing using the MCPs
3. Integrate MCPs into your development workflow

## Support
For issues and questions, refer to the Cursor.ai documentation or community forums. 