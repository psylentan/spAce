// Test script for BrowserTools MCP
const { 
    mcp_browser_tools_getConsoleLogs,
    mcp_browser_tools_getConsoleErrors,
    mcp_browser_tools_getNetworkLogs,
    mcp_browser_tools_takeScreenshot,
    mcp_browser_tools_runPerformanceAudit
} = require('@cursor-ai/browser-tools-mcp');

async function testBrowserToolsMCP() {
    console.log('Testing BrowserTools MCP...');

    try {
        // Test console logs
        console.log('Testing console log capture...');
        const logs = await mcp_browser_tools_getConsoleLogs();
        console.log('Console logs captured successfully');

        // Test console errors
        console.log('Testing console error capture...');
        const errors = await mcp_browser_tools_getConsoleErrors();
        console.log('Console errors captured successfully');

        // Test network logs
        console.log('Testing network log capture...');
        const networkLogs = await mcp_browser_tools_getNetworkLogs();
        console.log('Network logs captured successfully');

        // Test screenshot
        console.log('Testing screenshot capture...');
        await mcp_browser_tools_takeScreenshot();
        console.log('Screenshot captured successfully');

        // Test performance audit
        console.log('Testing performance audit...');
        await mcp_browser_tools_runPerformanceAudit();
        console.log('Performance audit completed successfully');

        console.log('All BrowserTools MCP tests passed!');
    } catch (error) {
        console.error('BrowserTools MCP test failed:', error);
        process.exit(1);
    }
}

testBrowserToolsMCP(); 