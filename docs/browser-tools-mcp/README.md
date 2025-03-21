# BrowserTools MCP Documentation

## Overview
The BrowserTools MCP is a powerful tool that enables Cursor.ai to interact with and inspect web-based games in real-time. It's particularly useful for debugging, testing, and analyzing web games built with frameworks like Phaser.

## Features
- Real-time inspection of game state
- Console log monitoring
- Performance analysis
- Screenshot capture
- DOM element inspection
- Accessibility testing
- SEO analysis
- Network monitoring

## Available Commands

### Console Monitoring
```typescript
// Get console logs
mcp_browser_tools_getConsoleLogs()

// Get console errors
mcp_browser_tools_getConsoleErrors()
```

### Network Monitoring
```typescript
// Get network errors
mcp_browser_tools_getNetworkErrors()

// Get all network logs
mcp_browser_tools_getNetworkLogs()
```

### Visual Debugging
```typescript
// Take a screenshot
mcp_browser_tools_takeScreenshot()

// Get selected element
mcp_browser_tools_getSelectedElement()
```

### Performance & Auditing
```typescript
// Run accessibility audit
mcp_browser_tools_runAccessibilityAudit()

// Run performance audit
mcp_browser_tools_runPerformanceAudit()

// Run SEO audit
mcp_browser_tools_runSEOAudit()

// Run best practices audit
mcp_browser_tools_runBestPracticesAudit()

// Run NextJS-specific audit
mcp_browser_tools_runNextJSAudit()
```

### Debug Mode
```typescript
// Enter debugger mode
mcp_browser_tools_runDebuggerMode()

// Run audit mode
mcp_browser_tools_runAuditMode()
```

### Utility Functions
```typescript
// Clear all logs
mcp_browser_tools_wipeLogs()
```

## Use Cases in Game Development

### 1. Performance Optimization
```typescript
// Monitor game performance
await mcp_browser_tools_runPerformanceAudit();
// Analyze results and optimize rendering, asset loading, etc.
```

### 2. Bug Tracking
```typescript
// Monitor for errors during gameplay
await mcp_browser_tools_getConsoleErrors();
await mcp_browser_tools_getNetworkErrors();
```

### 3. Visual Debugging
```typescript
// Capture game state for analysis
await mcp_browser_tools_takeScreenshot();
```

### 4. Accessibility Testing
```typescript
// Ensure game is accessible
await mcp_browser_tools_runAccessibilityAudit();
```

## Integration with Phaser

### Setup
1. No additional installation required - BrowserTools MCP is built into Cursor.ai
2. Works automatically with any web-based game

### Example Usage with Phaser
```typescript
// In your Phaser game scene
class GameScene extends Phaser.Scene {
    create() {
        // Set up your game...
        
        // Use BrowserTools MCP for debugging
        if (process.env.NODE_ENV === 'development') {
            // Monitor performance
            mcp_browser_tools_runPerformanceAudit();
            
            // Watch for errors
            mcp_browser_tools_getConsoleErrors();
        }
    }
}
```

## Best Practices

1. **Performance Monitoring**
   - Regularly run performance audits during development
   - Monitor console for warnings and errors
   - Use screenshots to document visual bugs

2. **Debugging**
   - Use debugger mode for complex issues
   - Monitor network calls for API issues
   - Keep logs clean with wipeLogs when needed

3. **Testing**
   - Run accessibility audits for inclusive gaming
   - Use best practices audit for code quality
   - Document issues with screenshots

## Common Issues and Solutions

### Issue: High Memory Usage
```typescript
// Monitor performance
await mcp_browser_tools_runPerformanceAudit();
// Check console for memory leaks
await mcp_browser_tools_getConsoleLogs();
```

### Issue: Game Not Responding
```typescript
// Enter debug mode
await mcp_browser_tools_runDebuggerMode();
// Check for errors
await mcp_browser_tools_getConsoleErrors();
```

## Tips and Tricks

1. **Automated Testing**
   ```typescript
   // Create a test suite that runs all audits
   async function runGameAudits() {
       await mcp_browser_tools_runPerformanceAudit();
       await mcp_browser_tools_runAccessibilityAudit();
       await mcp_browser_tools_runBestPracticesAudit();
   }
   ```

2. **Visual Regression Testing**
   ```typescript
   // Capture screenshots at key game states
   async function captureGameState(stateName: string) {
       await mcp_browser_tools_takeScreenshot();
   }
   ```

## Conclusion
The BrowserTools MCP is an essential tool for web game development, providing real-time insights and debugging capabilities. Use it to create more robust, performant, and accessible games. 