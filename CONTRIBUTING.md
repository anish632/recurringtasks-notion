# Contributing to RecurringTasks

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/recurringtasks-notion.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test thoroughly
6. Commit with a descriptive message
7. Push to your fork
8. Create a Pull Request

## Development Setup

See [README.md](README.md) for detailed setup instructions.

Quick start:
```bash
npm install
cp .env.example .env.local
# Fill in .env.local with your credentials
npm run dev
```

## Code Style

- Use TypeScript for all new code
- Follow the existing code structure
- Use meaningful variable names
- Add comments for complex logic
- Run `npm run lint` before committing

## Commit Messages

Use clear, descriptive commit messages:

- `feat: Add webhook notifications`
- `fix: Resolve OAuth callback error`
- `docs: Update README with new examples`
- `refactor: Simplify scheduler logic`

## Pull Request Process

1. Update documentation if needed
2. Add tests for new features
3. Ensure all tests pass
4. Update CHANGELOG.md if applicable
5. Request review from maintainers

## Feature Ideas

Some ideas for contributions:

- [ ] Webhook notifications when tasks are created
- [ ] Email notifications via SendGrid
- [ ] More advanced cron expression builder UI
- [ ] Batch task creation
- [ ] Task templates with variable substitution
- [ ] Analytics dashboard
- [ ] Export/import rules
- [ ] Rule sharing between users
- [ ] Multi-language support
- [ ] Dark mode

## Bug Reports

When reporting bugs, include:

- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Environment (OS, browser, Node version)

## Questions?

Open a GitHub issue with the "question" label.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
