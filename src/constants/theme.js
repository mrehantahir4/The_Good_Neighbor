import colors from './colors';
import { s, vs, ms, rf } from '../utils/responsive';

export const theme = {
    colors,

    // Spacing (Responsive Margins & Paddings)
    spacing: {
        xs: s(4),
        s: s(8),
        m: s(16),
        l: s(24),
        xl: s(32),
        xxl: s(40),
    },

    // Font Sizes (Responsive Text Scaling)
    fontSize: {
        badge: rf(11),      // "Active Project", "Delivered" tags
        caption: rf(12),    // Sub-labels, time, dates
        bodySmall: rf(13),  // Input text, regular description
        body: rf(14),       // Normal body text
        bodyMedium: rf(15), // List items title
        subtitle: rf(16),   // Card headings
        title: rf(18),      // Section headers ("Nearby Neighbors", "Recent Campaigns")
        h2: rf(22),         // Screen subheaders ("Welcome Back")
        h1: rf(26),         // Big titles ("Log Job Address", "Project Pipeline")
        metric: rf(32),     // Big stats numbers ("12", "1,284", "68%")
    },

    // Border Radius (Matches screens' soft rounded look)
    radius: {
        xs: ms(4),
        s: ms(8),           // Inputs, small badges
        m: ms(12),          // Standard cards, project cards
        l: ms(16),          // Bottom sheets, big promo banners
        button: ms(10),     // Action buttons ("Sign in to Dashboard", "Send Postcards")
        pill: ms(999),      // Pill badges & floating circular buttons
    },

    // Shadows for Cards
    shadows: {
        card: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2, // Android shadow
        },
        button: {
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 4,
        },
    },
};

export default theme;
