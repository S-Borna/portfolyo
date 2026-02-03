'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import {
  Loader2,
  Check,
  X,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Sparkles,
  ExternalLink,
  Download,
  Edit3,
  Trash2,
  Eye,
  Copy,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Menu,
  User,
  Settings,
  LogOut,
  CreditCard,
  Zap,
  Star,
  Heart,
  BookOpen,
  Code,
  Briefcase,
  GraduationCap,
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Github,
  Globe,
  Calendar,
  Save,
  FileText,
  Palette,
  Lock,
  Crown,
  Gift,
  AlertCircle,
  Search,
  Filter,
  Grid,
  LayoutGrid,
} from 'lucide-react';

// ============ BUTTON ============

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline' | 'ink';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  isLoading,
  disabled,
  leftIcon,
  rightIcon,
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed select-none';

  const variants = {
    primary: 'bg-slate-900 text-white hover:bg-slate-800 focus-visible:ring-slate-900 shadow-sm hover:shadow-md active:scale-[0.98]',
    secondary: 'bg-white text-slate-900 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 focus-visible:ring-slate-500 shadow-sm',
    ghost: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus-visible:ring-slate-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 shadow-sm',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-500 shadow-sm',
    outline: 'border border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white focus-visible:ring-slate-900',
    ink: 'bg-[#0b0d12] text-white hover:bg-[#1a1d24] focus-visible:ring-slate-900 shadow-sm hover:shadow-md active:scale-[0.98]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-sm gap-2',
    xl: 'px-6 py-3 text-base gap-2.5',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : leftIcon}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
}

