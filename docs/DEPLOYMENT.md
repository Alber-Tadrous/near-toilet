# 🚀 Deployment Guide

This guide covers deploying the Restroom Finder app to various platforms.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Web Deployment](#web-deployment)
- [Mobile Deployment](#mobile-deployment)
- [Database Setup](#database-setup)
- [Environment Configuration](#environment-configuration)
- [CI/CD Pipeline](#cicd-pipeline)

## ✅ Prerequisites

Before deploying, ensure you have:

- [ ] Supabase project set up
- [ ] Environment variables configured
- [ ] App tested locally
- [ ] Production build working
- [ ] Domain name (for web deployment)
- [ ] Apple Developer Account (for iOS)
- [ ] Google Play Console Account (for Android)

## 🌐 Web Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Build the project**
   ```bash
   npm run build:web
   ```

3. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

4. **Configure environment variables in Vercel dashboard**
   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`

### Option 2: Netlify

1. **Build the project**
   ```bash
   npm run build:web
   ```

2. **Deploy via Netlify CLI**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

3. **Or connect GitHub repository**
   - Connect your repo in Netlify dashboard
   - Set build command: `npm run build:web`
   - Set publish directory: `dist`

### Option 3: Static Hosting

For any static hosting provider (AWS S3, GitHub Pages, etc.):

1. **Build the project**
   ```bash
   npm run build:web
   ```

2. **Upload the `dist/` folder** to your hosting provider

### Web Deployment Checklist

- [ ] Environment variables set
- [ ] HTTPS enabled
- [ ] Custom domain configured
- [ ] Performance optimized
- [ ] SEO meta tags added
- [ ] Analytics configured

## 📱 Mobile Deployment

### iOS Deployment

#### Prerequisites
- Apple Developer Account ($99/year)
- Xcode installed (macOS only)
- iOS device for testing

#### Steps

1. **Configure app.json**
   ```json
   {
     "expo": {
       "ios": {
         "bundleIdentifier": "com.yourcompany.restroomfinder",
         "buildNumber": "1.0.0"
       }
     }
   }
   ```

2. **Build for iOS**
   ```bash
   eas build --platform ios
   ```

3. **Submit to App Store**
   ```bash
   eas submit --platform ios
   ```

### Android Deployment

#### Prerequisites
- Google Play Console Account ($25 one-time fee)
- Android device for testing

#### Steps

1. **Configure app.json**
   ```json
   {
     "expo": {
       "android": {
         "package": "com.yourcompany.restroomfinder",
         "versionCode": 1
       }
     }
   }
   ```

2. **Build for Android**
   ```bash
   eas build --platform android
   ```

3. **Submit to Google Play**
   ```bash
   eas submit --platform android
   ```

### EAS Build Configuration

Create `eas.json`:

```json
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  },
  "submit": {
    "production": {}
  }
}
```

## 🗄️ Database Setup

### Supabase Production Setup

1. **Create production project**
   - Go to [Supabase Dashboard](https://app.supabase.com)
   - Create new project
   - Choose a strong password

2. **Run migrations**
   ```bash
   # Migrations are automatically applied
   # Or manually run via Supabase dashboard
   ```

3. **Configure RLS policies**
   - Policies are included in migrations
   - Verify in Supabase dashboard

4. **Set up authentication**
   - Configure email templates
   - Set up OAuth providers (optional)
   - Configure password requirements

### Database Backup Strategy

1. **Automated backups**
   - Supabase provides daily backups
   - Configure retention period

2. **Manual backups**
   ```bash
   # Export data via Supabase CLI
   supabase db dump --file backup.sql
   ```

## ⚙️ Environment Configuration

### Production Environment Variables

Create production environment files:

#### `.env.production`
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_APP_ENV=production
```

### Security Considerations

1. **API Keys**
   - Use environment-specific keys
   - Rotate keys regularly
   - Monitor usage in Supabase dashboard

2. **Database Security**
   - Enable RLS on all tables
   - Review and test policies
   - Monitor for suspicious activity

3. **App Security**
   - Enable HTTPS only
   - Implement proper error handling
   - Sanitize user inputs

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  web-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build web
        run: npm run build:web
        env:
          EXPO_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          EXPO_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./

  mobile-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build mobile app
        run: eas build --platform all --non-interactive
```

### Required Secrets

Add these secrets to your GitHub repository:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `EXPO_TOKEN`

## 📊 Monitoring & Analytics

### Performance Monitoring

1. **Web Performance**
   - Google Analytics
   - Vercel Analytics
   - Core Web Vitals

2. **Mobile Performance**
   - Expo Analytics
   - Crashlytics
   - Performance monitoring

### Error Tracking

1. **Sentry Integration**
   ```bash
   npm install @sentry/react-native
   ```

2. **Configure Sentry**
   ```typescript
   import * as Sentry from '@sentry/react-native';
   
   Sentry.init({
     dsn: 'your-sentry-dsn',
   });
   ```

### Database Monitoring

1. **Supabase Dashboard**
   - Monitor query performance
   - Track API usage
   - Review error logs

2. **Custom Metrics**
   - User activity tracking
   - Feature usage analytics
   - Performance metrics

## 🔧 Troubleshooting

### Common Deployment Issues

#### Web Deployment
- **Build failures**: Check environment variables
- **Routing issues**: Verify Expo Router configuration
- **Performance**: Optimize bundle size

#### Mobile Deployment
- **Build errors**: Check native dependencies
- **Store rejection**: Review app store guidelines
- **Permissions**: Verify required permissions

#### Database Issues
- **Connection errors**: Check Supabase URL/keys
- **RLS policies**: Verify policy configuration
- **Performance**: Optimize queries and indexes

### Debug Commands

```bash
# Check build logs
expo build:status

# Test production build locally
npx serve dist

# Analyze bundle size
npx expo export --dump-assetmap

# Check for security issues
npm audit
```

## 📈 Post-Deployment

### Launch Checklist

- [ ] All features working in production
- [ ] Performance metrics baseline established
- [ ] Error tracking configured
- [ ] User feedback system in place
- [ ] Documentation updated
- [ ] Team trained on monitoring tools

### Maintenance Tasks

1. **Regular Updates**
   - Update dependencies monthly
   - Monitor security advisories
   - Review and update documentation

2. **Performance Optimization**
   - Monitor Core Web Vitals
   - Optimize database queries
   - Review and optimize bundle size

3. **User Feedback**
   - Monitor app store reviews
   - Track user support requests
   - Implement feature requests

---

For additional help, consult:
- [Expo Documentation](https://docs.expo.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)