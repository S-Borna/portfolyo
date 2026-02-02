/**
 * PORTFOLYO COMPOUND COMPONENTS
 * Complex UI components built from primitives
 *
 * These components implement specific UX patterns
 * defined in the UX Specification.
 */

'use client';

import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import {
    Button,
    Input,
    Card,
    Modal,
    StatusBadge,
    Spinner,
    SectionHeader,
} from './primitives';
import { useUsernameValidation, useModal } from './hooks';

// ============================================================================
// TEMPLATE CARD
// ============================================================================

interface TemplateCardProps {
    id: string;
    name: string;
    family: string;
    preview: React.ReactNode;
    isSelected: boolean;
    isPremium: boolean;
    isLocked: boolean;
    onSelect: (id: string) => void;
    onUpgrade?: () => void;
}

export function TemplateCard({
    id,
    name,
    family,
    preview,
    isSelected,
    isPremium,
    isLocked,
    onSelect,
    onUpgrade,
}: TemplateCardProps) {
    const handleClick = () => {
        if (isLocked && onUpgrade) {
            onUpgrade();
        } else {
            onSelect(id);
        }
    };

    return (
        <button
            onClick={handleClick}
            className={cn(
                'relative w-full text-left rounded-xl border-2 transition-all overflow-hidden',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500',
                isSelected
                    ? 'border-red-500 ring-2 ring-red-500/20'
                    : 'border-zinc-800 hover:border-zinc-700',
                isLocked && 'opacity-75'
            )}
        >
            {/* Preview */}
            <div className="aspect-[4/3] bg-zinc-900 relative">
                {preview}

                {/* Selection indicator */}
                {isSelected && (
                    <div className="absolute top-3 right-3 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="white">
                            <path d="M5.5 9.5L3 7l-.7.7L5.5 11l7-7-.7-.7L5.5 9.5z" />
                        </svg>
                    </div>
                )}

                {/* Locked overlay */}
                {isLocked && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="text-center">
                            <svg className="w-8 h-8 mx-auto mb-2 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <span className="text-sm text-zinc-300">Uppgradera</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="p-3 bg-zinc-900/50">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-white text-sm">{name}</p>
                        <p className="text-xs text-zinc-500">{family}</p>
                    </div>
                    {isPremium && !isLocked && (
                        <span className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded">
                            Premium
                        </span>
                    )}
                </div>
            </div>
        </button>
    );
}

// ============================================================================
// TEMPLATE GRID
// ============================================================================

interface Template {
    id: string;
    name: string;
    family: string;
    preview: React.ReactNode;
    tier: 'free' | 'standard' | 'premium';
}

interface TemplateGridProps {
    templates: Template[];
    selectedId: string | null;
    userTier: 'free' | 'standard' | 'premium';
    onSelect: (id: string) => void;
    onUpgrade?: () => void;
}

export function TemplateGrid({
    templates,
    selectedId,
    userTier,
    onSelect,
    onUpgrade,
}: TemplateGridProps) {
    const tierOrder = { free: 0, standard: 1, premium: 2 };

    const isLocked = (templateTier: string) => {
        return tierOrder[templateTier as keyof typeof tierOrder] > tierOrder[userTier];
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {templates.map(template => (
                <TemplateCard
                    key={template.id}
                    id={template.id}
                    name={template.name}
                    family={template.family}
                    preview={template.preview}
                    isSelected={selectedId === template.id}
                    isPremium={template.tier !== 'free'}
                    isLocked={isLocked(template.tier)}
                    onSelect={onSelect}
                    onUpgrade={onUpgrade}
                />
            ))}
        </div>
    );
}

// ============================================================================
// PUBLISH MODAL
// ============================================================================

interface PublishModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPublish: (username: string) => Promise<void>;
    checkAvailability: (username: string) => Promise<boolean>;
    suggestedUsername?: string;
}

