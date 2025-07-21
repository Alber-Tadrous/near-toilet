# 🚻 Restroom Finder

A modern React Native app built with Expo that helps users find clean, accessible public restrooms nearby. Built with TypeScript, Supabase, and beautiful UI components.

![Restroom Finder](https://images.pexels.com/photos/2467558/pexels-photo-2467558.jpeg?auto=compress&cs=tinysrgb&w=800)

## ✨ Features

### 🗺️ **Interactive Map**
- Real-time location-based restroom discovery
- Interactive markers with detailed information
- Distance calculation and directions
- Multiple map types (standard, satellite, terrain)

### 🔍 **Smart Search**
- Search by location, name, or landmark
- Advanced filtering options
- Accessibility feature filters
- Real-time results

### ➕ **Community Contributions**
- Add new restroom locations
- Upload photos and descriptions
- Rate cleanliness and accessibility
- Report issues or incorrect information

### ♿ **Accessibility Focus**
- Wheelchair accessibility indicators
- Baby changing station availability
- Grab bars and wide doorway information
- Braille signage indicators

### 👤 **User Profiles**
- Track your contributions
- View your reviews and ratings
- Achievement system
- Community impact statistics

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Expo CLI
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd restroom-finder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project
   - Run the database migrations (see Database Setup)
   - Update the Supabase configuration in `lib/supabase.ts`

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open the app**
   - Web: Open the provided localhost URL
   - Mobile: Scan the QR code with Expo Go app

## 🗄️ Database Setup

The app uses Supabase as the backend database. The database schema includes:

### Tables
- **users** - User profiles and authentication
- **restrooms** - Restroom locations and details
- **reviews** - User reviews and ratings
- **reports** - Community reports for moderation

### Key Features
- Row Level Security (RLS) for data protection
- Spatial queries for location-based searches
- Real-time subscriptions for live updates
- Automatic user statistics calculation

### Running Migrations

The database migrations are located in `supabase/migrations/`. They will be automatically applied when you connect to Supabase.

## 🏗️ Project Structure

```
├── app/                    # Expo Router pages
│   ├── (auth)/            # Authentication screens
│   ├── (tabs)/            # Main app tabs
│   └── _layout.tsx        # Root layout
├── components/            # Reusable UI components
│   ├── Map/              # Map-related components
│   ├── Badge.tsx         # Status badges
│   ├── RestroomCard.tsx  # Restroom display cards
│   └── ...
├── context/              # React Context providers
├── hooks/                # Custom React hooks
├── lib/                  # Business logic and services
│   ├── auth.ts          # Authentication service
│   ├── restrooms.ts     # Restroom data service
│   └── supabase.ts      # Supabase client
├── types/                # TypeScript type definitions
├── supabase/            # Database migrations
└── web-stubs/           # Web compatibility stubs
```

## 🛠️ Technology Stack

### Frontend
- **React Native** - Cross-platform mobile development
- **Expo** - Development platform and tooling
- **TypeScript** - Type-safe JavaScript
- **Expo Router** - File-based navigation

### Backend
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Database with spatial extensions
- **Row Level Security** - Data access control

### Maps & Location
- **react-native-maps** - Native map components
- **Leaflet** - Web map implementation
- **Expo Location** - GPS and location services

### UI & Styling
- **Lucide React Native** - Beautiful icons
- **StyleSheet** - React Native styling
- **Custom components** - Consistent design system

## 📱 Platform Support

### Mobile (iOS & Android)
- Native map components with react-native-maps
- GPS location services
- Camera integration for photos
- Push notifications (planned)

### Web
- Leaflet maps with OpenStreetMap
- Responsive design
- Progressive Web App features
- Desktop-optimized interface

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase Configuration

Update `lib/supabase.ts` with your Supabase credentials:

```typescript
const supabaseUrl = 'your_supabase_url';
const supabaseAnonKey = 'your_supabase_anon_key';
```

## 🧪 Development

### Running the App

```bash
# Start development server
npm run dev

# Build for web
npm run build:web

# Run linting
npm run lint
```

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Consistent component structure
- Modular architecture

### Adding New Features

1. Create components in `components/`
2. Add business logic to `lib/`
3. Update types in `types/`
4. Add database changes to `supabase/migrations/`

## 🗺️ Map Implementation

The app uses a dual-map approach:

### Native Maps (iOS/Android)
- **react-native-maps** for native performance
- Google Maps integration
- Native location services
- Optimized for mobile devices

### Web Maps
- **Leaflet** with OpenStreetMap tiles
- Responsive web interface
- Multiple tile providers
- Desktop-optimized controls

### Map Features
- Real-time user location
- Custom markers for restrooms
- Clustering for performance
- Distance calculations
- Route planning (planned)

## 🔐 Authentication & Security

### User Authentication
- Email/password authentication via Supabase
- Secure session management
- Password reset functionality
- Profile management

### Data Security
- Row Level Security (RLS) policies
- Authenticated API endpoints
- Input validation and sanitization
- HTTPS encryption

### Privacy
- Location data is not stored permanently
- User reviews are anonymizable
- GDPR compliance ready
- Opt-in location sharing

## 🚀 Deployment

### Web Deployment
```bash
npm run build:web
# Deploy the dist/ folder to your hosting provider
```

### Mobile Deployment
```bash
# Build for iOS
expo build:ios

# Build for Android
expo build:android
```

### Recommended Hosting
- **Vercel** - Web deployment
- **Netlify** - Static site hosting
- **Expo Application Services** - Mobile app distribution

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Development Guidelines
- Follow TypeScript best practices
- Write descriptive commit messages
- Update documentation for new features
- Test on both mobile and web platforms

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

### Getting Help
- Check the documentation
- Search existing issues
- Create a new issue with details
- Join our community discussions

### Common Issues
- **Location not working**: Check permissions
- **Maps not loading**: Verify API keys
- **Database errors**: Check Supabase configuration
- **Build failures**: Ensure dependencies are installed

## 🔮 Roadmap

### Upcoming Features
- [ ] Photo uploads for restrooms
- [ ] Offline map caching
- [ ] Push notifications
- [ ] Social features and reviews
- [ ] Admin dashboard
- [ ] API for third-party integrations

### Long-term Goals
- Multi-language support
- Advanced accessibility features
- Integration with city databases
- Community moderation tools
- Analytics and insights

---

**Made with ❤️ for the community**

*Helping everyone find clean, accessible restrooms wherever they go.*