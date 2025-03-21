// Test script for WebSearch MCP
const { web_search } = require('@cursor-ai/web-search-mcp');

async function testWebSearchMCP() {
    console.log('Testing WebSearch MCP...');

    try {
        // Test basic web search
        console.log('Testing basic web search...');
        const basicResults = await web_search({
            search_term: "Phaser 3 game development tutorial",
            explanation: "Testing basic web search functionality"
        });
        console.log('Basic web search completed successfully');

        // Test documentation search
        console.log('Testing documentation search...');
        const docResults = await web_search({
            search_term: "Phaser 3.70.0 API documentation",
            explanation: "Testing documentation search functionality"
        });
        console.log('Documentation search completed successfully');

        // Test error solution search
        console.log('Testing error solution search...');
        const errorResults = await web_search({
            search_term: "Phaser 3 TypeError game object undefined solution",
            explanation: "Testing error solution search functionality"
        });
        console.log('Error solution search completed successfully');

        console.log('All WebSearch MCP tests passed!');
    } catch (error) {
        console.error('WebSearch MCP test failed:', error);
        process.exit(1);
    }
}

testWebSearchMCP(); 