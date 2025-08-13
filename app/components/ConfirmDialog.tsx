'use client';

import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger'
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: 'text-red-500',
          button: 'bg-red-500 hover:bg-red-600 focus:ring-red-500',
          border: 'border-red-200'
        };
      case 'warning':
        return {
          icon: 'text-amber-500',
          button: 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-500',
          border: 'border-amber-200'
        };
      case 'info':
        return {
          icon: 'text-accent-500',
          button: 'bg-accent-500 hover:bg-accent-600 focus:ring-accent-500',
          border: 'border-accent-200'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl shadow-large w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl bg-neutral-100 ${styles.icon}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h2 className="text-section text-foreground">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-xl transition-colors duration-200"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5 text-foreground-muted" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-body text-foreground-secondary mb-6">{message}</p>
          
          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`px-6 py-3 text-white rounded-xl font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${styles.button}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
