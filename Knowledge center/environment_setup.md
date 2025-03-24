# Development Environment Setup

## Required Software
### Core Requirements
- Node.js (v18.0.0 or higher)
- Git (2.x or higher)
- VSCode (recommended IDE)
- Chrome/Firefox (latest) with DevTools

### Optional Tools
- Docker Desktop (for containerization)
- Postman (API testing)
- Git GUI client (SourceTree, GitKraken)

## VSCode Extensions
### Essential
- ESLint (`dbaeumer.vscode-eslint`)
- Prettier (`esbenp.prettier-vscode`)
- TypeScript Extension Pack (`loiane.ts-extension-pack`)
- Phaser Editor 2D (`phasereditor2d.phasereditor2d-vscode`)
- Live Server (`ritwickdey.liveserver`)

### Recommended
- GitLens (`eamodio.gitlens`)
- Error Lens (`usernamehw.errorlens`)
- Import Cost (`wix.vscode-import-cost`)
- Todo Tree (`gruntfuggly.todo-tree`)

## Local Setup

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/space-game.git
cd space-game
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
Create `.env` file:
```env
NODE_ENV=development
PORT=3000
ASSET_PATH=/assets/
DEBUG=true
```

### 4. VSCode Settings
Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "files.exclude": {
    "**/.git": true,
    "**/.DS_Store": true,
    "node_modules": true,
    "dist": true
  }
}
```

## Development Server

### Start Development Server
```bash
npm run dev
```
- Local: http://localhost:3000
- Network: http://your-ip:3000

### Available Commands
```bash
npm run dev      # Start development server
npm run build    # Build production bundle
npm run lint     # Run ESLint
npm run format   # Run Prettier
npm test        # Run tests
```

## Debug Configuration

### Chrome DevTools
1. Open DevTools (F12)
2. Sources tab → Add workspace
3. Enable source maps in webpack config

### VSCode Debugger
Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome against localhost",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}",
      "sourceMapPathOverrides": {
        "webpack:///src/*": "${webRoot}/src/*"
      }
    }
  ]
}
```

## Common Issues

### Node Version Mismatch
```bash
nvm use 18  # Switch to Node 18
```

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Unix
lsof -i :3000
kill -9 <PID>
```

### Webpack Build Issues
1. Clear cache:
```bash
npm cache clean --force
```
2. Delete node_modules:
```bash
rm -rf node_modules
npm install
```

## Performance Optimization

### VSCode
- Disable unnecessary extensions
- Use workspace trust
- Enable auto save

### Webpack
- Enable caching
- Use production mode
- Implement code splitting

### Browser
- Disable extensions in dev
- Use performance tab
- Enable FPS meter

## Questions/Suggestions:
1. Add Docker development environment?
2. Configure CI/CD pipelines?
3. Add pre-commit hooks?
4. Set up automated testing?
5. Configure production builds?

## TODO:
- [ ] Add Docker configuration
- [ ] Set up GitHub Actions
- [ ] Configure Husky pre-commit hooks
- [ ] Add Jest configuration
- [ ] Document production deployment

## Best Practices
1. Always use npm scripts
2. Commit often
3. Use meaningful commit messages
4. Keep dependencies updated
5. Document configuration changes 