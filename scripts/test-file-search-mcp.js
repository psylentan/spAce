// Test script for FileSearch MCP
const {
    codebase_search,
    grep_search,
    file_search,
    search_symbols,
    list_dir,
    read_file
} = require('@cursor-ai/file-search-mcp');

async function testFileSearchMCP() {
    console.log('Testing FileSearch MCP...');

    try {
        // Test semantic search
        console.log('Testing semantic search...');
        const semanticResults = await codebase_search({
            query: "game initialization",
            target_directories: ["src/"]
        });
        console.log('Semantic search completed successfully');

        // Test grep search
        console.log('Testing grep search...');
        const grepResults = await grep_search({
            query: "class.*Scene",
            include_pattern: "*.ts"
        });
        console.log('Grep search completed successfully');

        // Test file search
        console.log('Testing file search...');
        const fileResults = await file_search({
            query: "scene",
            explanation: "Testing file search functionality"
        });
        console.log('File search completed successfully');

        // Test symbol search
        console.log('Testing symbol search...');
        const symbolResults = await search_symbols({
            query: "Scene"
        });
        console.log('Symbol search completed successfully');

        // Test directory listing
        console.log('Testing directory listing...');
        const dirContents = await list_dir({
            relative_workspace_path: "src/"
        });
        console.log('Directory listing completed successfully');

        // Test file reading
        console.log('Testing file reading...');
        const fileContents = await read_file({
            target_file: "package.json",
            should_read_entire_file: true,
            start_line_one_indexed: 1,
            end_line_one_indexed_inclusive: 100
        });
        console.log('File reading completed successfully');

        console.log('All FileSearch MCP tests passed!');
    } catch (error) {
        console.error('FileSearch MCP test failed:', error);
        process.exit(1);
    }
}

testFileSearchMCP(); 