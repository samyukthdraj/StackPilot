# 🎨 Landing Page Redesign - GoDaylight Inspired

## Design Philosophy

Clean, minimal, elegant design inspired by GoDaylight.com with:

- Proper font sizing (not too large)
- Clean spacing and breathing room
- Subtle animations (no excessive motion)
- Accessibility-first approach
- No unnecessary skeleton loaders on landing page

## Key Changes Needed

### 1. Typography

```css
/* Hero Heading */
h1: text-5xl lg:text-6xl (instead of text-8xl)
font-weight: 700 (bold, not black/900)

/* Subheading */
p: text-lg lg:text-xl (instead of text-3xl)
font-weight: 400 (normal)

/* Body Text */
text-base (16px) for most content
line-height: 1.6 for readability
```

### 2. Hero Section

- Remove floating background blobs
- Simple gradient background: `bg-linear-to-b from-orange-50/30 via-white to-white`
- Clean badge with subtle animation
- Two clear CTAs: "Start Free Trial" and "Watch Demo"
- Simple stats row at bottom (no hover effects)
- NO dashboard preview skeleton

### 3. Features Section

```tsx
<section className="py-20 lg:py-28">
  <div className="max-w-6xl mx-auto px-6">
    {/* Clean header */}
    <div className="text-center mb-16">
      <h2 className="text-4xl lg:text-5xl font-bold mb-4">
        Everything you need
      </h2>
      <p className="text-lg text-gray-600">
        Powerful features for your job search
      </p>
    </div>

    {/* 3-column grid */}
    <div className="grid md:grid-cols-3 gap-8">
      {features.map((feature) => (
        <div className="p-6 rounded-2xl border border-gray-200 hover:border-orange-500 hover:shadow-lg transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center mb-4">
            <LordiconWrapper icon={feature.icon} size={24} color="#FF6B35" />
          </div>
          <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
          <p className="text-gray-600">{feature.description}</p>
        </div>
      ))}
    </div>
  </div>
</section>
```

### 4. How It Works Section

```tsx
<section className="py-20 bg-gray-50">
  <div className="max-w-6xl mx-auto px-6">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold mb-4">How it works</h2>
      <p className="text-lg text-gray-600">Get started in 3 simple steps</p>
    </div>

    <div className="grid md:grid-cols-3 gap-12">
      {steps.map((step, i) => (
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-orange-500 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">
            {i + 1}
          </div>
          <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
          <p className="text-gray-600">{step.description}</p>
        </div>
      ))}
    </div>
  </div>
</section>
```

### 5. CTA Section

```tsx
<section className="py-20">
  <div className="max-w-4xl mx-auto px-6 text-center">
    <h2 className="text-4xl font-bold mb-4">Ready to find your dream job?</h2>
    <p className="text-lg text-gray-600 mb-8">
      Join 10,000+ professionals using StackPilot
    </p>
    <Button size="lg" className="px-8 py-6">
      Get Started Free
    </Button>
    <p className="text-sm text-gray-500 mt-4">
      No credit card required • Free forever plan
    </p>
  </div>
</section>
```

## Color Palette

- Primary: #FF6B35 (Orange)
- Navy: #0A1929
- Gray scale: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900
- White backgrounds with subtle gray-50 sections

## Animation Guidelines

- Fade-in on scroll: `animate-fade-in-up`
- Hover lift: `hover:-translate-y-1 transition-transform duration-300`
- Border color transitions: `transition-colors duration-300`
- NO: Floating blobs, excessive rotations, complex transforms

## Accessibility

- All buttons have proper aria-labels
- Sufficient color contrast (WCAG AA minimum)
- Focus states visible on all interactive elements
- Semantic HTML (h1, h2, section, nav, etc.)
- Alt text on all images
- No animations that could cause motion sickness

## Spacing System

- Section padding: py-20 lg:py-28
- Container max-width: max-w-6xl
- Grid gaps: gap-8 or gap-12
- Element margins: mb-4, mb-8, mb-16

## Responsive Breakpoints

- Mobile: default
- Tablet: md: (768px)
- Desktop: lg: (1024px)

## Implementation Priority

1. ✅ Clean up hero section (remove blobs, fix font sizes)
2. ✅ Simplify features section (3-column grid, clean cards)
3. ✅ Add "How It Works" section
4. ✅ Clean CTA section
5. ✅ Remove all skeleton loaders from landing
6. ✅ Test accessibility with screen reader
7. ✅ Verify all animations are subtle

## Files to Modify

- `app/page.tsx` - Main landing page
- `components/landing/header.tsx` - Already updated
- `components/landing/footer.tsx` - Already updated
- `components/landing/features.tsx` - Simplify
- `app/globals.css` - Ensure animations are subtle

## Testing Checklist

- [ ] Fonts are readable (not too large)
- [ ] Animations are subtle
- [ ] No skeleton loaders on landing
- [ ] Passes WCAG AA contrast
- [ ] Works on mobile, tablet, desktop
- [ ] All interactive elements have focus states
- [ ] Page loads fast (< 3s)
- [ ] Images have alt text
- [ ] Buttons have clear labels
