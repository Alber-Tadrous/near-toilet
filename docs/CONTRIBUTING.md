# 🤝 Contributing to Restroom Finder

Thank you for your interest in contributing to Restroom Finder! This guide will help you get started with contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Code Style](#code-style)
- [Testing](#testing)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of:
- Age, body size, disability, ethnicity
- Gender identity and expression
- Level of experience, nationality
- Personal appearance, race, religion
- Sexual identity and orientation

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- Harassment, trolling, or derogatory comments
- Public or private harassment
- Publishing others' private information
- Other conduct which could reasonably be considered inappropriate

## 🚀 Getting Started

### Prerequisites

Before contributing, make sure you have:
- Node.js 18+ installed
- Git installed and configured
- A GitHub account
- Basic knowledge of React Native and TypeScript

### Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/restroom-finder.git
   cd restroom-finder
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/original-repo/restroom-finder.git
   ```

## 🛠️ Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment
```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Verify Setup
- Open the app in your browser
- Test basic functionality
- Check that maps are loading
- Verify database connection

## 📝 Contributing Guidelines

### Types of Contributions

We welcome several types of contributions:

#### 🐛 Bug Reports
- Use the bug report template
- Include steps to reproduce
- Provide screenshots if applicable
- Test on multiple platforms when possible

#### ✨ Feature Requests
- Use the feature request template
- Explain the use case and benefits
- Consider implementation complexity
- Discuss with maintainers first for large features

#### 🔧 Code Contributions
- Bug fixes
- New features
- Performance improvements
- Documentation updates
- Test improvements

#### 📚 Documentation
- README improvements
- API documentation
- Code comments
- Tutorial content

### Before You Start

1. **Check existing issues** to avoid duplicates
2. **Discuss large changes** in an issue first
3. **Follow the project structure** and conventions
4. **Test your changes** thoroughly

## 🔄 Pull Request Process

### 1. Create a Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-number
```

### 2. Make Your Changes
- Follow the code style guidelines
- Add tests for new functionality
- Update documentation as needed
- Commit with descriptive messages

### 3. Test Your Changes
```bash
# Run linting
npm run lint

# Test on web
npm run dev

# Test on mobile (if applicable)
# Use Expo Go app to test
```

### 4. Commit Guidelines
Use conventional commit messages:

```bash
# Features
git commit -m "feat: add photo upload functionality"

# Bug fixes
git commit -m "fix: resolve map loading issue on iOS"

# Documentation
git commit -m "docs: update API documentation"

# Refactoring
git commit -m "refactor: improve restroom service error handling"

# Tests
git commit -m "test: add unit tests for auth service"
```

### 5. Push and Create PR
```bash
git push origin your-branch-name
```

Then create a pull request on GitHub with:
- Clear title and description
- Reference related issues
- Screenshots for UI changes
- Testing instructions

### 6. PR Review Process
- Maintainers will review your PR
- Address any requested changes
- Keep your branch up to date with main
- Be responsive to feedback

## 🐛 Issue Guidelines

### Bug Reports

Use this template for bug reports:

```markdown
**Bug Description**
A clear description of the bug.

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment**
- Platform: [iOS/Android/Web]
- Version: [app version]
- Device: [device model]
```

### Feature Requests

Use this template for feature requests:

```markdown
**Feature Description**
A clear description of the feature.

**Use Case**
Why is this feature needed?

**Proposed Solution**
How should this feature work?

**Alternatives**
Any alternative solutions considered?

**Additional Context**
Any other context or screenshots.
```

## 🎨 Code Style

### TypeScript Guidelines

```typescript
// Use interfaces for object types
interface User {
  id: string;
  email: string;
  username?: string;
}

// Use descriptive function names
const getUserById = async (id: string): Promise<User | null> => {
  // Implementation
};

// Use proper error handling
try {
  const user = await getUserById(id);
  return user;
} catch (error) {
  console.error('Failed to get user:', error);
  throw error;
}
```

### React Native Guidelines

```typescript
// Use functional components with hooks
const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, [userId]);

  const loadUser = async () => {
    try {
      setLoading(true);
      const userData = await getUserById(userId);
      setUser(userData);
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Component JSX */}
    </View>
  );
};
```

### Styling Guidelines

```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
});
```

### File Organization

```
components/
├── Map/
│   ├── index.tsx          # Main export
│   ├── MapProvider.tsx    # Context provider
│   ├── WebMap.tsx         # Web implementation
│   └── NativeMap.tsx      # Native implementation
├── RestroomCard.tsx       # Single component
└── index.ts               # Barrel exports
```

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Writing Tests

```typescript
// Component tests
import { render, fireEvent } from '@testing-library/react-native';
import { RestroomCard } from '../RestroomCard';

describe('RestroomCard', () => {
  it('displays restroom information correctly', () => {
    const mockRestroom = {
      id: '1',
      name: 'Test Restroom',
      address: '123 Test St',
      // ... other properties
    };

    const { getByText } = render(
      <RestroomCard restroom={mockRestroom} />
    );

    expect(getByText('Test Restroom')).toBeTruthy();
    expect(getByText('123 Test St')).toBeTruthy();
  });
});

// Service tests
import { restroomService } from '../lib/restrooms';

describe('restroomService', () => {
  it('fetches nearby restrooms', async () => {
    const restrooms = await restroomService.getNearbyRestrooms(
      37.7749, -122.4194, 1000
    );
    
    expect(Array.isArray(restrooms)).toBe(true);
  });
});
```

## 📦 Project Structure

Understanding the project structure helps with contributions:

```
├── app/                    # Expo Router pages
│   ├── (auth)/            # Authentication screens
│   ├── (tabs)/            # Main app tabs
│   └── _layout.tsx        # Root layout
├── components/            # Reusable components
├── context/              # React Context providers
├── hooks/                # Custom React hooks
├── lib/                  # Business logic and services
├── types/                # TypeScript type definitions
├── docs/                 # Documentation
└── supabase/             # Database migrations
```

## 🏷️ Labels and Milestones

We use labels to categorize issues and PRs:

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `priority: high` - High priority items
- `platform: web` - Web-specific issues
- `platform: mobile` - Mobile-specific issues

## 🎯 Roadmap

Check our roadmap for planned features:
- Photo uploads for restrooms
- Offline map caching
- Push notifications
- Social features and reviews
- Admin dashboard

## 💬 Communication

- **GitHub Issues** - Bug reports and feature requests
- **GitHub Discussions** - General questions and ideas
- **Pull Request Comments** - Code review discussions

## 🙏 Recognition

Contributors will be recognized in:
- README contributors section
- Release notes for significant contributions
- Special thanks in documentation

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

Thank you for contributing to Restroom Finder! Your efforts help make public restrooms more accessible for everyone. 🚻✨