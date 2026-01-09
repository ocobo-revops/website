# Component Inventory - OCOBO Website

*Generated: 2026-01-08*
*Part: main*
*Type: React Router v7 Web Application*

## Component Overview

The OCOBO website implements a comprehensive component library built on Radix UI primitives with custom styling via Panda CSS. Components are organized by function and reusability, following atomic design principles.

## Base UI Components (`app/components/ui/`)

### Form Components
| Component | File | Purpose | Dependencies |
|-----------|------|---------|--------------|
| **Button** | `Button.tsx` | Primary action buttons with variants | Radix Slot, Panda recipes |
| **IconButton** | `IconButton.tsx` | Icon-only buttons | Button component, Lucide icons |
| **Input** | `Input.tsx` | Text input fields with validation | Panda styling |
| **Label** | `Label.tsx` | Form field labels | Accessibility support |
| **Select** | `Select.tsx` | Dropdown selection component | Radix Select |

### Layout Components
| Component | File | Purpose | Dependencies |
|-----------|------|---------|--------------|
| **Container** | `Container.tsx` | Content width container | Panda patterns |
| **Card** | `Card.tsx` | Content cards and panels | Panda styling |
| **Carousel** | `Carousel.tsx` | Image/content carousel | react-snap-carousel |

### Navigation Components
| Component | File | Purpose | Dependencies |
|-----------|------|---------|--------------|
| **NavigationMenu** | `NavigationMenu.tsx` | Main navigation menu | Radix NavigationMenu |
| **Breadcrumb** | `Breadcrumb.tsx` | Navigation breadcrumbs | Custom implementation |

### Interactive Components
| Component | File | Purpose | Dependencies |
|-----------|------|---------|--------------|
| **Accordion** | `Accordion.tsx` | Expandable content sections | Radix Accordion |
| **ScrollArea** | `ScrollArea.tsx` | Custom scrollable areas | Radix ScrollArea |
| **DotButton** | `DotButton.tsx` | Carousel navigation dots | Custom styling |
| **DotPagination** | `DotPagination.tsx` | Pagination indicator | Custom implementation |

### Display Components
| Component | File | Purpose | Dependencies |
|-----------|------|---------|--------------|
| **Avatar** | `Avatar.tsx` | User profile images | Image handling |
| **Tag** | `Tag.tsx` | Content tags and labels | Panda styling |
| **Illustration** | `Illustration.tsx` | SVG illustrations | Custom wrapper |
| **Logocobo** | `Logocobo.tsx` | Company logo component | SVG assets |

### Feedback Components
| Component | File | Purpose | Dependencies |
|-----------|------|---------|--------------|
| **Loader** | `Loader.tsx` | Loading states | SVG animations |
| **Spinner** | `Spinner.tsx` | Inline loading indicator | CSS animations |
| **ScrollProgressBar** | `ScrollProgressBar.tsx` | Reading progress indicator | Scroll events |

## Feature-Specific Components

### Homepage Components (`app/components/homepage/`)
| Component | File | Purpose | Reusability |
|-----------|------|---------|-------------|
| **Hero** | `Hero.tsx` | Homepage hero section | Homepage-specific |
| **Better** | `Better.tsx` | "Better" value proposition | Homepage-specific |
| **Faster** | `Faster.tsx` | "Faster" value proposition | Homepage-specific |
| **Stronger** | `Stronger.tsx` | "Stronger" value proposition | Homepage-specific |
| **Aligned** | `Aligned.tsx` | "Aligned" value proposition | Homepage-specific |
| **Contact** | `Contact.tsx` | Contact CTA section | Reusable with props |
| **Stories** | `Stories.tsx` | Client stories showcase | Reusable |
| **Tools** | `Tools.tsx` | Tools/integrations display | Reusable |

### Blog Components (`app/components/blog/`)
| Component | File | Purpose | Reusability |
|-----------|------|---------|-------------|
| **BlogList** | `BlogList.tsx` | Blog posts listing | Blog-specific |
| **BlogItem** | `BlogItem.tsx` | Individual blog post card | Reusable for articles |
| **BlogArticle** | `BlogArticle.tsx` | Full blog post display | Blog-specific |
| **PostHeader** | `PostHeader.tsx` | Article header section | Reusable for content |
| **PostMetas** | `PostMetas.tsx` | Article metadata display | Reusable for content |

### Client Stories Components (`app/components/stories/`)
| Component | File | Purpose | Reusability |
|-----------|------|---------|-------------|
| **Hero** | `Hero.tsx` | Stories page hero | Stories-specific |
| **StoryList** | `StoryList.tsx` | Client stories listing | Stories-specific |
| **StoryItem** | `StoryItem.tsx` | Story card component | Reusable |
| **StoryArticle** | `StoryArticle.tsx` | Full story display | Stories-specific |
| **StoryHeader** | `StoryHeader.tsx` | Story header section | Reusable for content |
| **StoryMetas** | `StoryMetas.tsx` | Story metadata | Reusable for content |
| **StoryDeliverables** | `StoryDeliverables.tsx` | Deliverables section | Stories-specific |
| **StorySpeaker** | `StorySpeaker.tsx` | Speaker/testimonial | Reusable |
| **StoryMarkdownContainer** | `StoryMarkdownContainer.tsx` | Content wrapper | Reusable |

