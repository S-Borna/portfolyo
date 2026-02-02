/**
 * PORTFOLYO DESIGN SYSTEM
 * Central export for all design system components
 *
 * Usage:
 *   import { Button, Input, useToast } from '@/components/design-system';
 */

// Design tokens
export * from './tokens';

// Primitive components
export {
    Button,
    Input,
    Textarea,
    Card,
    StatusBadge,
    Spinner,
    StatCard,
    ProgressBar,
    EmptyState,
    Toast,
    Modal,
    SectionHeader,
    Divider,
} from './primitives';

export type {
    ButtonVariant,
    ButtonSize,
} from './primitives';

// Compound components
export {
    TemplateCard,
    TemplateGrid,
    PublishModal,
    PortfolioStatusCard,
    SkillInput,
    TierLimitModal,
    ConfirmDialog,
    QuickActionsGrid,
} from './compounds';

// Interaction hooks
export {
    useToast,
    useUnsavedChanges,
    useFormState,
    useDebouncedValue,
    useUsernameValidation,
    useStepNavigation,
    useModal,
    useLoading,
    useConfirm,
    useKeyboardShortcut,
    useMediaQuery,
    useIsMobile,
    useIsTablet,
    useIsDesktop,
    usePrefersReducedMotion,
} from './hooks';
