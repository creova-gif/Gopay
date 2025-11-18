#!/bin/bash

# goPay Tanzania Super App - Replit Setup Script
# This script automates the setup process for Replit deployment

echo "🇹🇿 goPay Tanzania Super App - Replit Setup"
echo "============================================"
echo ""

# Check if running on Replit
if [ -z "$REPL_ID" ]; then
  echo "⚠️  Warning: Not running on Replit"
  echo "This script is optimized for Replit environment"
  echo ""
fi

# Step 1: Check Node version
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node -v)
echo "✅ Node.js $NODE_VERSION installed"
echo ""

# Step 2: Install dependencies
echo "📥 Installing dependencies..."
npm install --legacy-peer-deps
if [ $? -eq 0 ]; then
  echo "✅ Dependencies installed successfully"
else
  echo "❌ Failed to install dependencies"
  exit 1
fi
echo ""

# Step 3: Create necessary directories
echo "📁 Creating project directories..."
mkdir -p dist
mkdir -p public
mkdir -p components/ui
mkdir -p utils/supabase
echo "✅ Directories created"
echo ""

# Step 4: Check for environment variables
echo "🔐 Checking environment variables..."
if [ -z "$SUPABASE_URL" ]; then
  echo "⚠️  SUPABASE_URL not set"
  echo "Add it in Replit Secrets (🔒 icon)"
else
  echo "✅ SUPABASE_URL configured"
fi

if [ -z "$SUPABASE_ANON_KEY" ]; then
  echo "⚠️  SUPABASE_ANON_KEY not set"
  echo "Add it in Replit Secrets (🔒 icon)"
else
  echo "✅ SUPABASE_ANON_KEY configured"
fi
echo ""

# Step 5: Create .gitignore if not exists
if [ ! -f .gitignore ]; then
  echo "📝 Creating .gitignore..."
  cat > .gitignore << EOF
# Dependencies
node_modules/
package-lock.json
.pnpm-store/

# Build outputs
dist/
build/
.vite/

# Environment
.env
.env.local
.env.production

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Replit
.replit.nix
.cache/
.upm/

# Logs
*.log
npm-debug.log*
yarn-debug.log*

# Misc
.temp/
.tmp/
EOF
  echo "✅ .gitignore created"
else
  echo "✅ .gitignore already exists"
fi
echo ""

# Step 6: Verify critical files
echo "🔍 Verifying project structure..."
REQUIRED_FILES=(
  "index.html"
  "vite.config.ts"
  "tsconfig.json"
  "package.json"
  ".replit"
  "replit.nix"
)

MISSING_FILES=()
for file in "${REQUIRED_FILES[@]}"; do
  if [ ! -f "$file" ]; then
    MISSING_FILES+=("$file")
  fi
done

if [ ${#MISSING_FILES[@]} -eq 0 ]; then
  echo "✅ All required files present"
else
  echo "⚠️  Missing files:"
  for file in "${MISSING_FILES[@]}"; do
    echo "   - $file"
  done
fi
echo ""

# Step 7: Build test
echo "🏗️  Testing build process..."
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "✅ Build test passed"
else
  echo "⚠️  Build test failed (this is okay for first run)"
fi
echo ""

# Step 8: Display final instructions
echo "============================================"
echo "🎉 Setup Complete!"
echo "============================================"
echo ""
echo "Next Steps:"
echo "1. Click the green 'Run' button to start the dev server"
echo "2. View your app in the Webview panel"
echo "3. Configure Supabase secrets if needed"
echo ""
echo "Available Commands:"
echo "  npm run dev      - Start development server"
echo "  npm run build    - Build for production"
echo "  npm run preview  - Preview production build"
echo ""
echo "📚 Read REPLIT_DEPLOYMENT.md for detailed instructions"
echo ""
echo "🌐 Your app will be available at:"
echo "   https://$REPL_SLUG.$REPL_OWNER.repl.co"
echo ""
echo "Happy coding! 🚀"
