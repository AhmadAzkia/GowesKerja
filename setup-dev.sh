#!/bin/bash
# Development Setup Script for GowesKerja

echo "🚀 Setting up GowesKerja development environment..."

# Check if example files exist
if [ ! -f "config/firebase.example.ts" ]; then
    echo "❌ config/firebase.example.ts not found!"
    exit 1
fi

if [ ! -f "google-services.example.json" ]; then
    echo "❌ google-services.example.json not found!"
    exit 1
fi

# Copy example files if target files don't exist
if [ ! -f "config/firebase.ts" ]; then
    echo "📋 Copying firebase config example..."
    cp config/firebase.example.ts config/firebase.ts
    echo "⚠️  Please update config/firebase.ts with your Firebase credentials"
else
    echo "✅ config/firebase.ts already exists"
fi

if [ ! -f "google-services.json" ]; then
    echo "📋 Copying google-services example..."
    cp google-services.example.json google-services.json
    echo "⚠️  Please update google-services.json with your Firebase config"
else
    echo "✅ google-services.json already exists"
fi

echo ""
echo "🎯 Next steps:"
echo "1. Update config/firebase.ts with your Firebase project credentials"
echo "2. Update google-services.json with your Firebase project config"
echo "3. Run: npm install"
echo "4. Run: npx expo start"
echo ""
echo "📖 See README.md for detailed setup instructions"
