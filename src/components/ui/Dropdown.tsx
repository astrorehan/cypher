import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown, type LucideIcon } from 'lucide-react';

interface Option<T extends string> {
  value: T;
  label: string;
  description?: string;
  icon?: LucideIcon;
}

interface Props<T extends string> {
  id?: string;
  label: string;
  value: T;
  options: readonly Option<T>[];
  onChange: (value: T) => void;
  className?: string;
  showSelectedIcon?: boolean;
  minMenuWidth?: number;
}

export function Dropdown<T extends string>({ id, label, value, options, onChange, className = '', showSelectedIcon = true, minMenuWidth = 0 }: Props<T>) {
  const generatedId = useId();
  const controlId = id ?? generatedId;
  const listId = `${controlId}-options`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef({ text: '', time: 0 });
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [position, setPosition] = useState<React.CSSProperties>({});
  const selectedIndex = options.findIndex(option => option.value === value);
  const selected = options[selectedIndex];
  const SelectedIcon = selected?.icon;

  useLayoutEffect(() => {
    if (!open) return;
    const updatePosition = () => {
      const anchor = triggerRef.current?.getBoundingClientRect();
      if (!anchor) return;
      const below = window.innerHeight - anchor.bottom - 24;
      const above = anchor.top - 24;
      const menuHeight = Math.min(options.reduce((height, option) => height + (option.description ? 76 : 50), 16), 320);
      const upwards = below < menuHeight && above > below;
      const viewportWidth = document.documentElement.clientWidth;
      const width = Math.min(Math.max(anchor.width, minMenuWidth), viewportWidth - 32);
      setPosition({
        position: 'fixed',
        width,
        left: Math.max(16, Math.min(anchor.left, viewportWidth - width - 16)),
        ...(upwards ? { bottom: window.innerHeight - anchor.top + 8 } : { top: anchor.bottom + 8 }),
        maxHeight: Math.max(48, Math.min(320, upwards ? above : below)),
        transformOrigin: upwards ? 'bottom center' : 'top center',
      });
    };
    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open, options, minMenuWidth]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!triggerRef.current?.contains(target) && !popupRef.current?.contains(target)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  useEffect(() => {
    if (open) popupRef.current?.children[activeIndex]?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, open]);

  const showOptions = (index = Math.max(0, selectedIndex)) => {
    setActiveIndex(index);
    searchRef.current = { text: '', time: 0 };
    setOpen(true);
  };

  const choose = (index: number) => {
    const option = options[index];
    if (option) onChange(option.value);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!options.length) return;
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        event.preventDefault();
        if (!open) showOptions();
        else setActiveIndex(index => (index + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length);
        return;
      case 'Home':
      case 'End':
        event.preventDefault();
        showOptions(event.key === 'Home' ? 0 : options.length - 1);
        return;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (open) choose(activeIndex);
        else showOptions();
        return;
      case 'Escape':
        if (open) {
          event.preventDefault();
          event.stopPropagation();
          setOpen(false);
        }
        return;
      case 'Tab':
        setOpen(false);
        return;
    }
    if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) return;
    event.preventDefault();
    const now = performance.now();
    const text = `${now - searchRef.current.time < 700 ? searchRef.current.text : ''}${event.key.toLocaleLowerCase()}`;
    searchRef.current = { text, time: now };
    const query = [...text].every(char => char === text[0]) ? text[0] : text;
    const start = open ? activeIndex : selectedIndex;
    const match = options.map((_, index) => (start + index + 1 + options.length) % options.length)
      .find(index => options[index].label.toLocaleLowerCase().startsWith(query));
    if (match !== undefined) {
      setActiveIndex(match);
      setOpen(true);
    }
  };

  return (
    <div className={`min-w-0 ${className}`}>
      <label id={`${controlId}-label`} htmlFor={controlId} className="block text-[12px] font-semibold text-mid mb-2">{label}</label>
      <button
        ref={triggerRef}
        id={controlId}
        type="button"
        title={selected?.label}
        role="combobox"
        aria-labelledby={`${controlId}-label ${controlId}-value`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={open ? `${listId}-${activeIndex}` : undefined}
        disabled={!options.length}
        onClick={() => open ? setOpen(false) : showOptions()}
        onKeyDown={onKeyDown}
        onBlur={() => setOpen(false)}
        className={`dropdown-trigger liquid-control w-full min-h-11 rounded-xl px-3 flex items-center gap-2.5 text-left text-[13px] font-semibold text-hi cursor-pointer ${open ? 'is-open' : ''}`}
      >
        {showSelectedIcon && SelectedIcon && <SelectedIcon aria-hidden="true" className="w-4 h-4 text-core-600 shrink-0" strokeWidth={1.8} />}
        <span id={`${controlId}-value`} className="flex-1 truncate">{selected?.label ?? 'Pilih kategori'}</span>
        <ChevronDown aria-hidden="true" className={`dropdown-chevron w-4 h-4 text-lo shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && createPortal(
        <div
          ref={popupRef}
          id={listId}
          role="listbox"
          aria-labelledby={`${controlId}-label`}
          className="dropdown-panel dropdown-options rounded-[18px] p-1.5"
          style={position}
          onMouseDown={event => event.preventDefault()}
        >
          {options.map((option, index) => {
            const Icon = option.icon;
            const isSelected = option.value === value;
            return (
              <div
                key={option.value}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={isSelected}
                onPointerMove={event => { if (event.pointerType === 'mouse') setActiveIndex(index); }}
                onClick={() => choose(index)}
                className={`dropdown-option min-h-11 px-3 py-2.5 rounded-xl flex items-center gap-3 text-[13px] cursor-pointer ${isSelected ? 'is-selected' : ''} ${activeIndex === index ? 'is-highlighted' : ''}`}
              >
                {Icon && <span className="dropdown-option-icon w-7 h-7 rounded-lg flex items-center justify-center shrink-0"><Icon aria-hidden="true" className="w-4 h-4" strokeWidth={1.8} /></span>}
                <span className="flex-1 min-w-0">
                  <span className="block font-medium leading-snug break-words">{option.label}</span>
                  {option.description && <span className="block mt-1 text-[11px] leading-relaxed text-lo">{option.description}</span>}
                </span>
                {isSelected && <Check aria-hidden="true" className="w-4 h-4 text-core-600 shrink-0" strokeWidth={2.5} />}
              </div>
            );
          })}
        </div>,
        document.body,
      )}
    </div>
  );
}