export function PublishModal({
    isOpen,
    onClose,
    onPublish,
    checkAvailability,
    suggestedUsername = '',
}: PublishModalProps) {
    const [username, setUsername] = useState(suggestedUsername);
    const [isPublishing, setIsPublishing] = useState(false);

    const validation = useUsernameValidation(username, checkAvailability);

    const handlePublish = async () => {
        if (!validation.isValid) return;

        setIsPublishing(true);
        try {
            await onPublish(username.toLowerCase().trim());
            onClose();
        } catch (error) {
            // Error handling via toast (passed from parent)
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Publicera din portfolio"
            description="Välj ett användarnamn för din permanenta URL. Detta kan inte ändras senare."
        >
            <div className="space-y-6">
                {/* URL Preview */}
                <div className="flex items-center bg-zinc-800 rounded-lg overflow-hidden">
                    <span className="px-4 py-3 text-zinc-500 bg-zinc-800/50 border-r border-zinc-700">
                        portfolyo.se/p/
                    </span>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase())}
                        placeholder="ditt-namn"
                        className="flex-1 px-4 py-3 bg-transparent text-white placeholder:text-zinc-500 focus:outline-none"
                        autoFocus
                    />
                    <div className="px-3">
                        {validation.isChecking && <Spinner size={18} className="text-zinc-500" />}
                        {!validation.isChecking && validation.isAvailable === true && (
                            <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        )}
                        {!validation.isChecking && validation.isAvailable === false && (
                            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        )}
                    </div>
                </div>

                {/* Error message */}
                {validation.error && (
                    <p className="text-sm text-red-500">{validation.error}</p>
                )}

                {/* Actions */}
                <div className="flex gap-3 justify-end">
                    <Button variant="secondary" onClick={onClose}>
                        Avbryt
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handlePublish}
                        disabled={!validation.isValid || isPublishing}
                        loading={isPublishing}
                    >
                        Publicera
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

// ============================================================================
// PORTFOLIO STATUS CARD
// ============================================================================

interface PortfolioStatusCardProps {
    name: string;
    tagline: string;
    status: 'live' | 'draft';
    url?: string;
    onEdit: () => void;
    onPublish?: () => void;
}

export function PortfolioStatusCard({
    name,
    tagline,
    status,
    url,
    onEdit,
    onPublish,
}: PortfolioStatusCardProps) {
    return (
        <Card className="space-y-4">
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white">{name}</h2>
                    <p className="text-zinc-400">{tagline}</p>
                </div>
                <StatusBadge status={status} />
            </div>

            {status === 'live' && url && (
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-red-500 hover:text-red-400 transition-colors"
                >
                    {url}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </a>
            )}

            <div className="flex gap-3">
                <Button variant="secondary" onClick={onEdit}>
                    Redigera
                </Button>
                {status === 'draft' && onPublish && (
                    <Button variant="primary" onClick={onPublish}>
                        Publicera
                    </Button>
                )}
            </div>
        </Card>
    );
}

// ============================================================================
// SKILL INPUT
// ============================================================================

interface SkillInputProps {
    skills: string[];
    onChange: (skills: string[]) => void;
    suggestions?: string[];
    maxSkills?: number;
}

