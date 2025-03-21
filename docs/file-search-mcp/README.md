# FileSearch MCP Documentation

## Overview
The FileSearch MCP is a powerful tool that enables Cursor.ai to efficiently search and analyze your game's codebase. It combines multiple search strategies including semantic search, regex-based search, and fuzzy file matching to help locate and understand code components.

## Features
- Semantic code search
- Regex pattern matching
- Fuzzy file finding
- Symbol search across the codebase
- Directory listing and exploration
- File content reading

## Available Commands

### Semantic Search
```typescript
// Search for code semantically
codebase_search({
    query: "player movement implementation",
    target_directories: ["src/game", "src/physics"],
    explanation: "Finding player movement code to analyze the implementation"
})
```

### Pattern Matching
```typescript
// Search using regex patterns
grep_search({
    query: "class.*extends.*Scene",
    case_sensitive: false,
    include_pattern: "*.ts",
    exclude_pattern: "*.test.ts",
    explanation: "Finding all Phaser scene classes"
})
```

### File Search
```typescript
// Find files by name
file_search({
    query: "player",
    explanation: "Looking for player-related files"
})
```

### Symbol Search
```typescript
// Search for symbols (functions, classes, etc.)
search_symbols({
    query: "Player"
})
```

### Directory Exploration
```typescript
// List directory contents
list_dir({
    relative_workspace_path: "src/scenes",
    explanation: "Exploring game scenes directory"
})
```

### File Reading
```typescript
// Read file contents
read_file({
    target_file: "src/scenes/GameScene.ts",
    should_read_entire_file: false,
    start_line_one_indexed: 1,
    end_line_one_indexed_inclusive: 50,
    explanation: "Examining game scene implementation"
})
```

## Use Cases in Game Development

### 1. Finding Game Mechanics
```typescript
// Search for specific game mechanics
await codebase_search({
    query: "collision detection between player and enemies",
    target_directories: ["src/physics", "src/collision"],
    explanation: "Analyzing collision system implementation"
});
```

### 2. Locating Asset References
```typescript
// Find where assets are used
await grep_search({
    query: "load\\.image\\(['\"](player|enemy)",
    explanation: "Finding sprite loading code"
});
```

### 3. Understanding Code Structure
```typescript
// List all game scenes
await list_dir({
    relative_workspace_path: "src/scenes",
    explanation: "Exploring game structure"
});

// Find scene classes
await search_symbols({
    query: "Scene"
});
```

## Integration with Game Development

### 1. Code Navigation
- Use semantic search to find relevant code sections
- Use symbol search to locate specific components
- Use grep search for exact matches

### 2. Asset Management
- Search for asset loading code
- Find asset references across the codebase
- Locate configuration files

### 3. Debugging
- Find error handling code
- Locate specific game mechanics
- Search for performance-critical sections

## Best Practices

1. **Efficient Searching**
   - Use semantic search for concept-based queries
   - Use grep for exact pattern matching
   - Use file search for quick file location

2. **Code Analysis**
   - Combine different search methods
   - Use targeted directory searches
   - Read relevant file sections

3. **Performance**
   - Specify target directories when possible
   - Use specific search patterns
   - Avoid reading entire files unless necessary

## Common Use Cases and Solutions

### Finding Game Components
```typescript
// Locate all player-related code
await codebase_search({
    query: "player movement controls physics",
    target_directories: ["src/player"],
    explanation: "Finding player-related systems"
});
```

### Analyzing Dependencies
```typescript
// Find import statements
await grep_search({
    query: "import.*from",
    include_pattern: "*.ts",
    explanation: "Analyzing code dependencies"
});
```

### Locating Configuration
```typescript
// Find config files
await file_search({
    query: "config",
    explanation: "Looking for configuration files"
});
```

## Tips and Tricks

1. **Combining Search Methods**
```typescript
// First, find relevant files
const files = await file_search({
    query: "player",
    explanation: "Finding player-related files"
});

// Then, analyze their contents
for (const file of files) {
    await read_file({
        target_file: file,
        should_read_entire_file: false,
        start_line_one_indexed: 1,
        end_line_one_indexed_inclusive: 50,
        explanation: "Analyzing player implementation"
    });
}
```

2. **Efficient Code Navigation**
```typescript
// Find implementation first
await search_symbols({
    query: "PlayerController"
});

// Then examine specific sections
await read_file({
    target_file: "src/player/PlayerController.ts",
    should_read_entire_file: false,
    start_line_one_indexed: 1,
    end_line_one_indexed_inclusive: 100,
    explanation: "Examining player controller implementation"
});
```

## Conclusion
The FileSearch MCP is a versatile tool for navigating and understanding your game's codebase. By combining its various search capabilities, you can efficiently locate, analyze, and modify code components throughout your game development process. 