### Projects Components (`app/components/projects/`)
| Component | File | Purpose | Reusability |
|-----------|------|---------|-------------|
| **Hero** | `Hero.tsx` | Projects page hero | Projects-specific |
| **Card** | `Card.tsx` | Project cards | Reusable |
| **Contact** | `Contact.tsx` | Projects contact CTA | Reusable |
| **Levers*** | `Levers*.tsx` | Revenue operations levers | Projects-specific |
| **Team** | `Team.tsx` | Team showcase | Reusable |
| **SubSection** | `SubSection.tsx` | Content subsections | Reusable |

### Strategy Components (`app/components/strategy/`)
| Component | File | Purpose | Reusability |
|-----------|------|---------|-------------|
| **Hero** | `Hero.tsx` | Strategy page hero | Strategy-specific |
| **Choose** | `Choose.tsx` | Strategy selection | Strategy-specific |
| **Method*** | `Method*.tsx` | Methodology components | Strategy-specific |
| **Needs** | `Needs.tsx` | Needs assessment | Reusable |
| **Team** | `Team.tsx` | Team presentation | Reusable |

## Layout Components (Root Level)

### Application Layout
| Component | File | Purpose | Usage |
|-----------|------|---------|--------|
| **LayoutMain** | `LayoutMain.tsx` | Main application layout | All public pages |
| **LayoutPost** | `LayoutPost.tsx` | Blog/story layout | Content pages |
| **Header** | `Header.tsx` | Global site header | All pages |
| **Footer** | `Footer.tsx` | Global site footer | All pages |

### Navigation Components
| Component | File | Purpose | Usage |
|-----------|------|---------|--------|
| **MainMenu** | `MainMenu.tsx` | Desktop navigation | Header component |
| **MainMobileMenu** | `MainMobileMenu.tsx` | Mobile navigation | Header component |
| **MobileMenu** | `MobileMenu.tsx` | Mobile menu wrapper | Mobile layouts |
| **SubMenu** | `SubMenu.tsx` | Secondary navigation | Contextual |
| **LanguageSwitcher** | `LanguageSwitcher.tsx` | Language toggle | Header component |

## Content Components

### Content Processing
| Component | File | Purpose | Usage |
|-----------|------|---------|--------|
| **MarkdowContainer** | `MarkdowContainer.tsx` | Markdown content wrapper | Blog posts |
| **PageMarkdownContainer** | `PageMarkdownContainer.tsx` | Page content wrapper | Static pages |

### Media Components
| Component | File | Purpose | Usage |
|-----------|------|---------|--------|
| **PlayerYoutube** | `PlayerYoutube.tsx` | YouTube video player | Content embeds |
| **ClientCarousel** | `ClientCarousel.tsx` | Client showcase carousel | Homepage, stories |
| **ToolCarousel** | `ToolCarousel.tsx` | Tools/integrations carousel | Homepage |

## Form Components

### Contact Forms
| Component | File | Purpose | Usage |
|-----------|------|---------|--------|
| **ContactForm** | `ContactForm.tsx` | Main contact form | Contact page |
| **IntContactForm** | `IntContactForm.tsx` | International contact form | Localized contact |
| **NewsletterForm** | `NewsletterForm.tsx` | Newsletter subscription | Footer, CTAs |

### Form Support
| Component | File | Purpose | Usage |
|-----------|------|---------|--------|
| **ErrorMessage** | `ErrorMessage.tsx` | Form error display | All forms |

## Icon Components

### Custom Icons
| Component | File | Purpose | Usage |
|-----------|------|---------|--------|
| **Arrow** | `icons/Arrow.tsx` | Directional arrows | Navigation, CTAs |

## Component Categories by Reusability

### Highly Reusable (Design System)
- All `ui/` components
- Layout components (LayoutMain, Header, Footer)
- Content wrappers (MarkdownContainer, etc.)
- Form components (ContactForm patterns)

### Moderately Reusable (Feature Components)
- Card components (BlogItem, StoryItem)
- Hero variations (can be templated)
- Team showcase components
- Contact CTA sections

### Page-Specific (Limited Reusability)
- Homepage value proposition components
- Strategy methodology components
- Specific levers components
- Page-specific hero components

## Design System Integration

### Panda CSS Recipes Used
- **Button**: Multiple variants (primary, secondary, ghost)
- **Input**: Form field styling with states
- **Typography**: Consistent text styling
- **Section**: Page section patterns

### Radix UI Integration
- **Accordion**: Expandable content sections
- **NavigationMenu**: Main site navigation
- **Select**: Form dropdowns
- **ScrollArea**: Custom scrollbars
- **Slot**: Component composition

## Component Dependencies

### External Dependencies
- `@radix-ui/react-*`: UI primitives
- `lucide-react`: Icon library
- `react-snap-carousel`: Carousel functionality
- `framer-motion`: Animations

### Internal Dependencies
- Panda CSS recipes and patterns
- Custom hooks (useMenuItems, useWindowSize)
- Utility functions (metatags, labels)
- Internationalization (useTranslation)

## Component Standards

### File Organization
- One component per file
- Index files for category exports
- Co-located styles via Panda CSS
- TypeScript interfaces for props

### Naming Conventions
- PascalCase for component names
- Descriptive, domain-specific names
- Consistent naming across similar components
- Clear distinction between layout and content components

### Accessibility Features
- Radix UI provides accessible primitives
- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Semantic HTML structure

This component inventory provides a comprehensive overview of the OCOBO website's component architecture, supporting maintainable development and consistent user experience across all pages.