export function SkillInput({
    skills,
    onChange,
    suggestions = [],
    maxSkills = 20,
}: SkillInputProps) {
    const [inputValue, setInputValue] = useState('');

    const addSkill = (skill: string) => {
        const trimmed = skill.trim();
        if (trimmed && !skills.includes(trimmed) && skills.length < maxSkills) {
            onChange([...skills, trimmed]);
        }
        setInputValue('');
    };

    const removeSkill = (skill: string) => {
        onChange(skills.filter(s => s !== skill));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSkill(inputValue);
        }
    };

    const availableSuggestions = suggestions.filter(s => !skills.includes(s));

    return (
        <div className="space-y-3">
            {/* Input */}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Lägg till en skill..."
                    className="flex-1 h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-red-500"
                />
                <Button
                    variant="secondary"
                    onClick={() => addSkill(inputValue)}
                    disabled={!inputValue.trim() || skills.length >= maxSkills}
                >
                    Lägg till
                </Button>
            </div>

            {/* Current skills */}
            {skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {skills.map(skill => (
                        <span
                            key={skill}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 rounded-full text-sm text-white"
                        >
                            {skill}
                            <button
                                onClick={() => removeSkill(skill)}
                                className="text-zinc-500 hover:text-red-500 transition-colors"
                            >
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                                    <path d="M4.646 4.646a.5.5 0 01.708 0L7 6.293l1.646-1.647a.5.5 0 01.708.708L7.707 7l1.647 1.646a.5.5 0 01-.708.708L7 7.707l-1.646 1.647a.5.5 0 01-.708-.708L6.293 7 4.646 5.354a.5.5 0 010-.708z" />
                                </svg>
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {/* Suggestions */}
            {availableSuggestions.length > 0 && skills.length < maxSkills && (
                <div>
                    <p className="text-xs text-zinc-500 mb-2">Förslag:</p>
                    <div className="flex flex-wrap gap-2">
                        {availableSuggestions.slice(0, 8).map(suggestion => (
                            <button
                                key={suggestion}
                                onClick={() => addSkill(suggestion)}
                                className="px-3 py-1 text-sm text-zinc-400 border border-zinc-800 rounded-full hover:bg-zinc-800 hover:text-white transition-colors"
                            >
                                + {suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Counter */}
            <p className="text-xs text-zinc-500 text-right">
                {skills.length}/{maxSkills} skills
            </p>
        </div>
    );
}

// ============================================================================
// TIER LIMIT MODAL
// ============================================================================

interface TierLimitModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: string;
    current: string;
    limit: string;
    upgradeLabel?: string;
    onUpgrade?: () => void;
}

export function TierLimitModal({
    isOpen,
    onClose,
    title,
    description,
    current,
    limit,
    upgradeLabel = 'Uppgradera',
    onUpgrade,
}: TierLimitModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} description={description}>
            <div className="space-y-6">
                {/* Current state */}
                <div className="p-4 bg-zinc-800/50 rounded-lg">
                    <p className="text-sm text-zinc-400">Din nuvarande användning:</p>
                    <p className="text-lg text-white font-medium mt-1">
                        {current} av {limit}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end">
                    <Button variant="ghost" onClick={onClose}>
                        Inte nu
                    </Button>
                    {onUpgrade && (
                        <Button variant="primary" onClick={onUpgrade}>
                            {upgradeLabel}
                        </Button>
                    )}
                </div>
            </div>
        </Modal>
    );
}

// ============================================================================
// CONFIRMATION DIALOG
// ============================================================================

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    destructive?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmLabel = 'Bekräfta',
    cancelLabel = 'Avbryt',
    destructive = false,
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    return (
        <Modal isOpen={isOpen} onClose={onCancel} title={title}>
            <div className="space-y-6">
                <p className="text-zinc-400">{message}</p>
                <div className="flex gap-3 justify-end">
                    <Button variant="secondary" onClick={onCancel}>
                        {cancelLabel}
                    </Button>
                    <Button
                        variant={destructive ? 'primary' : 'primary'}
                        onClick={onConfirm}
                        className={destructive ? 'bg-red-600 hover:bg-red-700' : ''}
                    >
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

// ============================================================================
// QUICK ACTIONS GRID
// ============================================================================

interface QuickAction {
    id: string;
    icon: React.ReactNode;
    label: string;
    description: string;
    onClick: () => void;
}

interface QuickActionsGridProps {
    actions: QuickAction[];
}

export function QuickActionsGrid({ actions }: QuickActionsGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {actions.map(action => (
                <button
                    key={action.id}
                    onClick={action.onClick}
                    className="flex items-start gap-4 p-4 bg-zinc-900/50 rounded-xl text-left hover:bg-zinc-800/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                >
                    <div className="p-2 bg-zinc-800 rounded-lg text-zinc-400">
                        {action.icon}
                    </div>
                    <div>
                        <p className="font-medium text-white">{action.label}</p>
                        <p className="text-sm text-zinc-500 mt-0.5">{action.description}</p>
                    </div>
                </button>
            ))}
        </div>
    );
}