// ============ INPUT ============

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({
  className,
  label,
  error,
  hint,
  id,
  leftIcon,
  rightIcon,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s/g, '-');

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          className={cn(
            'w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400',
            'focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-900/5',
            'transition-all duration-200 text-sm',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            error && 'border-red-400 focus:border-red-500 focus:ring-red-500/10',
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            {rightIcon}
          </div>
        )}
      </div>
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

// ============ TEXTAREA ============

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Textarea({ className, label, error, hint, id, ...props }: TextareaProps) {
  const inputId = id || label?.toLowerCase().replace(/\s/g, '-');

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={cn(
          'w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-gray-900 placeholder-gray-400',
          'focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10',
          'transition-all duration-200 resize-none min-h-[120px]',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/10',
          className
        )}
        {...props}
      />
      {hint && !error && <p className="text-sm text-gray-500">{hint}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

// ============ SELECT ============

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: Array<{ value: string; label: string }>;
}

export function Select({ className, label, error, hint, id, options, ...props }: SelectProps) {
  const inputId = id || label?.toLowerCase().replace(/\s/g, '-');

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <select
        id={inputId}
        className={cn(
          'w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-gray-900',
          'focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10',
          'transition-all duration-200 appearance-none cursor-pointer',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/10',
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hint && !error && <p className="text-sm text-gray-500">{hint}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

// ============ CARD ============

interface CardProps {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ className, children, hover, onClick, padding = 'md' }: CardProps) {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
  };

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
      className={cn(
        'bg-white rounded-xl border border-slate-200 shadow-sm',
        paddings[padding],
        hover && 'hover:shadow-md hover:border-slate-300 transition-all duration-300 cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}

// ============ BADGE ============

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'default', size = 'md', className }: BadgeProps) {
  const variants = {
    default: 'bg-slate-100 text-slate-700',
    primary: 'bg-slate-900 text-white',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    danger: 'bg-red-50 text-red-700 border border-red-200',
    outline: 'border border-slate-300 text-slate-600 bg-transparent',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px] tracking-wide',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span className={cn('inline-flex items-center font-medium rounded-md', variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
}

// ============ PROGRESS ============

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Progress({ value, max = 100, className, showLabel, size = 'md' }: ProgressProps) {
  const percentage = Math.round((value / max) * 100);

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>{value} av {max}</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div className={cn('w-full bg-gray-200 rounded-full overflow-hidden', sizes[size])}>
        <div
          className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// ============ AVATAR ============

interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg',
  };

  const initials = name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        className={cn('rounded-full object-cover', sizes[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-white font-semibold flex items-center justify-center',
        sizes[size],
        className
      )}
    >
      {initials}
    </div>
  );
}

// ============ TABS ============

interface TabsProps {
  tabs: Array<{ id: string; label: string; icon?: React.ReactNode }>;
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div className={cn('flex gap-1 p-1 bg-gray-100 rounded-xl', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2',
            activeTab === tab.id
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          )}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// ============ STEP INDICATOR ============

interface StepIndicatorProps {
  steps: string[] | { title: string; description?: string }[];
  currentStep: number;
  className?: string;
}

export function StepIndicator({ steps, currentStep, className }: StepIndicatorProps) {
  const getStepTitle = (step: string | { title: string; description?: string }) =>
    typeof step === 'string' ? step : step.title;

  return (
    <div className={cn('flex items-center justify-center', className)}>
      {steps.map((step, index) => (
        <React.Fragment key={getStepTitle(step)}>
          <div className="flex flex-col items-center">
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300',
                index < currentStep
                  ? 'bg-emerald-500 text-white'
                  : index === currentStep
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30'
                    : 'bg-gray-200 text-gray-500'
              )}
            >
              {index < currentStep ? (
                <Check className="h-5 w-5" />
              ) : (
                index + 1
              )}
            </div>
            <span className={cn(
              'text-xs mt-2 font-medium',
              index === currentStep ? 'text-violet-600' : 'text-gray-500'
            )}>
              {getStepTitle(step)}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                'w-16 h-1 mx-2 rounded-full transition-all duration-300',
                index < currentStep ? 'bg-emerald-500' : 'bg-gray-200'
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ============ MODAL ============

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className={cn(
        'relative bg-white rounded-2xl shadow-2xl w-full p-6',
        sizes[size]
      )}>
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

// ============ STAT CARD ============

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  trend?: { value: number; positive: boolean };
  className?: string;
}

export function StatCard({ icon, value, label, trend, className }: StatCardProps) {
  return (
    <Card className={cn('flex items-start gap-4', className)}>
      <div className="p-3 bg-violet-100 rounded-xl text-violet-600">
        {icon}
      </div>
      <div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900">{value}</span>
          {trend && (
            <span className={cn(
              'text-sm font-medium',
              trend.positive ? 'text-emerald-600' : 'text-red-600'
            )}>
              {trend.positive ? '+' : ''}{trend.value}%
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </Card>
  );
}

// ============ TECH BADGE ============

interface TechBadgeProps {
  name: string;
  icon?: string;
  className?: string;
}

export function TechBadge({ name, icon, className }: TechBadgeProps) {
  return (
    <div className={cn(
      'inline-flex items-center gap-2 px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-lg',
      className
    )}>
      {icon && (
        <img
          src={`https://cdn.simpleicons.org/${icon}/ffffff`}
          alt={name}
          className="h-4 w-4"
        />
      )}
      {name}
    </div>
  );
}

// ============ CREDIT DISPLAY ============

interface CreditDisplayProps {
  credits: number;
  maxCredits?: number;
  className?: string;
}

export function CreditDisplay({ credits, maxCredits, className }: CreditDisplayProps) {
  return (
    <div className={cn('flex items-center gap-2 px-3 py-1.5 bg-violet-50 rounded-lg', className)}>
      <Zap className="h-4 w-4 text-violet-600" />
      <span className="text-sm font-medium text-violet-900">
        {credits} {maxCredits ? `/ ${maxCredits}` : ''} credits
      </span>
    </div>
  );
}

// ============ EMPTY STATE ============

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
      {icon && (
        <div className="p-4 bg-gray-100 rounded-full text-gray-400 mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      {description && (
        <p className="text-gray-500 mb-4 max-w-sm">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick} leftIcon={<Plus className="h-4 w-4" />}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

// Export icons for use in other components
export const Icons = {
  Loader2,
  Check,
  X,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Sparkles,
  ExternalLink,
  Download,
  Edit3,
  Trash2,
  Eye,
  Copy,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Menu,
  User,
  Settings,
  LogOut,
  CreditCard,
  Zap,
  Star,
  Heart,
  BookOpen,
  Code,
  Briefcase,
  GraduationCap,
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Github,
  Globe,
  Calendar,
  Save,
  FileText,
  Palette,
  Lock,
  Crown,
  Gift,
  AlertCircle,
  Search,
  Filter,
  Grid,
  LayoutGrid,
};
