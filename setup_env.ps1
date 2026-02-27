# setup_env.ps1
# This script adds your environment variables to Vercel.
# Make sure you are logged in (npx vercel login) and your project is linked (npx vercel link) before running.

$vars = @{
    "VITE_FIREBASE_API_KEY" = "AIzaSyBOVDkn80Fl1Vv2tVfUgHIfaTqhs9hGd6w"
    "VITE_FIREBASE_AUTH_DOMAIN" = "websitelelo-in.firebaseapp.com"
    "VITE_FIREBASE_PROJECT_ID" = "websitelelo-in"
    "VITE_FIREBASE_STORAGE_BUCKET" = "websitelelo-in.firebasestorage.app"
    "VITE_FIREBASE_MESSAGING_SENDER_ID" = "260962113823"
    "VITE_FIREBASE_APP_ID" = "1:260962113823:web:8a75e4c0efbba426e0782a"
    "VITE_WEB3FORMS_ACCESS_KEY" = "1dcc9ca5-60b6-455b-80a2-21841369796e"
    "MONGO_URI" = "mongodb+srv://admin:admin123@cluster0.abcde.mongodb.net/websitelelo?retryWrites=true&w=majority"
    "JWT_SECRET" = "websitelelo_secret_key_2024"
}

Write-Host "Starting environment variable setup for Vercel..." -ForegroundColor Cyan

foreach ($name in $vars.Keys) {
    $value = $vars[$name]
    Write-Host "Adding $name..." -ForegroundColor Yellow
    # Vercel env add <name> <environment> <value> is not standard, we pipe it
    echo $value | npx vercel env add $name production
    echo $value | npx vercel env add $name preview
    echo $value | npx vercel env add $name development
}

Write-Host "`nRequired but missing (Please add these manually in Vercel):" -ForegroundColor Red
Write-Host "- CLOUDINARY_CLOUD_NAME"
Write-Host "- CLOUDINARY_API_KEY"
Write-Host "- CLOUDINARY_API_SECRET"

Write-Host "`nSetup complete! Don't forget to push your changes or redeploy." -ForegroundColor Green
